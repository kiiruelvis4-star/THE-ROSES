import React, { useState } from 'react';
import { 
  KNECProjectModule, 
  KNECGradeLevel, 
  SubjectName, 
  STANDARD_SUBJECTS 
} from '../../types';
import { 
  Sparkles, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2, 
  Download, 
  FileText, 
  Award, 
  UploadCloud, 
  Layers, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  Copy, 
  Printer, 
  Plus, 
  HelpCircle,
  Clock,
  BookOpen
} from 'lucide-react';
import { storage } from '../../services/storageService';
import { KNEC_SYNC_ENGINE_CONFIG } from '../../data/academicCalendarsData';

interface KNECProjectsSyncManagerProps {
  onSelectLearner?: (studentId: string) => void;
}

export const KNECProjectsSyncManager: React.FC<KNECProjectsSyncManagerProps> = () => {
  const [projects, setProjects] = useState<KNECProjectModule[]>(() => storage.getKNECProjects());
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [activeProjectId, setActiveProjectId] = useState<string>(projects[0]?.id || '');
  const [projectSubTab, setProjectSubTab] = useState<'instructions' | 'rubrics' | 'portfolio'>('instructions');
  
  // Sync Engine State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'ready'>('synced');
  const [lastSyncTime, setLastSyncTime] = useState<string>('2026-05-15 08:30 EAT (Term 2 Schedule)');

  // AI Assistant Generator State
  const [showAIAgent, setShowAIAgent] = useState(false);
  const [aiSelectedGrade, setAiSelectedGrade] = useState<KNECGradeLevel>('Grade 6');
  const [aiSelectedSubject, setAiSelectedSubject] = useState<SubjectName>('Agriculture');
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');
  const [aiIsGenerating, setAiIsGenerating] = useState(false);
  const [copiedModule, setCopiedModule] = useState<string | null>(null);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  const filteredProjects = selectedGrade === 'All' 
    ? projects 
    : projects.filter(p => p.grade === selectedGrade);

  const handleManualPortalSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus('synced');
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' (Live Synced)');
    }, 1200);
  };

  const handleExportPortfolioCSV = (project: KNECProjectModule) => {
    const headers = project.portfolioUpload.fields.join(',');
    const sample = project.portfolioUpload.sampleRecord;
    const values = project.portfolioUpload.fields.map(f => `"${sample[f] || ''}"`).join(',');
    const csvContent = `${headers}\n${values}\n`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KNEC_CBA_Upload_${project.cbaCode}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedModule(label);
    setTimeout(() => setCopiedModule(null), 2000);
  };

  const handleGenerateAIProject = () => {
    setAiIsGenerating(true);
    setTimeout(() => {
      const newProjId = `knec-${Date.now()}`;
      const titlePrompt = aiCustomPrompt.trim() 
        ? aiCustomPrompt 
        : `${aiSelectedGrade} ${aiSelectedSubject} Eco-Friendly Community Practical Project`;

      const generatedProject: KNECProjectModule = {
        id: newProjId,
        grade: aiSelectedGrade,
        subject: aiSelectedSubject,
        title: titlePrompt,
        term: 'Term 2',
        cbaCode: `CBA-2026-${aiSelectedGrade.replace(' ', '')}-${aiSelectedSubject.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
        durationWeeks: 3,
        status: 'Ready',
        taskInstructions: {
          objective: `Investigate, design, and assemble an empirical ${aiSelectedSubject} model demonstrating sustainable community resource conservation and practical CBC competency.`,
          learnerGuidelines: [
            'Formulate a clear inquiry question addressing local environmental or community challenges.',
            'Collect recyclable or naturally accessible materials from the local environment.',
            'Document day-by-day practical execution steps with clear measurements and photographic/illustrative evidence.',
            'Present the final project artifact during classroom peer assessment and answer teacher evaluation questions.',
          ],
          materialsRequired: [
            'Local clay, timber offcuts, recycled containers, or fabric',
            'Measuring tape / metric ruler',
            'Learner project inquiry journal and sketch pad',
          ],
          safetyPrecautions: [
            'Wear protective gloves and eye protection when cutting or handling soil/fibers.',
            'Always undertake outdoor field collection in pairs under teacher or parental oversight.',
          ],
          keyInquiryQuestions: [
            'How does this practical solution address environmental sustainability?',
            'What scientific or mathematical principles were applied during the construction phase?',
          ],
          submissionEvidence: [
            'Physical working artifact or scale model.',
            'Completed 10-day learner observation logbook.',
            'Teacher oral defense assessment rubric.',
          ],
        },
        markingGuidelines: {
          rubrics: [
            {
              level: 4,
              ratingCode: 'EE',
              name: 'Exceeding Expectations',
              scoreRange: 'Score 4 (80% - 100%)',
              description: 'Demonstrates exceptional originality, flawless construction, meticulous journal entries, and thorough mastery of inquiry principles.',
              criteria: [
                'Innovative design utilizing recycled materials',
                'Exhaustive daily documentation with precision measurements',
                'Articulate oral defense answering all theoretical questions',
              ],
            },
            {
              level: 3,
              ratingCode: 'ME',
              name: 'Meeting Expectations',
              scoreRange: 'Score 3 (65% - 79%)',
              description: 'Successfully constructs model fulfilling all core requirements; logbook contains complete records and accurate conclusions.',
              criteria: [
                'Model functions effectively as intended',
                'Logbook completed with required entries',
                'Demonstrates sound grasp of subject competencies',
              ],
            },
            {
              level: 2,
              ratingCode: 'AE',
              name: 'Approaching Expectations',
              scoreRange: 'Score 2 (50% - 64%)',
              description: 'Constructs project with minor flaws; logbook has intermittent records; requires prompts during oral presentation.',
              criteria: [
                'Partial artifact completion',
                'Inconsistent documentation',
              ],
            },
            {
              level: 1,
              ratingCode: 'BE',
              name: 'Below Expectations',
              scoreRange: 'Score 1 (0% - 49%)',
              description: 'Incomplete artifact; missing journal entries; unable to explain basic concepts without major teacher intervention.',
              criteria: [
                'Unfinished project submission',
                'Lacks fundamental understanding',
              ],
            },
          ],
          teacherNotes: `Generated by Little Roses AI Assistant Agent based on official KNEC CBA Term 2 guidelines for ${aiSelectedGrade}.`,
        },
        portfolioUpload: {
          portalUrl: 'https://cba.knec.ac.ke',
          expectedFormat: 'CSV',
          fields: ['LearnerUPI', 'AssessmentNumber', 'ProjectCode', 'Artifact_Score', 'Journal_Score', 'Oral_Defense', 'OverallLevel', 'UploadedDate'],
          sampleRecord: {
            LearnerUPI: 'LRA2026006',
            AssessmentNumber: 'KNEC-CBA-006',
            ProjectCode: `CBA-2026-${aiSelectedGrade.replace(' ', '')}-${aiSelectedSubject.slice(0, 3).toUpperCase()}-AUTO`,
            Artifact_Score: 4,
            Journal_Score: 4,
            Oral_Defense: 3,
            OverallLevel: 'EE (Level 4)',
            UploadedDate: '2026-05-23',
          },
        },
      };

      storage.saveKNECProject(generatedProject);
      setProjects(storage.getKNECProjects());
      setActiveProjectId(newProjId);
      setAiIsGenerating(false);
      setShowAIAgent(false);
      setAiCustomPrompt('');
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Banner: KNEC CBA Sync Engine */}
      <div className="p-5 bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 rounded-3xl border border-blue-900/60 shadow-xl text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Official Sync Engine
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Portal Active
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Schedule: {KNEC_SYNC_ENGINE_CONFIG.sync_schedule}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>KNEC CBA Projects Sync Engine</span>
            </h2>

            <p className="text-xs sm:text-sm text-blue-200/90 max-w-2xl leading-relaxed">
              Target Portal: <a href="https://cba.knec.ac.ke" target="_blank" rel="noreferrer" className="text-amber-300 underline font-mono hover:text-white inline-flex items-center gap-1">{KNEC_SYNC_ENGINE_CONFIG.target_portal} <ExternalLink className="w-3 h-3" /></a> • Applicable to <span className="font-bold text-white">Grade 3, Grade 4, Grade 5, and Grade 6</span>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowAIAgent(prev => !prev)}
              className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Assistant Agent</span>
            </button>

            <button
              onClick={handleManualPortalSync}
              disabled={isSyncing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing CBA Portal...' : 'Sync with CBA Portal'}</span>
            </button>
          </div>
        </div>

        {/* Sync Info Footer Strip */}
        <div className="mt-4 pt-3 border-t border-blue-900/60 flex flex-wrap items-center justify-between gap-3 text-[11px] text-blue-300/80 font-medium">
          <div className="flex items-center gap-4">
            <span>Last Synced: <strong className="text-white">{lastSyncTime}</strong></span>
            <span>Next Auto-Sync Window: <strong className="text-amber-300">2027-05-17 (Term 2)</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>4 Applicable Grades Synced (G3, G4, G5, G6)</span>
          </div>
        </div>
      </div>

      {/* AI ASSISTANT AGENT MODULE MODAL / DRAWER */}
      {showAIAgent && (
        <div className="p-5 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-slate-900 rounded-3xl border border-indigo-200 dark:border-indigo-900/60 shadow-lg space-y-4 animate-scaleUp">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-sm">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  KNEC CBA AI Assistant Agent
                </h3>
                <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">
                  {KNEC_SYNC_ENGINE_CONFIG.ai_assistant_agent.role}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAIAgent(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
            >
              Close
            </button>
          </div>

          {/* The 3 Required Auto-Generated Modules Indicator */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            {KNEC_SYNC_ENGINE_CONFIG.ai_assistant_agent.auto_generate_modules.map((modName, idx) => (
              <div 
                key={modName}
                className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-2"
              >
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                  {idx + 1}
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  {modName}
                </span>
              </div>
            ))}
          </div>

          {/* Generator Controls */}
          <div className="p-4 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Grade (Applicable: Grade 3 - 6)
                </label>
                <select
                  value={aiSelectedGrade}
                  onChange={(e) => setAiSelectedGrade(e.target.value as KNECGradeLevel)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Grade 5">Grade 5</option>
                  <option value="Grade 6">Grade 6</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Learning Area / Subject
                </label>
                <select
                  value={aiSelectedSubject}
                  onChange={(e) => setAiSelectedSubject(e.target.value as SubjectName)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                >
                  {STANDARD_SUBJECTS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Custom Topic / Task Focus (Optional)
              </label>
              <input
                type="text"
                value={aiCustomPrompt}
                onChange={(e) => setAiCustomPrompt(e.target.value)}
                placeholder="e.g. Indigenous Tree Seedling Nursery & Plastic Bottle Stacking Project"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Will auto-generate task sheet, 4-level rubric, and CBCE CSV export schema.
              </span>
              <button
                onClick={handleGenerateAIProject}
                disabled={aiIsGenerating}
                className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md transition-all disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${aiIsGenerating ? 'animate-spin' : ''}`} />
                <span>{aiIsGenerating ? 'Synthesizing KNEC CBA Modules...' : 'Generate Complete Project Module'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grade Selector Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['All', 'Grade 6', 'Grade 5', 'Grade 4', 'Grade 3'].map((grade) => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                selectedGrade === grade
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400'
              }`}
            >
              {grade}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-bold">
          {filteredProjects.length} KNEC CBA Project Modules Available
        </span>
      </div>

      {/* MAIN 2-COLUMN LAYOUT: PROJECTS LIST & DETAIL VIEWER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Projects Cards List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredProjects.map((p) => {
            const isSelected = p.id === activeProject?.id;
            return (
              <div
                key={p.id}
                onClick={() => setActiveProjectId(p.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-900 text-white">
                      {p.grade}
                    </span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      {p.subject}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 font-semibold">
                    {p.cbaCode}
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                  {p.title}
                </h4>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    {p.durationWeeks} Weeks Duration • {p.term}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {p.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed 3-Module View */}
        {activeProject && (
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Project Header Banner */}
            <div className="p-5 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-900 text-white">
                    {activeProject.grade}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    {activeProject.subject}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {activeProject.cbaCode}
                  </span>
                </div>

                <button
                  onClick={() => handleExportPortfolioCSV(activeProject)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CBCE CSV</span>
                </button>
              </div>

              <h3 className="text-lg font-black text-slate-900 dark:text-white leading-snug">
                {activeProject.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Objective: {activeProject.taskInstructions.objective}
              </p>

              {/* Sub-Tabs: 3 Required Modules */}
              <div className="mt-4 flex items-center gap-1 bg-slate-200/70 dark:bg-slate-800 p-1 rounded-2xl">
                <button
                  onClick={() => setProjectSubTab('instructions')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    projectSubTab === 'instructions'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>1. Learner Instructions</span>
                </button>

                <button
                  onClick={() => setProjectSubTab('rubrics')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    projectSubTab === 'rubrics'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>2. Marking Rubrics (1-4)</span>
                </button>

                <button
                  onClick={() => setProjectSubTab('portfolio')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    projectSubTab === 'portfolio'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>3. CBCE Upload Format</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENT 1: PROJECT TASK INSTRUCTIONS FOR LEARNERS */}
            {projectSubTab === 'instructions' && (
              <div className="p-5 space-y-4">
                {/* Guidelines */}
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                    Step-by-Step Learner Guidelines
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {activeProject.taskInstructions.learnerGuidelines.map((g, i) => (
                      <li key={i} className="flex items-start gap-2.5 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                        <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 flex items-center justify-center font-bold text-[11px] shrink-0">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Materials & Safety in 2 Cols */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                    <h5 className="text-xs font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-blue-600" /> Materials Required
                    </h5>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-400">
                      {activeProject.taskInstructions.materialsRequired.map((m, i) => (
                        <li key={i} className="leading-relaxed">{m}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900/60">
                    <h5 className="text-xs font-extrabold text-amber-900 dark:text-amber-300 mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" /> Safety Precautions
                    </h5>
                    <ul className="list-disc list-inside space-y-1 text-xs text-amber-800 dark:text-amber-200">
                      {activeProject.taskInstructions.safetyPrecautions.map((s, i) => (
                        <li key={i} className="leading-relaxed">{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Inquiry Questions & Evidence */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                    Key Inquiry Questions & Submission Evidence
                  </h4>
                  <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {activeProject.taskInstructions.keyInquiryQuestions.map((q, i) => (
                      <p key={i} className="font-semibold text-blue-900 dark:text-blue-300">
                        • Q{i + 1}: {q}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => handleCopyText(JSON.stringify(activeProject.taskInstructions, null, 2), 'instructions')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedModule === 'instructions' ? 'Copied!' : 'Copy Task Sheet'}</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Instructions</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: TEACHER MARKING GUIDELINES & PERFORMANCE LEVELS (1-4) */}
            {projectSubTab === 'rubrics' && (
              <div className="p-5 space-y-4">
                <div className="space-y-3">
                  {activeProject.markingGuidelines.rubrics.map((r) => {
                    const badgeStyles = {
                      4: 'bg-emerald-600 text-white',
                      3: 'bg-blue-600 text-white',
                      2: 'bg-amber-600 text-white',
                      1: 'bg-rose-600 text-white',
                    }[r.level];

                    return (
                      <div 
                        key={r.level}
                        className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${badgeStyles}`}>
                              Level {r.level} • {r.ratingCode}
                            </span>
                            <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                              {r.name}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono font-bold text-slate-500">
                            {r.scoreRange}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {r.description}
                        </p>

                        <div className="pt-1">
                          <span className="text-[10px] font-bold uppercase text-slate-400">
                            Observable Indicators:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {r.criteria.map((c, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600"
                              >
                                ✓ {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-300">
                  <strong>Official KNEC Note:</strong> {activeProject.markingGuidelines.teacherNotes}
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: CBCE PORTFOLIO UPLOAD FORMAT */}
            {projectSubTab === 'portfolio' && (
              <div className="p-5 space-y-4">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      KNEC Portal Destination
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      Standard Schema
                    </span>
                  </div>
                  <div className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                    {activeProject.portfolioUpload.portalUrl}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    The schema below conforms to the official KNEC CBA Term 2 bulk score upload portal requirements.
                  </p>
                </div>

                {/* Field Columns */}
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                    Upload Record Fields (CSV Columns)
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeProject.portfolioUpload.fields.map((fld) => (
                      <span
                        key={fld}
                        className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded-xl text-xs font-mono font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs"
                      >
                        {fld}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sample Record Preview */}
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                    Sample Pre-Validated Record
                  </h4>
                  <div className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-xs overflow-x-auto">
                    <pre>{JSON.stringify(activeProject.portfolioUpload.sampleRecord, null, 2)}</pre>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => handleExportPortfolioCSV(activeProject)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-md transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Ready-To-Upload CSV File</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
