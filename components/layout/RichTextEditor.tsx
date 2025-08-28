// src/components/RichTextEditor.tsx
"use client";

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import DOMPurify from 'dompurify';

// Use react-quill-new instead of react-quill
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your blog content here...",
  disabled = false,
  error
}: RichTextEditorProps) {
  
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', // ✅ Only 'list' needed
    'align',
    'link', 'image',
    'blockquote', 'code-block'
  ];
  

  const handleChange = (content: string) => {
    const sanitizedContent = DOMPurify.sanitize(content);
    onChange(sanitizedContent);
  };

  return (
    <div className="space-y-2">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={disabled}
        style={{
          height: '300px',
          marginBottom: '60px'
        }}
      />
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
}
