'use client';

import { Component, ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/components/ui/cn';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

interface MarkdownErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface MarkdownErrorBoundaryState {
  hasError: boolean;
}

class MarkdownErrorBoundary extends Component<MarkdownErrorBoundaryProps, MarkdownErrorBoundaryState> {
  state: MarkdownErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): MarkdownErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidUpdate(prevProps: MarkdownErrorBoundaryProps): void {
    if (prevProps.children !== this.props.children && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const fallback = (
    <pre className="rounded-md border border-slate-800 bg-slate-900 p-4 font-mono text-sm whitespace-pre-wrap break-words text-slate-100">
      {content}
    </pre>
  );

  return (
    <MarkdownErrorBoundary fallback={fallback}>
      <div
        className={cn(
          'prose prose-invert max-w-none text-sm',
          'prose-headings:text-slate-100 prose-p:text-slate-200 prose-strong:text-slate-100',
          'prose-a:text-indigo-300 hover:prose-a:text-indigo-200',
          'prose-code:text-amber-200 prose-pre:border prose-pre:border-slate-800 prose-pre:bg-slate-900',
          'prose-th:border prose-th:border-slate-700 prose-th:bg-slate-800/70 prose-th:px-2 prose-th:py-1 prose-th:text-slate-100',
          'prose-td:border prose-td:border-slate-800 prose-td:px-2 prose-td:py-1 prose-td:text-slate-200',
          className
        )}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          skipHtml
          components={{
            code(props) {
              const { className: codeClassName, children, ...rest } = props;
              return (
                <code className={cn('rounded bg-slate-800 px-1 py-0.5', codeClassName)} {...rest}>
                  {children}
                </code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </MarkdownErrorBoundary>
  );
}
