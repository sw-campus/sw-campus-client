'use client'

import type { Editor } from '@tiptap/core'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useRef, useEffect } from 'react'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo,
  Redo,
  Link as LinkIcon,
  ImageIcon,
  Loader2,
} from 'lucide-react'

import { useImageUpload } from '@/features/storage/hooks/use-image-upload'
import { cn } from '@/lib/utils'

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
  minHeight?: string
}

export function TiptapEditor({
  content,
  onChange,
  placeholder = '내용을 입력해주세요...',
  className,
  minHeight = '300px',
}: TiptapEditorProps) {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const { uploadImage, isUploading } = useImageUpload()
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline',
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-4',
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[150px] px-4 py-3',
          'prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl',
          'prose-p:my-2',
          'prose-ul:list-disc prose-ol:list-decimal',
          'prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic',
          'prose-code:bg-gray-100 prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:text-sm',
        ),
      },
    },
    onUpdate: ({ editor }: { editor: Editor }) => {
      onChange(editor.getHTML())
    },
    immediatelyRender: false,
  })

  // 외부에서 content가 변경될 때 에디터 업데이트 (수정 모드에서 기존 데이터 로드 시)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [editor, content])

  if (!editor) {
    return null
  }

  const toggleLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    // update
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editor) return

    const result = await uploadImage(file, 'posts')
    if (result) {
      editor.chain().focus().setImage({ src: result.url }).run()
    }

    // Reset input
    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  return (
    <div className={cn('flex flex-col overflow-hidden rounded-lg border border-gray-300 bg-white', className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 p-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          icon={<Bold className="h-4 w-4" />}
          label="Bold"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          icon={<Italic className="h-4 w-4" />}
          label="Italic"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          icon={<UnderlineIcon className="h-4 w-4" />}
          label="Underline"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          icon={<Strikethrough className="h-4 w-4" />}
          label="Strike"
        />

        <div className="mx-1 h-5 w-px bg-gray-300" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          icon={<Heading2 className="h-4 w-4" />}
          label="H2"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          icon={<Heading3 className="h-4 w-4" />}
          label="H3"
        />

        <div className="mx-1 h-5 w-px bg-gray-300" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          icon={<List className="h-4 w-4" />}
          label="Bullet List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          icon={<ListOrdered className="h-4 w-4" />}
          label="Ordered List"
        />

        <div className="mx-1 h-5 w-px bg-gray-300" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          icon={<Quote className="h-4 w-4" />}
          label="Quote"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          icon={<Code className="h-4 w-4" />}
          label="Code"
        />
        <ToolbarButton
          onClick={toggleLink}
          isActive={editor.isActive('link')}
          icon={<LinkIcon className="h-4 w-4" />}
          label="Link"
        />

        <div className="mx-1 h-5 w-px bg-gray-300" />

        {/* 이미지 업로드 */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleImageUpload}
        />
        <ToolbarButton
          onClick={() => imageInputRef.current?.click()}
          disabled={isUploading}
          icon={isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
          label="Image"
        />

        <div className="mx-1 h-5 w-px bg-gray-300" />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          icon={<Undo className="h-4 w-4" />}
          label="Undo"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          icon={<Redo className="h-4 w-4" />}
          label="Redo"
        />
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} style={{ minHeight }} className="flex-grow cursor-text p-0" />

      {/* Styles for placeholder */}
      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}

interface ToolbarButtonProps {
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  icon: React.ReactNode
  label: string
}

function ToolbarButton({ onClick, isActive, disabled, icon, label }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'group relative flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900',
        isActive && 'bg-gray-200 font-semibold text-black',
        disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent hover:text-gray-500',
      )}
      title={label}
    >
      {icon}
    </button>
  )
}
