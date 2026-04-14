'use client';

import { useRef } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const editorRef = useRef<any>(null);

  const options = {
    spellChecker: false,
    placeholder: placeholder || '输入文章内容（支持 Markdown）...',
    toolbar: [
      'bold',
      'italic',
      'heading',
      '|',
      'quote',
      'unordered-list',
      'ordered-list',
      '|',
      'link',
      'image',
      '|',
      'preview',
      'side-by-side',
      'fullscreen',
      '|',
      'guide',
    ],
    status: ['lines', 'words', 'cursor'],
  } as any;

  return (
    <div className="markdown-editor">
      <SimpleMDE value={value} onChange={onChange} options={options} />
    </div>
  );
}
