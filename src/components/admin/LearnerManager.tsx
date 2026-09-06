import React, { useState } from 'react';
import { Trash2, Users, CheckCircle2, X } from 'lucide-react';
import { Student } from '../../types';
import { storage } from '../../services/storageService';
import { deleteLearner, bulkDeleteLearners } from '../../services/sqliteDb';

export interface LearnerManagerProps {
  learners: Student[];
  setLearners: React.Dispatch<React.SetStateAction<Student[]>> | ((learners: Student[]) => void);
  onInspect?: (id: string) => void;
}

export default function LearnerManager({ learners, setLearners, onInspect }: LearnerManagerProps) {
  // Array storing IDs of checked learners
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Deletion Modal State (immune to iframe window.confirm blocks)
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'single' | 'bulk';
    id?: string;
    name?: string;
    count?: number;
  }>({
    isOpen: false,
    type: 'bulk'
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4000);
  };

  // Toggle single selection
  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Toggle "Select All"
  const handleSelectAll = () => {
    if (selectedIds.length === learners.length && learners.length > 0) {
      setSelectedIds([]); // Deselect all
    } else {
      setSelectedIds(learners.map(item => item.id)); // Select all
    }
  };

  // Prompt Single Deletion
  const handlePromptSingleDelete = (id: string, name: string) => {
    setDeleteModal({
      isOpen: true,
      type: 'single',
      id,
      name
    });
  };

  // Prompt Bulk Deletion
  const handlePromptBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setDeleteModal({
      isOpen: true,
      type: 'bulk',
      count: selectedIds.length
    });
  };

  // Execute Confirmed Deletion
  const handleConfirmDelete = () => {
    if (deleteModal.type === 'single' && deleteModal.id) {
      const targetId = deleteModal.id;
      const targetName = deleteModal.name || 'Learner';

      // 1. Filter out from UI state
      const updatedList = learners.filter(item => item.id !== targetId);
      setLearners(updatedList);

      // 2. Persist to storage and SQLite
      storage.deleteStudent(targetId);
      deleteLearner(targetId).catch(() => {});

      // 3. Remove from selection if present
      setSelectedIds(prev => prev.filter(item => item !== targetId));

      showToast(`Learner "${targetName}" removed successfully.`);
    } else if (deleteModal.type === 'bulk') {
      const count = selectedIds.length;
      if (count > 0) {
        // 1. Filter out from UI state
        const updatedList = learners.filter(item => !selectedIds.includes(item.id));
        setLearners(updatedList);

        // 2. Persist to storage and SQLite
        storage.bulkDeleteStudents(selectedIds);
        bulkDeleteLearners(selectedIds).catch(() => {});

        // 3. Clear selection
        setSelectedIds([]);

        showToast(`Successfully deleted ${count} selected learner(s).`);
      }
    }

    setDeleteModal({ isOpen: false, type: 'bulk' });
  };

  const isAllSelected = learners.length > 0 && selectedIds.length === learners.length;

  return (
    <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Learner Directory ({learners.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select one or multiple learners to manage enrollment or perform bulk deletions
            </p>
          </div>
        </div>

        {/* Bulk Action Delete Button */}
        {selectedIds.length > 0 && (
          <button 
            onClick={handlePromptBulkDelete}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/30 transition-all cursor-pointer animate-fadeIn"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Selected ({selectedIds.length})</span>
          </button>
        )}
      </div>

      {/* Selection Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 uppercase font-black tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <th className="p-3.5 w-12 text-center">
                <input 
                  type="checkbox" 
                  aria-label="Select all learners"
                  className="w-4 h-4 rounded-md text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                  checked={isAllSelected} 
                  onChange={handleSelectAll} 
                />
              </th>
              <th className="p-3.5">Name</th>
              <th className="p-3.5">Grade</th>
              <th className="p-3.5">Gender</th>
              <th className="p-3.5">Admission No.</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            {learners.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500 dark:text-slate-400">
                  No learners found in the directory.
                </td>
              </tr>
            ) : (
              learners.map((student) => {
                const isSelected = selectedIds.includes(student.id);
                return (
                  <tr 
                    key={student.id} 
                    className={`transition-colors ${
                      isSelected 
                        ? 'bg-rose-50/60 dark:bg-rose-950/20' 
                        : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="p-3.5 text-center">
                      <input 
                        type="checkbox" 
                        aria-label={`Select ${student.name}`}
                        className="w-4 h-4 rounded-md text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                        checked={isSelected} 
                        onChange={() => handleSelectOne(student.id)} 
                      />
                    </td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-[10px] flex items-center justify-center">
                        {student.name.charAt(0)}
                      </div>
                      <span>{student.name}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-[10px] font-bold">
                        {student.grade}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400">{student.gender}</td>
                    <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">{student.admissionNumber}</td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onInspect && (
                          <button
                            onClick={() => onInspect(student.id)}
                            className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 underline cursor-pointer"
                          >
                            Inspect
                          </button>
                        )}
                        <button
                          onClick={() => handlePromptSingleDelete(student.id, student.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                          title={`Delete ${student.name}`}
                          aria-label={`Delete ${student.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Selected Items Summary Footer */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>{selectedIds.length} of {learners.length} learner(s) currently selected</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedIds([])}
              className="text-slate-500 hover:text-slate-800 dark:hover:text-white text-xs underline cursor-pointer"
            >
              Clear selection
            </button>
            <button
              onClick={handlePromptBulkDelete}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Delete Selected</span>
            </button>
          </div>
        </div>
      )}

      {/* Non-blocking In-App Deletion Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  {deleteModal.type === 'single' ? 'Delete Learner Record' : `Delete ${deleteModal.count || selectedIds.length} Learners`}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {deleteModal.type === 'single' ? (
                    <>
                      Are you sure you want to permanently delete <strong>{deleteModal.name}</strong> from the learner registry?
                    </>
                  ) : (
                    <>
                      Are you sure you want to delete <strong>{deleteModal.count || selectedIds.length}</strong> selected learner(s)? This action updates both SQLite and local storage records.
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setDeleteModal({ isOpen: false, type: 'bulk' })}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/30 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>
                  {deleteModal.type === 'bulk'
                    ? `Delete (${deleteModal.count || selectedIds.length})`
                    : 'Confirm Deletion'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl shadow-xl border border-slate-700 dark:border-slate-200 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white dark:hover:text-slate-900 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

export { LearnerManager };
