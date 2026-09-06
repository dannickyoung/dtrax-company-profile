"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useEffect, useState, useCallback } from "react";
import { getMedia } from "@/lib/db/media";

function useMediaResolver(markdown: string): string {
  const [resolved, setResolved] = useState(markdown);

  const resolve = useCallback(async (md: string) => {
    const mediaPattern = /media:\/\/([a-f0-9-]+)/g;
    const matches = [...md.matchAll(mediaPattern)];
    if (matches.length === 0) {
      setResolved(md);
      return;
    }

    let result = md;
    for (const match of matches) {
      const mediaId = match[1];
      const url = await getMedia(mediaId);
      if (url) {
        result = result.replaceAll(`media://${mediaId}`, url);
      }
    }
    setResolved(result);
  }, []);

  useEffect(() => {
    resolve(markdown);
  }, [markdown, resolve]);

  return resolved;
}

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const resolvedContent = useMediaResolver(content);

  return (
    <div className={`prose-neon ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-text-primary mb-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold text-text-primary mb-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-text-primary mb-2">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-base text-text-secondary leading-relaxed mb-4">{children}</p>
          ),
          a: ({ href, children }) => (
            <a href={href} className="text-neon-cyan hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-text-secondary mb-4 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-text-secondary mb-4 space-y-1">{children}</ol>
          ),
          code: ({ className: codeClassName, children }) => {
            const isInline = !codeClassName;
            if (isInline) {
              return (
                <code className="bg-surface-raised text-neon-cyan px-1.5 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              );
            }
            return (
              <code className={`block bg-surface-base border border-wire-subtle rounded-lg p-4 text-sm font-mono text-text-primary overflow-x-auto mb-4 ${codeClassName}`}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => <pre className="mb-4">{children}</pre>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-neon-cyan pl-4 italic text-text-secondary mb-4">
              {children}
            </blockquote>
          ),
          img: ({ src, alt }) => (
            <img src={src} alt={alt ?? ""} className="rounded-lg max-w-full h-auto mb-4" loading="lazy" />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse border border-wire-subtle">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-wire-subtle bg-surface-raised px-3 py-2 text-left text-text-primary font-semibold">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border border-wire-subtle px-3 py-2 text-text-secondary">{children}</td>
          ),
          hr: () => <hr className="border-wire-subtle my-6" />,
          strong: ({ children }) => (
            <strong className="text-text-primary font-semibold">{children}</strong>
          ),
        }}
      >
        {resolvedContent}
      </ReactMarkdown>
    </div>
  );
}
