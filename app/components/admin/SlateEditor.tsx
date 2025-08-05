'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { createEditor, Descendant, Editor, Transforms, Element as SlateElement, Text, Range } from 'slate';
import { Slate, Editable, withReact, RenderElementProps, RenderLeafProps } from 'slate-react';
import { withHistory } from 'slate-history';
import LinkModal from './LinkModal';

// Define custom types
type CustomElement = {
  type: 'paragraph' | 'heading-one' | 'heading-two' | 'heading-three' | 'bulleted-list' | 'list-item' | 'link';
  children: CustomText[];
  url?: string;
};

type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
};

declare module 'slate' {
  interface CustomTypes {
    Editor: Editor;
    Element: CustomElement;
    Text: CustomText;
  }
}

interface SlateEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SlateEditor: React.FC<SlateEditorProps> = ({ value, onChange, placeholder }) => {
  // Initialize editor
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  // Parse markdown-like content to Slate value
  const parseContent = (content: string): Descendant[] => {
    if (!content.trim()) {
      return [
        {
          type: 'paragraph',
          children: [{ text: '' }],
        },
      ];
    }

    const lines = content.split('\n');
    const result: Descendant[] = [];

    for (const line of lines) {
      if (line.startsWith('### ')) {
        result.push({
          type: 'heading-three',
          children: [{ text: line.substring(4) }],
        });
      } else if (line.startsWith('## ')) {
        result.push({
          type: 'heading-two',
          children: [{ text: line.substring(3) }],
        });
      } else if (line.startsWith('# ')) {
        result.push({
          type: 'heading-one',
          children: [{ text: line.substring(2) }],
        });
      } else if (line.startsWith('- ')) {
        result.push({
          type: 'list-item',
          children: [{ text: line.substring(2) }],
        });
      } else {
        // Parse inline formatting
        let text = line;
        const children: CustomText[] = [];
        
        // Simple markdown parsing for bold and italic
        const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/);
        
        for (const part of parts) {
          if (part.startsWith('**') && part.endsWith('**')) {
            children.push({ text: part.slice(2, -2), bold: true });
          } else if (part.startsWith('*') && part.endsWith('*')) {
            children.push({ text: part.slice(1, -1), italic: true });
          } else if (part) {
            children.push({ text: part });
          }
        }

        if (children.length === 0) {
          children.push({ text: '' });
        }

        result.push({
          type: 'paragraph',
          children,
        });
      }
    }

    return result.length > 0 ? result : [{ type: 'paragraph', children: [{ text: '' }] }];
  };

  // Convert Slate value to markdown-like string
  const serializeContent = (nodes: Descendant[]): string => {
    return nodes
      .map((node) => {
        if (SlateElement.isElement(node)) {
          const text = node.children
            .map((child) => {
              if (Text.isText(child)) {
                let str = child.text;
                if (child.bold) str = `**${str}**`;
                if (child.italic) str = `*${str}*`;
                return str;
              }
              return '';
            })
            .join('');

          switch (node.type) {
            case 'heading-one':
              return `# ${text}`;
            case 'heading-two':
              return `## ${text}`;
            case 'heading-three':
              return `### ${text}`;
            case 'list-item':
              return `- ${text}`;
            default:
              return text;
          }
        }
        return '';
      })
      .join('\n');
  };

  const [slateValue, setSlateValue] = useState<Descendant[]>(() => parseContent(value));
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');

  // Handle changes
  const handleChange = (newValue: Descendant[]) => {
    setSlateValue(newValue);
    const serialized = serializeContent(newValue);
    onChange(serialized);
  };

  // Render elements
  const renderElement = useCallback((props: RenderElementProps) => {
    const { attributes, children, element } = props;
    
    switch (element.type) {
      case 'heading-one':
        return <h1 {...attributes} className="text-3xl font-bold text-slate-900 mb-4">{children}</h1>;
      case 'heading-two':
        return <h2 {...attributes} className="text-2xl font-semibold text-slate-900 mb-3">{children}</h2>;
      case 'heading-three':
        return <h3 {...attributes} className="text-xl font-medium text-slate-900 mb-2">{children}</h3>;
      case 'list-item':
        return <li {...attributes} className="ml-4 list-disc text-slate-900">{children}</li>;
      case 'link':
        return (
          <a {...attributes} href={element.url} className="text-blue-600 hover:text-blue-800 underline">
            {children}
          </a>
        );
      default:
        return <p {...attributes} className="mb-2 text-slate-900">{children}</p>;
    }
  }, []);

  // Render leaves (text formatting)
  const renderLeaf = useCallback((props: RenderLeafProps) => {
    const { attributes, children, leaf } = props;
    
    let element = <span {...attributes}>{children}</span>;
    
    if (leaf.bold) {
      element = <strong>{element}</strong>;
    }
    
    if (leaf.italic) {
      element = <em>{element}</em>;
    }
    
    if (leaf.code) {
      element = <code className="bg-slate-100 px-1 rounded text-sm font-mono">{element}</code>;
    }
    
    return element;
  }, []);

  // Toolbar functions
  const toggleMark = (format: keyof CustomText) => {
    const isActive = isMarkActive(editor, format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  const toggleBlock = (format: CustomElement['type']) => {
    const isActive = isBlockActive(editor, format);
    const isList = ['bulleted-list', 'list-item'].includes(format);

    Transforms.unwrapNodes(editor, {
      match: n => SlateElement.isElement(n) && ['bulleted-list', 'list-item'].includes(n.type),
      split: true,
    });

    const newProperties: Partial<SlateElement> = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    };
    
    Transforms.setNodes(editor, newProperties);

    if (!isActive && isList) {
      const block = { type: 'bulleted-list' as const, children: [] };
      Transforms.wrapNodes(editor, block);
    }
  };

  const isMarkActive = (editor: Editor, format: keyof CustomText) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  };

  const isBlockActive = (editor: Editor, format: string) => {
    const { selection } = editor;
    if (!selection) return false;

    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: n => SlateElement.isElement(n) && n.type === format,
      })
    );

    return !!match;
  };

  const openLinkModal = () => {
    const { selection } = editor;
    if (selection && !Range.isCollapsed(selection)) {
      const selectedText = Editor.string(editor, selection);
      setSelectedText(selectedText);
    } else {
      setSelectedText('');
    }
    setIsLinkModalOpen(true);
  };

  const insertLink = (url: string, text: string) => {
    const { selection } = editor;
    const isCollapsed = selection && Range.isCollapsed(selection);
    
    const link: CustomElement = {
      type: 'link',
      url,
      children: [{ text }],
    };

    if (isCollapsed) {
      Transforms.insertNodes(editor, link);
    } else {
      Transforms.wrapNodes(editor, link, { split: true });
      Transforms.collapse(editor, { edge: 'end' });
    }
  };

  // Keyboard shortcuts
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!event.ctrlKey && !event.metaKey) return;

    switch (event.key) {
      case 'b':
        event.preventDefault();
        toggleMark('bold');
        break;
      case 'i':
        event.preventDefault();
        toggleMark('italic');
        break;
      case '`':
        event.preventDefault();
        toggleMark('code');
        break;
    }
  };

  return (
    <div className="border border-stone-300 rounded-lg">
      {/* Toolbar */}
      <div className="flex items-center space-x-2 p-3 border-b border-stone-200 bg-stone-50">
        <span className="text-sm font-medium text-slate-700">Formato:</span>
        
        {/* Format Dropdown */}
        <select 
          className="text-sm border border-stone-300 rounded px-2 py-1 bg-white text-slate-900"
          onChange={(e) => {
            const format = e.target.value as CustomElement['type'];
            if (format !== 'paragraph') {
              toggleBlock(format);
            }
          }}
          value="paragraph"
        >
          <option value="paragraph">Párrafo</option>
          <option value="heading-one">Título 1</option>
          <option value="heading-two">Título 2</option>
          <option value="heading-three">Título 3</option>
        </select>

        <div className="h-4 w-px bg-stone-300"></div>

        {/* Bold Button */}
        <button 
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark('bold');
          }}
          className={`p-2 hover:bg-stone-200 rounded font-bold transition-colors ${
            isMarkActive(editor, 'bold') ? 'bg-stone-200 text-amber-600' : 'text-slate-700'
          }`}
          title="Negrita (Ctrl+B)"
        >
          B
        </button>

        {/* Italic Button */}
        <button 
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark('italic');
          }}
          className={`p-2 hover:bg-stone-200 rounded italic transition-colors ${
            isMarkActive(editor, 'italic') ? 'bg-stone-200 text-amber-600' : 'text-slate-700'
          }`}
          title="Cursiva (Ctrl+I)"
        >
          I
        </button>

        {/* List Button */}
        <button 
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock('list-item');
          }}
          className={`p-2 hover:bg-stone-200 rounded transition-colors ${
            isBlockActive(editor, 'list-item') ? 'bg-stone-200 text-amber-600' : 'text-slate-700'
          }`}
          title="Lista con viñetas"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
          </svg>
        </button>

        {/* Link Button */}
        <button 
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            openLinkModal();
          }}
          className="p-2 hover:bg-stone-200 rounded text-slate-700 transition-colors" 
          title="Insertar enlace"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </button>

        <div className="h-4 w-px bg-stone-300"></div>
        <span className="text-xs text-slate-500">Rich Text</span>
      </div>

      {/* Editor */}
      <Slate editor={editor} initialValue={slateValue} onValueChange={handleChange}>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder={placeholder || "Escribe tu contenido aquí..."}
          onKeyDown={handleKeyDown}
          className="min-h-[400px] p-4 focus:outline-none"
          style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#0f172a'
          }}
        />
      </Slate>

      {/* Link Modal */}
      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onInsert={insertLink}
        selectedText={selectedText}
      />
    </div>
  );
};

export default SlateEditor;