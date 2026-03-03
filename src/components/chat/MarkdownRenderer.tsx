import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="text-sm leading-relaxed break-words">
      <ReactMarkdown
        components={{
          // Tables with horizontal scroll wrapper
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
              <table className="w-full text-xs border-collapse min-w-[400px]">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gradient-to-r from-slate-700 to-slate-800 text-white sticky top-0">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-100">{children}</tbody>
          ),
          tr: ({ children, ...props }) => {
            // Check if inside tbody (data rows) for zebra striping
            return (
              <tr className="hover:bg-blue-50/50 transition-colors even:bg-slate-50/50">
                {children}
              </tr>
            );
          },
          th: ({ children }) => (
            <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-slate-700 text-xs">
              {children}
            </td>
          ),
          // Headers
          h1: ({ children }) => (
            <h1 className="text-lg font-bold text-slate-900 mt-4 mb-2 pb-1 border-b border-slate-200">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base font-bold text-slate-800 mt-4 mb-2 pb-1 border-b border-slate-100">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-bold text-slate-800 mt-3 mb-1.5">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-sm font-semibold text-slate-700 mt-2 mb-1">
              {children}
            </h4>
          ),
          // Paragraphs
          p: ({ children }) => (
            <p className="my-1.5 text-slate-700">{children}</p>
          ),
          // Lists
          ul: ({ children }) => (
            <ul className="my-1.5 ml-4 list-disc space-y-0.5 text-slate-700">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-1.5 ml-4 list-decimal space-y-0.5 text-slate-700">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-sm">{children}</li>
          ),
          // Inline
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-900">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-slate-600">{children}</em>
          ),
          // Code
          code: ({ children, className }) => {
            const isBlock = className?.includes('language-');
            if (isBlock) {
              return (
                <div className="my-2 overflow-x-auto rounded-md bg-slate-900 text-slate-100 p-3 text-xs">
                  <code>{children}</code>
                </div>
              );
            }
            return (
              <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded text-xs font-mono">
                {children}
              </code>
            );
          },
          // Blockquote
          blockquote: ({ children }) => (
            <blockquote className="my-2 border-l-3 border-blue-400 pl-3 text-slate-600 italic bg-blue-50/50 py-1 rounded-r">
              {children}
            </blockquote>
          ),
          // HR
          hr: () => <hr className="my-3 border-slate-200" />,
          // Links
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
