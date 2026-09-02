import React, { useState } from 'react';
import { SubjectInfo, DocumentItem, SubjectId } from '../types';
import { SUBJECTS, DOCUMENTS_DATA } from '../data/schoolData';
import {
  BookOpen,
  Languages,
  Sparkles,
  Calculator,
  Leaf,
  Globe2,
  Landmark,
  Calendar,
  Library,
  Compass,
  Music,
  GraduationCap,
  Trophy,
  Search,
  FileText,
  HelpCircle,
  ExternalLink,
  Filter,
} from 'lucide-react';

interface Props {
  onSelectDoc: (doc: DocumentItem) => void;
  selectedSubjectId: SubjectId | 'all';
  onSelectSubject: (id: SubjectId | 'all') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  BookOpen,
  Languages,
  Sparkles,
  Calculator,
  Leaf,
  Globe2,
  Landmark,
  Calendar,
  Library,
  Compass,
  Music,
  GraduationCap,
  Trophy,
};

export const SubjectBrowser: React.FC<Props> = ({
  onSelectDoc,
  selectedSubjectId,
  onSelectSubject,
  searchQuery,
  onSearchChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter documents by subject, search and category
  const filteredDocs = DOCUMENTS_DATA.filter((doc) => {
    const matchesSubject = selectedSubjectId === 'all' || doc.subjectId === selectedSubjectId;
    const matchesSearch =
      searchQuery.trim() === '' ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSubject && matchesSearch && matchesCategory;
  });

  // Unique categories for currently selected subject
  const currentSubjectDocs = DOCUMENTS_DATA.filter(
    (d) => selectedSubjectId === 'all' || d.subjectId === selectedSubjectId
  );
  const categories = Array.from(new Set(currentSubjectDocs.map((d) => d.category)));

  const activeSubjectInfo = SUBJECTS.find((s) => s.id === selectedSubjectId);

  return (
    <div className="space-y-6">
      {/* Subject Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <button
          onClick={() => {
            onSelectSubject('all');
            setSelectedCategory('all');
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
            selectedSubjectId === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <span className="text-xl">📚</span>
          <div className="mt-2">
            <div className="font-bold text-xs">Alle Fächer</div>
            <div className={`text-[11px] ${selectedSubjectId === 'all' ? 'text-slate-300' : 'text-slate-500'}`}>
              Gesamtübersicht
            </div>
          </div>
        </button>

        {SUBJECTS.map((sub) => {
          const IconComp = ICON_MAP[sub.icon] || BookOpen;
          const isSelected = selectedSubjectId === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => {
                onSelectSubject(sub.id);
                setSelectedCategory('all');
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? `bg-white ${sub.borderAccent} shadow-md ring-2 ring-indigo-500/20`
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl ${sub.bgLight} ${sub.color} flex items-center justify-center`}>
                <IconComp className="w-4 h-4" />
              </div>
              <div className="mt-2 truncate">
                <div className="font-bold text-xs truncate text-slate-900">{sub.shortTitle}</div>
                <div className="text-[10px] text-slate-400 font-medium truncate">{sub.folderName}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Subject Banner / Header */}
      {activeSubjectInfo && (
        <div className={`p-6 rounded-2xl border ${activeSubjectInfo.bgLight} ${activeSubjectInfo.borderAccent} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`font-extrabold text-lg ${activeSubjectInfo.color}`}>
                {activeSubjectInfo.title}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-white font-mono text-slate-600 font-semibold border">
                {activeSubjectInfo.fileCount} Dateien im Archiv
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-2xl">{activeSubjectInfo.description}</p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Alle Themen ({currentSubjectDocs.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Dokument oder Stichwort suchen..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => {
          const subInfo = SUBJECTS.find((s) => s.id === doc.subjectId);
          return (
            <div
              key={doc.id}
              onClick={() => onSelectDoc(doc)}
              className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${subInfo?.bgLight || 'bg-slate-100'} ${subInfo?.color || 'text-slate-800'}`}>
                    {doc.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">.{doc.type}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {doc.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {doc.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <div className="flex gap-1 flex-wrap">
                  {doc.tags.slice(0, 2).map((t, idx) => (
                    <span key={idx} className="bg-slate-50 text-slate-500 px-2 py-0.5 rounded text-[10px]">
                      #{t}
                    </span>
                  ))}
                </div>
                <span className="text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1 text-[11px]">
                  Öffnen →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDocs.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700 text-sm">Keine Einträge gefunden</h3>
          <p className="text-xs text-slate-400">
            Versuche einen anderen Suchbegriff oder wechsle das Fach.
          </p>
        </div>
      )}
    </div>
  );
};
