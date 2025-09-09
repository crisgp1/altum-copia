'use client';

import React, { useState, useEffect } from 'react';
import { EditorState, RichUtils, getDefaultKeyBinding, KeyBindingUtil, convertToRaw, convertFromRaw, ContentState } from 'draft-js';
import { Editor } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'draft-js/dist/Draft.css';

interface DraftJsEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const DraftJsEditor: React.FC<DraftJsEditorProps> = ({ value, onChange, placeholder }) => {
  const [editorState, setEditorState] = useState(() => {
    if (value && value.trim()) {
      try {
        // Try to parse as HTML first
        const contentBlock = htmlToDraft(value);
        if (contentBlock && contentBlock.contentBlocks) {
          const contentState = ContentState.createFromBlockArray(
            contentBlock.contentBlocks,
            contentBlock.entityMap
          );
          return EditorState.createWithContent(contentState);
        }
      } catch (error) {
        console.warn('Could not parse HTML content, creating empty editor state');
      }
    }
    return EditorState.createEmpty();
  });

  // Convert editor state to HTML and notify parent
  const handleEditorChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
    const contentState = newEditorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    const htmlContent = draftToHtml(rawContentState);
    onChange(htmlContent);
  };

  // Handle keyboard shortcuts
  const handleKeyCommand = (command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      handleEditorChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  // Custom key bindings
  const mapKeyToEditorCommand = (e: React.KeyboardEvent) => {
    if (e.keyCode === 9) { // TAB
      const newEditorState = RichUtils.onTab(e, editorState, 4);
      if (newEditorState !== editorState) {
        handleEditorChange(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(e);
  };

  // Inline style controls
  const toggleInlineStyle = (inlineStyle: string) => {
    handleEditorChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  // Block type controls
  const toggleBlockType = (blockType: string) => {
    handleEditorChange(RichUtils.toggleBlockType(editorState, blockType));
  };

  // Check if inline style is active
  const isInlineStyleActive = (inlineStyle: string) => {
    const currentStyle = editorState.getCurrentInlineStyle();
    return currentStyle.has(inlineStyle);
  };

  // Check if block type is active
  const isBlockTypeActive = (blockType: string) => {
    const selection = editorState.getSelection();
    const blockKey = selection.getStartKey();
    const block = editorState.getCurrentContent().getBlockForKey(blockKey);
    return block && block.getType() === blockType;
  };

  return (
    <div className="border border-stone-300 rounded-lg bg-white">
      {/* Toolbar */}
      <div className="flex items-center flex-wrap gap-1 p-3 border-b border-stone-200 bg-stone-50">
        <span className="text-sm font-medium text-slate-700 mr-3">Formato:</span>
        
        {/* Block Type Controls */}
        <select 
          className="text-sm border border-stone-300 rounded px-2 py-1 bg-white text-slate-900 mr-3"
          onChange={(e) => toggleBlockType(e.target.value)}
          value="unstyled"
        >
          <option value="unstyled">Párrafo Normal</option>
          <option value="header-one">Título 1</option>
          <option value="header-two">Título 2</option>
          <option value="header-three">Título 3</option>
          <option value="blockquote">Cita</option>
          <option value="code-block">Código</option>
        </select>

        <div className="h-6 w-px bg-stone-300 mr-3"></div>

        {/* Inline Style Controls */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleInlineStyle('BOLD');
          }}
          className={`px-3 py-1 text-sm font-bold rounded transition-colors ${
            isInlineStyleActive('BOLD') 
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
            toggleInlineStyle('ITALIC');
          }}
          className={`px-3 py-1 text-sm italic rounded transition-colors ${
            isInlineStyleActive('ITALIC') 
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
            toggleInlineStyle('UNDERLINE');
          }}
          className={`px-3 py-1 text-sm underline rounded transition-colors ${
            isInlineStyleActive('UNDERLINE') 
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
            toggleInlineStyle('CODE');
          }}
          className={`px-3 py-1 text-sm font-mono rounded transition-colors ${
            isInlineStyleActive('CODE') 
              ? 'bg-amber-200 text-amber-800' 
              : 'bg-white text-slate-700 hover:bg-stone-100'
          } border border-stone-300`}
          title="Código Inline"
        >
          {'</>'}
        </button>

        <div className="h-6 w-px bg-stone-300 mx-3"></div>

        {/* List Controls */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlockType('unordered-list-item');
          }}
          className={`p-2 rounded transition-colors ${
            isBlockTypeActive('unordered-list-item') 
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
            toggleBlockType('ordered-list-item');
          }}
          className={`p-2 rounded transition-colors ${
            isBlockTypeActive('ordered-list-item') 
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
        <span className="text-xs text-slate-500">Draft.js Editor</span>
      </div>

      {/* Editor */}
      <div className="p-4">
        <div className="prose prose-slate max-w-none">
          <Editor
            editorState={editorState}
            handleKeyCommand={handleKeyCommand}
            keyBindingFn={mapKeyToEditorCommand}
            onChange={handleEditorChange}
            placeholder={placeholder || "Escribe tu contenido aquí..."}
            spellCheck={true}
          />
        </div>
      </div>
      
      <style jsx global>{`
        .DraftEditor-root {
          color: #0f172a !important;
        }
        .DraftEditor-editorContainer {
          color: #0f172a !important;
        }
        .public-DraftEditor-content {
          color: #0f172a !important;
        }
        .public-DraftEditor-content div {
          color: #0f172a !important;
        }
        .public-DraftEditor-content span {
          color: #0f172a !important;
        }
        .public-DraftEditor-content p {
          color: #0f172a !important;
        }
        .DraftEditor-editorContainer .public-DraftEditor-content {
          min-height: 200px;
          font-size: 16px;
          line-height: 1.6;
        }
        .public-DraftStyleDefault-block {
          margin-bottom: 1em;
        }
        .public-DraftEditor-content .public-DraftEditor-placeholder {
          color: #94a3b8 !important;
        }
      `}</style>
    </div>
  );
};

export default DraftJsEditor;