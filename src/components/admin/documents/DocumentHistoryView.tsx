import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  Printer, 
  Download, 
  FileText, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  FolderOpen,
  ArrowUpDown
} from 'lucide-react';
import { SavedDocument, DocumentCategory, DocumentStatus } from './DocumentTypes';
import { DOCUMENT_CATEGORIES } from './documentTemplatesData';

interface DocumentHistoryViewProps {
  documents: SavedDocument[];
  onOpenDocument: (doc: SavedDocument) => void;
  onDeleteDocument: (docId: string) => void;
  onPrintDocument: (doc: SavedDocument) => void;
}

export const DocumentHistoryView: React.FC<DocumentHistoryViewProps> = ({
  documents,
  onOpenDocument,
  onDeleteDocument,
  onPrintDocument
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Deletion confirm modal
  const [deleteTarget, setDeleteTarget] = useState<SavedDocument | null>(null);

  // Filtered documents
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.targetName && doc.targetName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.recipientName && doc.recipientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'signed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Signed</span>;
      case 'sent':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">Dispatched</span>;
      case 'draft':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Draft</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">Generated</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search documents by title, reference number, student, or staff..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Categories</option>
              {DOCUMENT_CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Statuses</option>
              <option value="generated">Generated</option>
              <option value="signed">Signed</option>
              <option value="sent">Dispatched</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Count Summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
          <span>
            Showing <strong>{filteredDocs.length}</strong> of <strong>{documents.length}</strong> archived school documents
          </span>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 font-bold text-[11px] text-slate-500 dark:text-slate-400 uppercase">
                <th className="p-3.5">Tracking ID</th>
                <th className="p-3.5">Document Title & Subject</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Associated Person / Target</th>
                <th className="p-3.5">Date Created</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400 dark:text-slate-500">
                    <FolderOpen className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="font-bold">No documents found matching your filter criteria.</p>
                    <p className="text-[11px] mt-1">Generate a new document from the templates catalogue above.</p>
                  </td>
                </tr>
              ) : (
                filteredDocs.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-emerald-800 dark:text-emerald-400 whitespace-nowrap">
                      {doc.referenceNumber}
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <div className="font-bold text-slate-900 dark:text-white truncate">
                        {doc.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {doc.subject}
                      </div>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 capitalize">
                        {doc.category.replace(/-/g, ' ')}
                      </span>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      {doc.targetName ? (
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">
                            {doc.targetName}
                          </span>
                          {doc.targetGrade && (
                            <span className="text-[10px] text-slate-500">
                              {doc.targetGrade}
                            </span>
                          )}
                        </div>
                      ) : doc.recipientName ? (
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {doc.recipientName}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">General Institutional</span>
                      )}
                    </td>
                    <td className="p-3.5 whitespace-nowrap text-[11px] text-slate-500 font-mono">
                      {doc.date}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      {getStatusBadge(doc.status)}
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenDocument(doc)}
                          className="p-1.5 text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Open & Edit Document"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onPrintDocument(doc)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Print Document"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(doc)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                          title="Delete from Archive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  Delete Document Record
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Are you sure you want to delete <strong>{deleteTarget.title}</strong> [Ref: {deleteTarget.referenceNumber}] from the institutional archives? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteDocument(deleteTarget.id);
                  setDeleteTarget(null);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/30 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Deletion</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
