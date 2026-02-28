import { Modal } from '@/components/ui/Modal';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';

interface ReportModalProps {
  report: { name: string; content: string; path: string } | null;
  loading?: boolean;
  onClose: () => void;
}

export function ReportModal({ report, loading = false, onClose }: ReportModalProps) {
  return (
    <Modal
      open={Boolean(report)}
      onClose={onClose}
      title={report ? `Report: ${report.name}` : 'Report'}
      subtitle={report?.path}
      className="max-h-[90vh] max-w-4xl overflow-y-auto"
    >
      {loading ? (
        <div className="text-sm text-slate-400">Loading report...</div>
      ) : report ? (
        <MarkdownRenderer content={report.content} />
      ) : null}
    </Modal>
  );
}
