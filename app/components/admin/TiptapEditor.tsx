'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';

interface FormatConfig {
  lineHeight: number;
  paragraphSpacing: number;
}

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  formatConfig?: FormatConfig;
  onFormatConfigChange?: (config: FormatConfig) => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  value,
  onChange,
  placeholder,
  formatConfig,
  onFormatConfigChange,
}) => {
  const [lineHeight, setLineHeight] = useState(formatConfig?.lineHeight || 1.4);
  const [paragraphSpacing, setParagraphSpacing] = useState(formatConfig?.paragraphSpacing || 0.5);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const isExternalUpdate = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Escribe tu contenido aquí...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'tiptap-content',
        dir: 'ltr',
      },
    },
    onUpdate: ({ editor }) => {
      if (isExternalUpdate.current) return;

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        const html = editor.getHTML();
        onChange(html);
      }, 300);
    },
  });

  // Sync external value changes
  useEffect(() => {
    if (!editor || !value) return;

    const currentHTML = editor.getHTML();
    // Avoid re-setting content if it matches what the editor already has
    if (currentHTML === value) return;

    isExternalUpdate.current = true;
    editor.commands.setContent(value, { emitUpdate: false });
    isExternalUpdate.current = false;
  }, [value, editor]);

  // Sync format config
  useEffect(() => {
    if (formatConfig) {
      setLineHeight(formatConfig.lineHeight);
      setParagraphSpacing(formatConfig.paragraphSpacing);
    }
  }, [formatConfig]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const promptForLink = useCallback(() => {
    if (!editor) return;

    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, '');

    if (selectedText) {
      setLinkText(selectedText);
      const existingHref = editor.getAttributes('link').href;
      setLinkUrl(existingHref || '');
      setShowLinkModal(true);
    }
  }, [editor]);

  const confirmLink = useCallback(() => {
    if (!linkUrl || !editor) return;

    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: linkUrl })
      .run();

    setShowLinkModal(false);
    setLinkUrl('');
    setLinkText('');
  }, [editor, linkUrl]);

  const removeLink = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
  }, [editor]);

  const getCurrentHeading = (): string => {
    if (!editor) return 'paragraph';
    if (editor.isActive('heading', { level: 1 })) return 'h1';
    if (editor.isActive('heading', { level: 2 })) return 'h2';
    if (editor.isActive('heading', { level: 3 })) return 'h3';
    if (editor.isActive('blockquote')) return 'blockquote';
    if (editor.isActive('codeBlock')) return 'codeBlock';
    return 'paragraph';
  };

  const setBlockType = (type: string) => {
    if (!editor) return;

    switch (type) {
      case 'paragraph':
        editor.chain().focus().setParagraph().run();
        break;
      case 'h1':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case 'h2':
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case 'h3':
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case 'blockquote':
        editor.chain().focus().toggleBlockquote().run();
        break;
      case 'codeBlock':
        editor.chain().focus().toggleCodeBlock().run();
        break;
    }
  };

  if (!editor) return null;

  return (
    <div className="border border-stone-300 rounded-lg bg-white">
      {/* Toolbar */}
      <div className="flex items-center flex-wrap gap-1 p-3 border-b border-stone-200 bg-stone-50">
        <span className="text-sm font-medium text-slate-700 mr-3">Formato:</span>

        {/* Block Type Controls */}
        <select
          className="text-sm border border-stone-300 rounded px-2 py-1 bg-white text-slate-900 mr-3"
          onChange={(e) => setBlockType(e.target.value)}
          value={getCurrentHeading()}
        >
          <option value="paragraph">Párrafo Normal</option>
          <option value="h1">Título 1</option>
          <option value="h2">Título 2</option>
          <option value="h3">Título 3</option>
          <option value="blockquote">Cita</option>
          <option value="codeBlock">Código</option>
        </select>

        <div className="h-6 w-px bg-stone-300 mr-3"></div>

        {/* Inline Style Controls */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          className={`px-3 py-1 text-sm font-bold rounded transition-colors ${
            editor.isActive('bold')
              ? 'bg-amber-200 text-amber-800'
              : 'bg-white text-slate-700 hover:bg-stone-100'
          } border border-stone-300`}
          title="Negrita (Ctrl+B)"
        >
          B
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
          className={`px-3 py-1 text-sm italic rounded transition-colors ${
            editor.isActive('italic')
              ? 'bg-amber-200 text-amber-800'
              : 'bg-white text-slate-700 hover:bg-stone-100'
          } border border-stone-300`}
          title="Cursiva (Ctrl+I)"
        >
          I
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleUnderline().run();
          }}
          className={`px-3 py-1 text-sm underline rounded transition-colors ${
            editor.isActive('underline')
              ? 'bg-amber-200 text-amber-800'
              : 'bg-white text-slate-700 hover:bg-stone-100'
          } border border-stone-300`}
          title="Subrayado (Ctrl+U)"
        >
          U
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleCode().run();
          }}
          className={`px-3 py-1 text-sm font-mono rounded transition-colors ${
            editor.isActive('code')
              ? 'bg-amber-200 text-amber-800'
              : 'bg-white text-slate-700 hover:bg-stone-100'
          } border border-stone-300`}
          title="Código Inline"
        >
          {'</>'}
        </button>

        <div className="h-6 w-px bg-stone-300 mx-3"></div>

        {/* Link Controls */}
        <button
          type="button"
          onClick={promptForLink}
          className="p-2 rounded transition-colors bg-white text-slate-700 hover:bg-stone-100 border border-stone-300"
          title="Agregar enlace (selecciona texto primero)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </button>

        <button
          type="button"
          onClick={removeLink}
          className="p-2 rounded transition-colors bg-white text-slate-700 hover:bg-stone-100 border border-stone-300"
          title="Quitar enlace"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="h-6 w-px bg-stone-300 mx-3"></div>

        {/* List Controls */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
          className={`p-2 rounded transition-colors ${
            editor.isActive('bulletList')
              ? 'bg-amber-200 text-amber-800'
              : 'bg-white text-slate-700 hover:bg-stone-100'
          } border border-stone-300`}
          title="Lista con viñetas"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
          </svg>
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          }}
          className={`p-2 rounded transition-colors ${
            editor.isActive('orderedList')
              ? 'bg-amber-200 text-amber-800'
              : 'bg-white text-slate-700 hover:bg-stone-100'
          } border border-stone-300`}
          title="Lista numerada"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2H9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9l2 2 4-4" />
          </svg>
        </button>

        <div className="h-6 w-px bg-stone-300 mx-3"></div>

        {/* Spacing Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="lineHeight" className="text-xs text-slate-600">
              Interlineado:
            </label>
            <select
              id="lineHeight"
              className="text-xs border border-stone-300 rounded px-2 py-1 bg-white text-slate-900"
              value={lineHeight}
              onChange={(e) => {
                const newLineHeight = parseFloat(e.target.value);
                setLineHeight(newLineHeight);
                onFormatConfigChange?.({ lineHeight: newLineHeight, paragraphSpacing });
              }}
            >
              <option value={1.0}>1.0</option>
              <option value={1.2}>1.2</option>
              <option value={1.4}>1.4</option>
              <option value={1.6}>1.6</option>
              <option value={1.8}>1.8</option>
              <option value={2.0}>2.0</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="paragraphSpacing" className="text-xs text-slate-600">
              Espaciado:
            </label>
            <select
              id="paragraphSpacing"
              className="text-xs border border-stone-300 rounded px-2 py-1 bg-white text-slate-900"
              value={paragraphSpacing}
              onChange={(e) => {
                const newParagraphSpacing = parseFloat(e.target.value);
                setParagraphSpacing(newParagraphSpacing);
                onFormatConfigChange?.({ lineHeight, paragraphSpacing: newParagraphSpacing });
              }}
            >
              <option value={0}>Sin espacio</option>
              <option value={0.25}>0.25em</option>
              <option value={0.5}>0.5em</option>
              <option value={0.75}>0.75em</option>
              <option value={1.0}>1.0em</option>
              <option value={1.5}>1.5em</option>
            </select>
          </div>
        </div>

        <div className="h-6 w-px bg-stone-300 mx-3"></div>
        <span className="text-xs text-slate-500">Tiptap Editor</span>
      </div>

      {/* Editor */}
      <div className="p-4">
        <div
          className="prose prose-slate max-w-none"
          style={{
            ['--tiptap-line-height' as string]: lineHeight,
            ['--tiptap-paragraph-spacing' as string]: `${paragraphSpacing}em`,
          }}
        >
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Agregar Enlace</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Texto seleccionado:
              </label>
              <p className="text-sm text-slate-600 bg-stone-50 p-2 rounded border border-stone-200">
                {linkText}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                URL:
              </label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://ejemplo.com"
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    confirmLink();
                  } else if (e.key === 'Escape') {
                    setShowLinkModal(false);
                    setLinkUrl('');
                    setLinkText('');
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowLinkModal(false);
                  setLinkUrl('');
                  setLinkText('');
                }}
                className="px-4 py-2 text-sm text-slate-700 hover:bg-stone-100 rounded transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmLink}
                disabled={!linkUrl}
                className="px-4 py-2 text-sm bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tiptap Editor Styles */}
      <style jsx global>{`
        .tiptap-content {
          min-height: 200px;
          font-size: 16px;
          line-height: var(--tiptap-line-height, 1.4);
          color: #0f172a;
          direction: ltr;
          text-align: left;
          outline: none;
        }
        .tiptap-content p {
          margin-bottom: var(--tiptap-paragraph-spacing, 0.5em);
          color: #0f172a;
        }
        .tiptap-content h1 {
          font-size: 2rem;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 0.5em;
          color: #1f2937;
        }
        .tiptap-content h2 {
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1.3;
          margin-bottom: 0.4em;
          color: #1f2937;
        }
        .tiptap-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          line-height: 1.4;
          margin-bottom: 0.3em;
          color: #1f2937;
        }
        .tiptap-content blockquote {
          border-left: 4px solid #d97706;
          padding-left: 1rem;
          margin: 1em 0;
          font-style: italic;
          color: #6b7280;
          background-color: #f9fafb;
        }
        .tiptap-content pre {
          background-color: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 1rem;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875rem;
          line-height: 1.6;
          color: #1f2937;
          margin: 1em 0;
        }
        .tiptap-content code {
          background-color: #f3f4f6;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: monospace;
          font-size: 0.9em;
        }
        .tiptap-content pre code {
          background: none;
          padding: 0;
        }
        .tiptap-content a {
          color: #d97706;
          text-decoration: underline;
          cursor: pointer;
        }
        .tiptap-content ul {
          list-style-type: disc;
          padding-left: 1.5em;
          margin: 0.5em 0;
        }
        .tiptap-content ol {
          list-style-type: decimal;
          padding-left: 1.5em;
          margin: 0.5em 0;
        }
        .tiptap-content li {
          margin: 0.25em 0;
        }
        .tiptap-content p.is-editor-empty:first-child::before {
          color: #94a3b8;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default TiptapEditor;
