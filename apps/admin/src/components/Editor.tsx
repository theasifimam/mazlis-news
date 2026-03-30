"use client";

import React, { useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css'; // Premium code theme

if (typeof window !== 'undefined') {
    (window as any).hljs = hljs;
}

// Fix for Quill dynamic import (SSR issue)
const ReactQuill = dynamic(
    async () => {
        const { default: RQ } = await import('react-quill-new');
        return function forwardRef({ forwardedRef, ...props }: any) {
            return <RQ ref={forwardedRef} {...props} />;
        };
    },
    { ssr: false, loading: () => <div className="h-[500px] w-full bg-zinc-50 dark:bg-zinc-900/20 animate-pulse rounded-3xl" /> }
);

interface EditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

const Editor: React.FC<EditorProps> = ({ value, onChange, placeholder }) => {
    const modules = useMemo(() => ({
        syntax: { hljs },
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['link', 'image', 'video'],
                ['clean'],
                [{ 'color': [] }, { 'background': [] }],
                ['blockquote', 'code-block'],
            ],
        },
        clipboard: {
            matchVisual: false,
        }
    }), []);

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'align',
        'link', 'image', 'video',
        'color', 'background',
        'blockquote', 'code-block'
    ];

    return (
        <div className="quill-wrapper">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder || 'START WRITING...'}
                className="min-h-[500px]"
            />
            <style jsx global>{`
                .quill-wrapper {
                    --quill-border: #e4e4e7; /* zinc-200 */
                    --quill-bg: transparent;
                }
                
                .dark .quill-wrapper {
                    --quill-border: #18181b; /* zinc-900 */
                }

                .ql-toolbar.ql-snow {
                    border: 1px solid var(--quill-border) !important;
                    border-top-left-radius: 1rem;
                    border-top-right-radius: 1rem;
                    padding: 0.5rem !important;
                    background: white;
                    position: sticky;
                    top: -1px;
                    z-index: 10;
                }

                @media (min-width: 768px) {
                    .ql-toolbar.ql-snow {
                        border-top-left-radius: 1.5rem;
                        border-top-right-radius: 1.5rem;
                        padding: 1rem !important;
                    }
                }

                .dark .ql-toolbar.ql-snow {
                    background: #09090b;
                    border-color: #18181b !important;
                }

                .ql-container.ql-snow {
                    border: 1px solid var(--quill-border) !important;
                    border-top: none !important;
                    border-bottom-left-radius: 1rem;
                    border-bottom-right-radius: 1rem;
                    font-family: 'Inter', sans-serif !important;
                    font-size: 1rem !important;
                    min-height: 300px;
                }

                @media (min-width: 768px) {
                    .ql-container.ql-snow {
                        border-bottom-left-radius: 1.5rem;
                        border-bottom-right-radius: 1.5rem;
                        font-size: 1.125rem !important;
                        min-height: 500px;
                    }
                }

                .ql-editor {
                    min-height: 300px;
                    padding: 1rem !important;
                    line-height: 1.6 !important;
                    color: #27272a; /* zinc-800 */
                }

                @media (min-width: 768px) {
                    .ql-editor {
                        min-height: 500px;
                        padding: 2rem !important;
                        line-height: 1.8 !important;
                    }
                }

                .dark .ql-editor {
                    color: #d4d4d8; /* zinc-300 */
                }

                .ql-editor.ql-blank::before {
                    color: #a1a1aa !important; /* zinc-400 */
                    font-style: italic !important;
                    left: 1rem !important;
                    font-weight: 300 !important;
                }

                @media (min-width: 768px) {
                    .ql-editor.ql-blank::before {
                        left: 2rem !important;
                    }
                }

                .dark .ql-editor.ql-blank::before {
                    color: #3f3f46 !important; /* zinc-700 */
                }

                /* Toolbar Customization */
                .ql-snow .ql-stroke {
                    stroke: #71717a !important; /* zinc-500 */
                }

                .ql-snow .ql-fill {
                    fill: #71717a !important;
                }

                .ql-snow .ql-picker {
                    color: #71717a !important;
                }

                .dark .ql-stroke {
                    stroke: #a1a1aa !important;
                }

                .dark .ql-fill {
                    fill: #a1a1aa !important;
                }

                .ql-snow.ql-toolbar button:hover .ql-stroke,
                .ql-snow.ql-toolbar button.ql-active .ql-stroke {
                    stroke: #000 !important;
                }

                .dark .ql-snow.ql-toolbar button:hover .ql-stroke,
                .dark .ql-snow.ql-toolbar button.ql-active .ql-stroke {
                    stroke: #fff !important;
                }

                /* List and Indent Support in Editor */
                .ql-editor ul, .ql-editor ol {
                    padding-left: 1.2em !important;
                    list-style-position: outside !important;
                }
                
                @media (min-width: 768px) {
                    .ql-editor ul, .ql-editor ol {
                        padding-left: 1.5em !important;
                    }
                }
                
                .ql-editor ul { list-style-type: disc !important; }
                .ql-editor ol { list-style-type: decimal !important; }
                .ql-editor li { display: list-item !important; }
                
                .ql-indent-1 { padding-left: 2em !important; }
                .ql-indent-2 { padding-left: 3.5em !important; }
                .ql-indent-3 { padding-left: 5em !important; }
                
                /* Premium Code Snippet Highlights */
                .ql-editor pre.ql-syntax {
                    background-color: #282c34 !important;
                    color: #abb2bf !important;
                    border-radius: 1rem !important;
                    padding: 1rem !important;
                    font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
                    font-size: 0.85rem !important;
                    line-height: 1.6 !important;
                    margin: 1.5rem 0 !important;
                    border: 1px solid rgba(255, 255, 255, 0.05) !important;
                    box-shadow: 0 5px 15px -5px rgba(0,0,0,0.5);
                    white-space: pre-wrap !important;
                    word-break: break-all !important;
                }

                @media (min-width: 768px) {
                    .ql-editor pre.ql-syntax {
                        border-radius: 1.5rem !important;
                        padding: 1.5rem 2rem !important;
                        font-size: 0.95rem !important;
                        margin: 2rem 0 !important;
                        box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
                    }
                }

                .dark .ql-editor pre.ql-syntax {
                    background-color: #0b0e14 !important;
                    border-color: #1a1f26 !important;
                }

            `}</style>
        </div>
    );
};

export default Editor;
