import React, { useState } from 'react';
import { FileSystemProvider, useFileSystem } from './context/FileSystemContext';
import { WindowsExplorer } from './components/WindowsExplorer';
import { SubjectBrowser } from './components/SubjectBrowser';
import { MathTools } from './components/MathTools';
import { LanguageTrainer } from './components/LanguageTrainer';
import { Timetable } from './components/Timetable';
import { FootballManager } from './components/FootballManager';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { SubjectId, DocumentItem } from './types';
import {
  Monitor,
  BookOpen,
  Calculator,
  Languages,
  Calendar,
  Trophy,
  FileEdit,
} from 'lucide-react';

function AppContent() {
  const [currentView, setCurrentView] = useState<
    'explorer' | 'subjects' | 'math' | 'languages' | 'timetable' | 'football'
  >('explorer');
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);

  const { files, setCurrentFolderId, setSelectedFileId } = useFileSystem();

  const handleOpenDocInExplorer = (doc: DocumentItem) => {
    // Try to match file by name or path
    const matchingFile = files.find(
      (f) =>
        f.type !== 'folder' &&
        (f.name.toLowerCase() === doc.title.toLowerCase() ||
          f.name.toLowerCase().includes(doc.title.toLowerCase()) ||
          doc.originalPath.toLowerCase().includes(f.name.toLowerCase()))
    );

    if (matchingFile) {
      if (matchingFile.parentId) {
        setCurrentFolderId(matchingFile.parentId);
      }
      setSelectedFileId(matchingFile.id);
    }
    setCurrentView('explorer');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased">
      {/* Top App Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div
            onClick={() => setCurrentView('explorer')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-extrabold shadow-xs text-lg">
              💻
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-slate-900 leading-tight">
                Schule Explorer & Word
              </h1>
              <span className="text-[11px] text-slate-500 font-medium">
                Windows-Dateisystem & Integrierter Word-Editor
              </span>
            </div>
          </div>

          {/* Primary View Switcher */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setCurrentView('explorer')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentView === 'explorer'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              Windows Explorer & Word
            </button>

            <button
              onClick={() => setCurrentView('subjects')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentView === 'subjects'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Fächer-Übersicht
            </button>

            <button
              onClick={() => setCurrentView('math')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentView === 'math'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              Mathe-Tools
            </button>

            <button
              onClick={() => setCurrentView('languages')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentView === 'languages'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Languages className="w-3.5 h-3.5" />
              Sprachtrainer
            </button>

            <button
              onClick={() => setCurrentView('timetable')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentView === 'timetable'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Stundenplan
            </button>

            <button
              onClick={() => setCurrentView('football')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentView === 'football'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              Fußball
            </button>
          </nav>

          {/* Quick Status Tag */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-600">
            <FileEdit className="w-3.5 h-3.5 text-blue-600" />
            <span>Word & Office Editor aktiv</span>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex overflow-x-auto px-4 py-2 border-t border-slate-200 gap-1 bg-slate-50">
          <button
            onClick={() => setCurrentView('explorer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              currentView === 'explorer' ? 'bg-blue-600 text-white' : 'text-slate-700'
            }`}
          >
            💻 Explorer & Word
          </button>
          <button
            onClick={() => setCurrentView('subjects')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              currentView === 'subjects' ? 'bg-indigo-600 text-white' : 'text-slate-600'
            }`}
          >
            📚 Fächer
          </button>
          <button
            onClick={() => setCurrentView('math')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              currentView === 'math' ? 'bg-indigo-600 text-white' : 'text-slate-600'
            }`}
          >
            🧮 Mathe
          </button>
          <button
            onClick={() => setCurrentView('languages')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              currentView === 'languages' ? 'bg-indigo-600 text-white' : 'text-slate-600'
            }`}
          >
            🗣️ Sprachen
          </button>
          <button
            onClick={() => setCurrentView('timetable')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              currentView === 'timetable' ? 'bg-indigo-600 text-white' : 'text-slate-600'
            }`}
          >
            📅 Stundenplan
          </button>
          <button
            onClick={() => setCurrentView('football')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              currentView === 'football' ? 'bg-emerald-600 text-white' : 'text-emerald-700'
            }`}
          >
            ⚽ Fußball
          </button>
        </div>
      </header>

      {/* Main Content Area - Full screen wide layout */}
      <main className="w-full px-2 sm:px-4 lg:px-6 py-2.5 flex-1 flex flex-col">
        {currentView === 'explorer' && <WindowsExplorer />}

        {currentView === 'subjects' && (
          <SubjectBrowser
            onSelectDoc={(doc) => setSelectedDoc(doc)}
            selectedSubjectId={selectedSubjectId}
            onSelectSubject={(id) => {
              if (id === 'fussball') {
                setCurrentView('football');
              } else {
                setSelectedSubjectId(id);
              }
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {currentView === 'math' && <MathTools />}

        {currentView === 'languages' && <LanguageTrainer />}

        {currentView === 'timetable' && <Timetable />}

        {currentView === 'football' && <FootballManager />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-2.5 text-center text-xs text-slate-500">
        <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Schule Explorer & Lernportal • Windows 11 Explorer-Dateisystem mit lokalem Word- & Office-Editor
          </span>
          <span className="font-mono text-slate-400">Persistiert in LocalStorage • Strudelcode/schule</span>
        </div>
      </footer>

      {/* Document Detail Modal */}
      <DocumentViewerModal
        doc={selectedDoc}
        onClose={() => setSelectedDoc(null)}
        onOpenInExplorer={handleOpenDocInExplorer}
      />
    </div>
  );
}

export function App() {
  return (
    <FileSystemProvider>
      <AppContent />
    </FileSystemProvider>
  );
}

export default App;
