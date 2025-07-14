import { FC, useCallback, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Callout } from './tiptap-callout';
import { Collapsible } from './tiptap-collapsible';
import { Button } from '@/components/ui/button';
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Code, Quote, Undo, Redo, Heading1, Heading2, Heading3, Type, AlignLeft, AlignCenter, AlignRight, SeparatorVertical as Separator } from 'lucide-react';
import { HighlightBlock } from './tiptap-highlight-block';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';

interface RichTextEditorProps {
  content: any; // Tiptap JSON content
  onChange: (content: any) => void; // Returns Tiptap JSON
  placeholder?: string;
  className?: string;
}

const RichTextEditor: FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = 'Start writing your lesson content...',
  className = '',
}) => {
  const editorRef = useRef<any>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#4ECDC4] hover:text-[#4ECDC4]/80 underline cursor-pointer',
        },
      }),
      Callout,
      Collapsible,
      HighlightBlock,
      TaskList,
      TaskItem,
      Table.configure({
        resizable: true,
        lastColumnResizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content || {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [],
        },
      ],
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange(json);
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[300px] p-6 ${className}`,
        'data-placeholder': placeholder,
      },
    },
    immediatelyRender: false,
  });

  // Store editor reference
  useEffect(() => {
    if (editor) {
      editorRef.current = editor;
    }
  }, [editor]);

  // Update content when prop changes (but avoid infinite loops)
  useEffect(() => {
    if (editor && content && JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  const addImage = useCallback(() => {
    const url = window.prompt('Enter image URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return (
      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="p-6 text-center text-[#2C3E50]/60">
          Loading editor...
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Toolbar */}
      <div className="border-b p-3 flex flex-wrap gap-1 bg-[#F7F9F9]">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 pr-2 border-r border-[#E5E8E8]">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`h-8 w-8 p-0 ${editor.isActive('bold') ? 'bg-[#4ECDC4]/20 text-[#4ECDC4]' : 'text-[#2C3E50] hover:bg-[#4ECDC4]/10'}`}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`h-8 w-8 p-0 ${editor.isActive('italic') ? 'bg-[#4ECDC4]/20 text-[#4ECDC4]' : 'text-[#2C3E50] hover:bg-[#4ECDC4]/10'}`}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`h-8 w-8 p-0 ${editor.isActive('code') ? 'bg-[#4ECDC4]/20 text-[#4ECDC4]' : 'text-[#2C3E50] hover:bg-[#4ECDC4]/10'}`}
            title="Inline Code"
          >
            <Code className="h-4 w-4" />
          </Button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 pr-2 border-r border-[#E5E8E8]">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`h-8 w-8 p-0 ${editor.isActive('paragraph') ? 'bg-[#4ECDC4]/20 text-[#4ECDC4]' : 'text-[#2C3E50] hover:bg-[#4ECDC4]/10'}`}
            title="Paragraph"
          >
            <Type className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`h-8 w-8 p-0 ${editor.isActive('heading', { level: 1 }) ? 'bg-[#4ECDC4]/20 text-[#4ECDC4]' : 'text-[#2C3E50] hover:bg-[#4ECDC4]/10'}`}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`h-8 w-8 p-0 ${editor.isActive('heading', { level: 2 }) ? 'bg-[#4ECDC4]/20 text-[#4ECDC4]' : 'text-[#2C3E50] hover:bg-[#4ECDC4]/10'}`}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`h-8 w-8 p-0 ${editor.isActive('heading', { level: 3 }) ? 'bg-[#4ECDC4]/20 text-[#4ECDC4]' : 'text-[#2C3E50] hover:bg-[#4ECDC4]/10'}`}
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 pr-2 border-r border-[#E5E8E8]">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`h-8 w-8 p-0 ${editor.isActive('bulletList') ? 'bg-[#4ECDC4]/20 text-[#4ECDC4]' : 'text-[#2C3E50] hover:bg-[#4ECDC4]/10'}`}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`h-8 w-8 p-0 ${editor.isActive('orderedList') ? 'bg-[#4ECDC4]/20 text-[#4ECDC4]' : 'text-[#2C3E50] hover:bg-[#4ECDC4]/10'}`}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        {/* Block Elements */}
        <div className="flex items-center gap-1 pr-2 border-r border-[#E5E8E8]">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`h-8 w-8 p-0 ${editor.isActive('blockquote') ? 'bg-[#4ECDC4]/20 text-[#4ECDC4]' : 'text-[#2C3E50] hover:bg-[#4ECDC4]/10'}`}
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`h-8 w-8 p-0 ${editor.isActive('codeBlock') ? 'bg-[#4ECDC4]/20 text-[#4ECDC4]' : 'text-[#2C3E50] hover:bg-[#4ECDC4]/10'}`}
            title="Code Block"
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="h-8 w-8 p-0 text-[#2C3E50] hover:bg-[#4ECDC4]/10"
            title="Horizontal Rule"
          >
            <Separator className="h-4 w-4" />
          </Button>
        </div>

        {/* Media */}
        <div className="flex items-center gap-1 pr-2 border-r border-[#E5E8E8]">
          <Button
            variant="ghost"
            size="sm"
            onClick={addLink}
            className={`h-8 w-8 p-0 ${editor.isActive('link') ? 'bg-[#4ECDC4]/20 text-[#4ECDC4]' : 'text-[#2C3E50] hover:bg-[#4ECDC4]/10'}`}
            title="Add Link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={addImage}
            className="h-8 w-8 p-0 text-[#2C3E50] hover:bg-[#4ECDC4]/10"
            title="Add Image"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Callouts */}
        <div className="flex items-center gap-1 pr-2 border-r border-[#E5E8E8]">
          {['info', 'tip', 'warning', 'success'].map(type => (
            <Button
              key={type}
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setCallout(type).run()}
              className={`h-8 w-8 p-0 ${
                editor.isActive('callout', { type }) ? 'bg-[#4ECDC4]/20 text-[#4ECDC4]' : 'text-[#2C3E50] hover:bg-[#4ECDC4]/10'
              }`}
              title={type.charAt(0).toUpperCase() + type.slice(1) + ' Callout'}
            >
              {type === 'info' && 'ℹ️'}
              {type === 'tip' && '💡'}
              {type === 'warning' && '⚠️'}
              {type === 'success' && '✅'}
            </Button>
          ))}
        </div>

        {/* Collapsible Sections */}
        <div className="flex items-center gap-1 pr-2 border-r border-[#E5E8E8]">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const summary = window.prompt('Section title (e.g. FAQ, More Info):', 'Details');
              if (summary) editor.chain().focus().setCollapsible(summary).run();
            }}
            className={`h-8 w-8 p-0 text-[#2C3E50] hover:bg-[#4ECDC4]/10`}
            title="Add Collapsible Section"
          >
            <span className="text-lg">🔽</span>
          </Button>
        </div>

        {/* Highlight Block */}
        <div className="flex items-center gap-1 pr-2 border-r border-[#E5E8E8]">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const label = window.prompt('Label for highlight (e.g. Key Point, Summary):', 'Key Point');
              if (label) editor.chain().focus().setHighlightBlock(label).run();
            }}
            className="h-8 w-8 p-0 text-[#FF6B35] hover:bg-[#FF6B35]/10"
            title="Add Highlight Block"
          >
            <span className="font-bold text-lg">★</span>
          </Button>
        </div>

        {/* Checklists */}
        <div className="flex items-center gap-1 pr-2 border-r border-[#E5E8E8]">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={`h-8 w-8 p-0 ${editor.isActive('taskList') ? 'bg-[#4ECDC4]/20 text-[#4ECDC4]' : 'text-[#2C3E50] hover:bg-[#4ECDC4]/10'}`}
            title="Checklist"
          >
            <span className="text-lg">☑️</span>
          </Button>
        </div>

        {/* Tables */}
        <div className="flex items-center gap-1 pr-2 border-r border-[#E5E8E8]">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            className="h-8 w-8 p-0 text-[#2C3E50] hover:bg-[#4ECDC4]/10"
            title="Insert Table"
          >
            <span className="text-lg">🔲</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            className="h-8 w-8 p-0 text-[#2C3E50] hover:bg-[#4ECDC4]/10"
            title="Add Column"
          >
            <span className="text-lg">➕↔️</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().addRowAfter().run()}
            className="h-8 w-8 p-0 text-[#2C3E50] hover:bg-[#4ECDC4]/10"
            title="Add Row"
          >
            <span className="text-lg">➕↕️</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().deleteTable().run()}
            className="h-8 w-8 p-0 text-[#FF6B35] hover:bg-[#FF6B35]/10"
            title="Delete Table"
          >
            <span className="text-lg">❌</span>
          </Button>
        </div>

        {/* History */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="h-8 w-8 p-0 text-[#2C3E50] hover:bg-[#4ECDC4]/10 disabled:opacity-50"
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="h-8 w-8 p-0 text-[#2C3E50] hover:bg-[#4ECDC4]/10 disabled:opacity-50"
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative">
        <EditorContent 
          editor={editor} 
          className="prose-editor"
        />
        
        {/* Placeholder when empty */}
        {editor.isEmpty && (
          <div className="absolute top-6 left-6 text-[#2C3E50]/40 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;