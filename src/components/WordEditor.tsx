import React, { useState, useRef, useEffect } from 'react';
import { VFile } from '../types';
import { useFileSystem } from '../context/FileSystemContext';
import {
  Save,
  Download,
  Printer,
  Undo,
  Redo,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  CheckSquare,
  Highlighter,
  Table as TableIcon,
  Sparkles,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Check,
  Calendar,
  FileCheck,
  SplitSquareVertical,
  Minus,
  Plus,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  file: VFile;
  onClose?: () => void;
  isCompact?: boolean; // When in split-screen side preview
}

export const WordEditor: React.FC<Props> = ({ file, onClose, isCompact = false }) => {
  const { updateFileContent } = useFileSystem();

  const editorRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'insert' | 'layout' | 'review' | 'view'>('home');
  const [fontFamily, setFontFamily] = useState<string>('Calibri');
  const [fontSize, setFontSize] = useState<string>('11pt');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [pageColor, setPageColor] = useState<string>('#ffffff');
  const [pageMargin, setPageMargin] = useState<'normal' | 'narrow' | 'wide'>('normal');
  const [isLandscape, setIsLandscape] = useState<boolean>(false);
  const [watermark, setWatermark] = useState<string>('');
  const [showRuler, setShowRuler] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState<number>(0);
  const [charCount, setCharCount] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [pageWidthMode, setPageWidthMode] = useState<'page' | 'full'>('full');

  // Initialize content
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = file.content || `<p>Beginne hier mit der Eingabe...</p>`;
      calculateCounts();
    }
  }, [file.id]);

  const calculateCounts = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
    setWordCount(words);
    setCharCount(text.length);
  };

  const handleInput = () => {
    setIsSaved(false);
    calculateCounts();
  };

  const executeCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
    setIsSaved(false);
    calculateCounts();
  };

  const handleSave = () => {
    if (!editorRef.current) return;
    const htmlContent = editorRef.current.innerHTML;
    updateFileContent(file.id, htmlContent);
    setIsSaved(true);
    setSaveToast(`✅ „${file.name}“ erfolgreich gespeichert!`);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Keyboard shortcut Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [file.id]);

  // Insert Table
  const insertTable = (rows: number = 3, cols: number = 3) => {
    let headerCells = '';
    for (let c = 1; c <= cols; c++) {
      headerCells += `<th style="padding: 8px 12px; border: 1px solid #cbd5e1; background: #f8fafc; font-weight: bold; text-align: left;">Spalte ${c}</th>`;
    }

    let bodyRows = '';
    for (let r = 1; r <= rows; r++) {
      let cells = '';
      for (let c = 1; c <= cols; c++) {
        cells += `<td style="padding: 8px 12px; border: 1px solid #cbd5e1;">Zelle ${r}.${c}</td>`;
      }
      bodyRows += `<tr style="${r % 2 === 0 ? 'background: #f8fafc;' : ''}">${cells}</tr>`;
    }

    const tableHtml = `
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 1px solid #cbd5e1; font-size: 14px; border-radius: 4px; overflow: hidden;">
        <thead>
          <tr>${headerCells}</tr>
        </thead>
        <tbody>
          ${bodyRows}
        </tbody>
      </table>
      <p><br></p>
    `;
    executeCommand('insertHTML', tableHtml);
  };

  // Insert Callout Box
  const insertCallout = (type: 'info' | 'tip' | 'warning' | 'definition') => {
    const styles = {
      info: 'background:#eff6ff; border-left:4px solid #3b82f6; color:#1e3a8a;',
      tip: 'background:#ecfdf5; border-left:4px solid #10b981; color:#064e3b;',
      warning: 'background:#fffbeb; border-left:4px solid #f59e0b; color:#78350f;',
      definition: 'background:#f5f3ff; border-left:4px solid #8b5cf6; color:#4c1d95;',
    };
    const titles = {
      info: 'ℹ️ Merke / Information',
      tip: '💡 Lerntipp & Hinweis für Prüfungen',
      warning: '⚠️ Wichtige Regel / Achtung',
      definition: '📖 Definition & Begriffsklärung',
    };
    const html = `
      <div style="${styles[type]} padding:12px 16px; border-radius:6px; margin:16px 0; font-family:sans-serif; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <strong>${titles[type]}</strong>
        <p style="margin:6px 0 0 0; line-height: 1.5;">Hier deine Notiz, Merksatz oder Regel eintragen...</p>
      </div>
      <p><br></p>
    `;
    executeCommand('insertHTML', html);
  };

  // Insert Math Symbol
  const insertSymbol = (sym: string) => {
    executeCommand('insertText', ` ${sym} `);
  };

  // Download file
  const handleDownload = () => {
    if (!editorRef.current) return;
    const content = editorRef.current.innerHTML;
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.endsWith('.docx') ? file.name.replace('.docx', '.html') : `${file.name}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  const getMarginClass = () => {
    if (pageWidthMode === 'full') {
      if (pageMargin === 'narrow') return 'p-4 sm:p-6';
      if (pageMargin === 'wide') return 'p-8 sm:p-12';
      return 'p-5 sm:p-8';
    }
    if (isCompact) {
      if (pageMargin === 'narrow') return 'p-4 sm:p-5';
      if (pageMargin === 'wide') return 'p-6 sm:p-8';
      return 'p-5 sm:p-6';
    }
    if (pageMargin === 'narrow') return 'p-6 sm:p-8';
    if (pageMargin === 'wide') return 'p-10 sm:p-16';
    return 'p-8 sm:p-12'; // Normal
  };

  return (
    <div
      className={`flex flex-col bg-slate-100 border border-slate-300 rounded-2xl shadow-xl overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-full min-h-[620px]'
      }`}
    >
      {/* 1. TOP TITLE BAR (Office 365 Ribbon Style) */}
      <div className="bg-[#0f4c81] text-white px-3 sm:px-4 py-2 flex items-center justify-between select-none shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 font-extrabold text-sm">
            <span className="w-6 h-6 rounded-md bg-blue-500 text-white flex items-center justify-center font-serif text-xs shadow-inner">
              W
            </span>
            <span className="hidden sm:inline">Microsoft Word</span>
          </div>

          <div className="h-4 w-px bg-blue-300/40 hidden sm:block" />

          {/* Document name & status */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs sm:text-sm truncate max-w-[200px] sm:max-w-xs text-white">
              {file.name}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 shrink-0 ${
                isSaved ? 'bg-emerald-500/30 text-emerald-100' : 'bg-amber-500/40 text-amber-100 animate-pulse'
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-3 h-3 text-emerald-300" /> Gespeichert
                </>
              ) : (
                '● Ungespeichert'
              )}
            </span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Page Width Mode Toggle */}
          <button
            onClick={() => setPageWidthMode(pageWidthMode === 'full' ? 'page' : 'full')}
            title={pageWidthMode === 'full' ? 'Standard A4-Ansicht' : 'Volle Seitenbreite (fließend)'}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              pageWidthMode === 'full'
                ? 'bg-white/20 text-white border border-white/30'
                : 'hover:bg-blue-600/60 text-blue-100'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{pageWidthMode === 'full' ? 'Breitbild' : 'A4 Seite'}</span>
          </button>

          <button
            onClick={handleSave}
            title="Speichern (Strg + S)"
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-md text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Speichern</span>
          </button>

          <button
            onClick={handleDownload}
            title="Herunterladen"
            className="p-1.5 hover:bg-blue-600/60 rounded-md text-white transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handlePrint}
            title="Drucken / PDF"
            className="p-1.5 hover:bg-blue-600/60 rounded-md text-white transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Vollbild beenden' : 'Vollbild'}
            className="p-1.5 hover:bg-blue-600/60 rounded-md text-white transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              title="Editor schließen"
              className="p-1.5 hover:bg-rose-600 rounded-md text-white transition-colors ml-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 2. RIBBON TABS BAR */}
      <div className="bg-[#f3f4f6] border-b border-slate-300 px-3 pt-1 flex items-center gap-1 text-xs select-none overflow-x-auto">
        <button
          onClick={() => setActiveTab('home')}
          className={`px-3.5 py-1.5 rounded-t-lg font-bold transition-colors shrink-0 ${
            activeTab === 'home'
              ? 'bg-white text-blue-900 border-t-2 border-blue-600 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          Start
        </button>
        <button
          onClick={() => setActiveTab('insert')}
          className={`px-3.5 py-1.5 rounded-t-lg font-bold transition-colors shrink-0 ${
            activeTab === 'insert'
              ? 'bg-white text-blue-900 border-t-2 border-blue-600 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          Einfügen
        </button>
        <button
          onClick={() => setActiveTab('layout')}
          className={`px-3.5 py-1.5 rounded-t-lg font-bold transition-colors shrink-0 ${
            activeTab === 'layout'
              ? 'bg-white text-blue-900 border-t-2 border-blue-600 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          Layout
        </button>
        <button
          onClick={() => setActiveTab('review')}
          className={`px-3.5 py-1.5 rounded-t-lg font-bold transition-colors shrink-0 ${
            activeTab === 'review'
              ? 'bg-white text-blue-900 border-t-2 border-blue-600 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          Überprüfen
        </button>
        <button
          onClick={() => setActiveTab('view')}
          className={`px-3.5 py-1.5 rounded-t-lg font-bold transition-colors shrink-0 ${
            activeTab === 'view'
              ? 'bg-white text-blue-900 border-t-2 border-blue-600 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          Ansicht
        </button>
      </div>

      {/* 3. RIBBON TOOLBAR */}
      <div className="bg-white border-b border-slate-300 p-2 overflow-x-auto flex items-center gap-2 select-none min-h-[50px]">
        {/* START / HOME TAB */}
        {activeTab === 'home' && (
          <div className="flex items-center gap-2 flex-nowrap">
            {/* Undo / Redo */}
            <div className="flex items-center border-r border-slate-200 pr-2 gap-0.5 shrink-0">
              <button
                onClick={() => executeCommand('undo')}
                title="Rückgängig (Strg + Z)"
                className="p-1.5 hover:bg-slate-100 rounded text-slate-700"
              >
                <Undo className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => executeCommand('redo')}
                title="Wiederholen (Strg + Y)"
                className="p-1.5 hover:bg-slate-100 rounded text-slate-700"
              >
                <Redo className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Font Picker */}
            <div className="flex items-center gap-1 border-r border-slate-200 pr-2 shrink-0">
              <select
                value={fontFamily}
                onChange={(e) => {
                  setFontFamily(e.target.value);
                  executeCommand('fontName', e.target.value);
                }}
                className="text-xs p-1 border border-slate-300 rounded bg-white text-slate-800 font-medium"
              >
                <option value="Calibri">Calibri</option>
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Segoe UI">Segoe UI</option>
                <option value="Georgia">Georgia</option>
                <option value="JetBrains Mono">Monospace</option>
              </select>

              <select
                value={fontSize}
                onChange={(e) => {
                  setFontSize(e.target.value);
                  const map: Record<string, string> = {
                    '9pt': '1',
                    '10pt': '2',
                    '11pt': '3',
                    '14pt': '4',
                    '18pt': '5',
                    '24pt': '6',
                    '36pt': '7',
                  };
                  executeCommand('fontSize', map[e.target.value] || '3');
                }}
                className="text-xs p-1 border border-slate-300 rounded bg-white text-slate-800 font-medium w-16"
              >
                <option value="9pt">9 pt</option>
                <option value="10pt">10 pt</option>
                <option value="11pt">11 pt</option>
                <option value="14pt">14 pt</option>
                <option value="18pt">18 pt</option>
                <option value="24pt">24 pt</option>
                <option value="36pt">36 pt</option>
              </select>
            </div>

            {/* Basic Formats */}
            <div className="flex items-center gap-0.5 border-r border-slate-200 pr-2 shrink-0">
              <button
                onClick={() => executeCommand('bold')}
                title="Fett (Strg + B)"
                className="p-1.5 hover:bg-slate-100 rounded text-slate-800 font-bold"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => executeCommand('italic')}
                title="Kursiv (Strg + I)"
                className="p-1.5 hover:bg-slate-100 rounded text-slate-800 italic"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => executeCommand('underline')}
                title="Unterstrichen (Strg + U)"
                className="p-1.5 hover:bg-slate-100 rounded text-slate-800 underline"
              >
                <Underline className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => executeCommand('strikeThrough')}
                title="Durchgestrichen"
                className="p-1.5 hover:bg-slate-100 rounded text-slate-800"
              >
                <Strikethrough className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Colors */}
            <div className="flex items-center gap-1 border-r border-slate-200 pr-2 shrink-0">
              <label title="Schriftfarbe" className="cursor-pointer flex items-center gap-0.5 p-1 hover:bg-slate-100 rounded">
                <span className="font-extrabold text-xs text-red-600 border-b-2 border-red-600">A</span>
                <input
                  type="color"
                  defaultValue="#000000"
                  onChange={(e) => executeCommand('foreColor', e.target.value)}
                  className="w-4 h-4 opacity-0 absolute pointer-events-none"
                />
              </label>

              <button
                onClick={() => executeCommand('hiliteColor', '#fef08a')}
                title="Textmarker Gelb"
                className="p-1.5 hover:bg-slate-100 rounded text-amber-600 bg-amber-50"
              >
                <Highlighter className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-0.5 border-r border-slate-200 pr-2 shrink-0">
              <button
                onClick={() => executeCommand('justifyLeft')}
                title="Linksbündig"
                className="p-1.5 hover:bg-slate-100 rounded text-slate-800"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => executeCommand('justifyCenter')}
                title="Zentriert"
                className="p-1.5 hover:bg-slate-100 rounded text-slate-800"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => executeCommand('justifyRight')}
                title="Rechtsbündig"
                className="p-1.5 hover:bg-slate-100 rounded text-slate-800"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => executeCommand('justifyFull')}
                title="Blocksatz"
                className="p-1.5 hover:bg-slate-100 rounded text-slate-800"
              >
                <AlignJustify className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Lists */}
            <div className="flex items-center gap-0.5 border-r border-slate-200 pr-2 shrink-0">
              <button
                onClick={() => executeCommand('insertUnorderedList')}
                title="Aufzählungspunkte"
                className="p-1.5 hover:bg-slate-100 rounded text-slate-800"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => executeCommand('insertOrderedList')}
                title="Nummerierte Liste"
                className="p-1.5 hover:bg-slate-100 rounded text-slate-800"
              >
                <ListOrdered className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Heading Styles */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => executeCommand('formatBlock', '<h1>')}
                className="px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-bold text-slate-800"
              >
                Ü1
              </button>
              <button
                onClick={() => executeCommand('formatBlock', '<h2>')}
                className="px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-bold text-slate-700"
              >
                Ü2
              </button>
              <button
                onClick={() => executeCommand('formatBlock', '<p>')}
                className="px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[11px] text-slate-600"
              >
                Standard
              </button>
            </div>
          </div>
        )}

        {/* INSERT TAB */}
        {activeTab === 'insert' && (
          <div className="flex items-center gap-2.5 flex-nowrap">
            <button
              onClick={() => insertTable(3, 3)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 shrink-0"
            >
              <TableIcon className="w-4 h-4 text-blue-600" />
              Tabelle (3x3)
            </button>

            <div className="h-4 w-px bg-slate-200 shrink-0" />

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => insertCallout('info')}
                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded text-xs font-medium"
              >
                + Merkkasten
              </button>
              <button
                onClick={() => insertCallout('tip')}
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-xs font-medium"
              >
                + Lerntipp
              </button>
              <button
                onClick={() => insertCallout('warning')}
                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded text-xs font-medium"
              >
                + Wichtig-Box
              </button>
              <button
                onClick={() => insertCallout('definition')}
                className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded text-xs font-medium"
              >
                + Definition
              </button>
            </div>

            <div className="h-4 w-px bg-slate-200 shrink-0" />

            {/* Math Symbols */}
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[10px] text-slate-400 font-bold">Mathe:</span>
              {['π', '√', '²', '³', '±', '≠', '≈', '≤', '≥', '∞', 'Δ', '∑'].map((sym) => (
                <button
                  key={sym}
                  onClick={() => insertSymbol(sym)}
                  className="w-6 h-6 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded font-mono text-xs font-bold"
                >
                  {sym}
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-slate-200 shrink-0" />

            <button
              onClick={() => executeCommand('insertHorizontalRule')}
              className="px-2 py-1 hover:bg-slate-100 rounded text-xs text-slate-700 shrink-0"
            >
              — Trennlinie
            </button>

            <button
              onClick={() =>
                executeCommand(
                  'insertText',
                  new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
                )
              }
              className="px-2 py-1 hover:bg-slate-100 rounded text-xs text-slate-700 flex items-center gap-1 shrink-0"
            >
              <Calendar className="w-3 h-3" /> Datum
            </button>
          </div>
        )}

        {/* LAYOUT TAB */}
        {activeTab === 'layout' && (
          <div className="flex items-center gap-4 flex-nowrap">
            {/* Margins */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs font-bold text-slate-600">Seitenränder:</span>
              <button
                onClick={() => setPageMargin('normal')}
                className={`px-2.5 py-1 text-xs rounded font-medium ${
                  pageMargin === 'normal' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => setPageMargin('narrow')}
                className={`px-2.5 py-1 text-xs rounded font-medium ${
                  pageMargin === 'narrow' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Schmal
              </button>
              <button
                onClick={() => setPageMargin('wide')}
                className={`px-2.5 py-1 text-xs rounded font-medium ${
                  pageMargin === 'wide' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Breit
              </button>
            </div>

            <div className="h-4 w-px bg-slate-200 shrink-0" />

            {/* Orientation */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs font-bold text-slate-600">Ausrichtung:</span>
              <button
                onClick={() => setIsLandscape(false)}
                className={`px-2.5 py-1 text-xs rounded font-medium ${
                  !isLandscape ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Hochformat
              </button>
              <button
                onClick={() => setIsLandscape(true)}
                className={`px-2.5 py-1 text-xs rounded font-medium ${
                  isLandscape ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Querformat
              </button>
            </div>

            <div className="h-4 w-px bg-slate-200 shrink-0" />

            {/* Page Color */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs font-bold text-slate-600">Seitenfarbe:</span>
              {[
                { name: 'Weiß', val: '#ffffff' },
                { name: 'Elfenbein', val: '#fefce8' },
                { name: 'Hellgrau', val: '#f8fafc' },
                { name: 'Dunkel', val: '#1e293b' },
              ].map((c) => (
                <button
                  key={c.val}
                  onClick={() => setPageColor(c.val)}
                  style={{ backgroundColor: c.val }}
                  className={`w-5 h-5 rounded border ${
                    pageColor === c.val ? 'ring-2 ring-blue-500' : 'border-slate-300'
                  }`}
                  title={c.name}
                />
              ))}
            </div>

            <div className="h-4 w-px bg-slate-200 shrink-0" />

            {/* Watermark */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs font-bold text-slate-600">Wasserzeichen:</span>
              <select
                value={watermark}
                onChange={(e) => setWatermark(e.target.value)}
                className="text-xs p-1 border rounded bg-white"
              >
                <option value="">Keins</option>
                <option value="ENTWURF">ENTWURF</option>
                <option value="SCHULE 2026">SCHULE 2026</option>
                <option value="VERTRAULICH">VERTRAULICH</option>
                <option value="MUSTER">MUSTER</option>
              </select>
            </div>
          </div>
        )}

        {/* REVIEW TAB */}
        {activeTab === 'review' && (
          <div className="flex items-center gap-4 text-xs flex-nowrap">
            <div className="flex items-center gap-2 p-1.5 bg-slate-50 border rounded-lg shrink-0">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>
                <strong>{wordCount}</strong> Wörter | <strong>{charCount}</strong> Zeichen
              </span>
            </div>

            <div className="flex items-center gap-2 p-1.5 bg-slate-50 border rounded-lg shrink-0">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Geschätzte Lesezeit: ~{Math.ceil(wordCount / 200) || 1} Min.</span>
            </div>

            <button
              onClick={() => {
                executeCommand('removeFormat');
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium shrink-0"
            >
              Formatierung bereinigen
            </button>
          </div>
        )}

        {/* VIEW TAB */}
        {activeTab === 'view' && (
          <div className="flex items-center gap-4 text-xs flex-nowrap">
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold w-12 text-center">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(200, z + 10))}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="h-4 w-px bg-slate-200 shrink-0" />

            <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={showRuler}
                onChange={(e) => setShowRuler(e.target.checked)}
                className="rounded"
              />
              <span>Lineal anzeigen</span>
            </label>
          </div>
        )}
      </div>

      {/* Save Notification Toast */}
      {saveToast && (
        <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between animate-in slide-in-from-top">
          <span>{saveToast}</span>
          <button onClick={() => setSaveToast(null)} className="text-white/80 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* 4. RULER BAR */}
      {showRuler && (
        <div className="bg-[#e5e7eb] border-b border-slate-300 h-5 flex items-center px-8 text-[9px] font-mono text-slate-500 select-none overflow-hidden shrink-0">
          <div className="flex-1 flex justify-between">
            <span>0</span>
            <span>2</span>
            <span>4</span>
            <span>6</span>
            <span>8</span>
            <span>10</span>
            <span>12</span>
            <span>14</span>
            <span>16</span>
            <span>18</span>
            <span>20</span>
          </div>
        </div>
      )}

      {/* 5. A4 DOCUMENT PAGE CANVAS */}
      <div className="flex-1 bg-[#d1d5db] p-2.5 sm:p-5 overflow-auto flex justify-center items-start">
        <div
          style={{
            zoom: zoomLevel !== 100 ? `${zoomLevel}%` : undefined,
            backgroundColor: pageColor,
            color: pageColor === '#1e293b' ? '#f8fafc' : '#0f172a',
            fontFamily,
          }}
          className={`relative shadow-2xl border border-slate-300 transition-all rounded-xs min-h-[850px] ${
            pageWidthMode === 'full'
              ? 'w-full max-w-5xl'
              : isLandscape
              ? 'w-[1050px]'
              : 'w-full max-w-[820px]'
          } ${getMarginClass()}`}
        >
          {/* Watermark */}
          {watermark && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center select-none opacity-10">
              <span className="text-7xl font-extrabold -rotate-45 tracking-widest text-slate-900 uppercase">
                {watermark}
              </span>
            </div>
          )}

          {/* Editable Document Body */}
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            suppressContentEditableWarning
            className="outline-none min-h-[700px] leading-relaxed max-w-none focus:outline-none select-text [&_table]:border-collapse [&_table]:w-full [&_table]:my-3.5 [&_th]:border [&_th]:border-slate-300 [&_th]:p-2.5 [&_th]:bg-slate-100 [&_th]:font-bold [&_th]:text-slate-800 [&_td]:border [&_td]:border-slate-300 [&_td]:p-2.5 [&_td]:align-top"
            style={{ fontSize }}
          />

          {/* Page Footer */}
          <div className="mt-12 pt-4 border-t border-slate-200/60 flex items-center justify-between text-[11px] opacity-60 select-none">
            <span>{file.name}</span>
            <span>Seite 1 von 1</span>
          </div>
        </div>
      </div>

      {/* 6. BOTTOM STATUS BAR */}
      <div className="bg-[#f3f4f6] border-t border-slate-300 px-3 sm:px-4 py-1.5 flex items-center justify-between text-xs text-slate-600 select-none">
        <div className="flex items-center gap-3 sm:gap-4 truncate">
          <span>Seite 1 von 1</span>
          <span>{wordCount} Wörter</span>
          <span>{charCount} Zeichen</span>
          <span className="hidden sm:inline">Deutsch (Italien / Deutschland)</span>
        </div>

        {/* Zoom Slider */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
            className="text-slate-500 hover:text-slate-800 p-0.5"
          >
            <Minus className="w-3 h-3" />
          </button>
          <input
            type="range"
            min="50"
            max="180"
            step="5"
            value={zoomLevel}
            onChange={(e) => setZoomLevel(parseInt(e.target.value))}
            className="w-16 sm:w-20 h-1.5 bg-slate-300 rounded-lg cursor-pointer"
          />
          <button
            onClick={() => setZoomLevel((z) => Math.min(180, z + 10))}
            className="text-slate-500 hover:text-slate-800 p-0.5"
          >
            <Plus className="w-3 h-3" />
          </button>
          <span className="w-9 text-right font-mono font-semibold text-[11px]">{zoomLevel}%</span>
        </div>
      </div>
    </div>
  );
};
