import React, { useState, useMemo, useRef, useEffect } from 'react';
import { VFile, FileType } from '../types';
import { useFileSystem } from '../context/FileSystemContext';
import { WordEditor } from './WordEditor';
import { ExcelViewer } from './ExcelViewer';
import { PowerPointViewer } from './PowerPointViewer';
import { MediaViewer } from './MediaViewer';
import {
  Folder,
  FolderOpen,
  FileText,
  FileSpreadsheet,
  FileCode,
  Search,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  RotateCw,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Download,
  Star,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  List as ListIcon,
  PanelRightClose,
  PanelRightOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Monitor,
  Sparkles,
  ExternalLink,
  FolderPlus,
  FilePlus,
  Maximize2,
  Minimize2,
  ArrowUpDown,
  Filter,
  Columns,
  SplitSquareVertical,
  SlidersHorizontal,
  Info,
  Grid3X3,
  AlignJustify,
} from 'lucide-react';
import confetti from 'canvas-confetti';

type SortField = 'name' | 'date' | 'type' | 'size';
type SortOrder = 'asc' | 'desc';
type TypeFilter = 'all' | 'folder' | 'docx' | 'xlsx' | 'pptx' | 'pdf';
type ViewMode = 'tiles' | 'grid' | 'details' | 'list';

export const WindowsExplorer: React.FC = () => {
  const {
    files,
    currentFolderId,
    currentFolderPath,
    selectedFileId,
    selectedFile,
    history,
    historyIndex,
    searchQuery,
    setSearchQuery,
    setCurrentFolderId,
    setSelectedFileId,
    navigateBack,
    navigateForward,
    navigateUp,
    navigateToPath,
    createFolder,
    createFile,
    renameItem,
    deleteItem,
    duplicateItem,
    toggleFavorite,
    getFolderChildren,
    allFolders,
  } = useFileSystem();

  const [viewMode, setViewMode] = useState<ViewMode>('tiles');
  const [showPreviewPane, setShowPreviewPane] = useState<boolean>(true);
  const [showLeftSidebar, setShowLeftSidebar] = useState<boolean>(true);
  const [splitRatio, setSplitRatio] = useState<number>(35); // 35% explorer, 65% word for generous reading space
  const [isDraggingSplitter, setIsDraggingSplitter] = useState<boolean>(false);
  const [expandedFolderIds, setExpandedFolderIds] = useState<Set<string>>(
    new Set(['root', 'f_de', 'f_de_dok', 'f_org', 'f_math'])
  );

  // Sorting & Filtering
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  // New Item Modals / State
  const [showNewMenu, setShowNewMenu] = useState<boolean>(false);
  const [showSortMenu, setShowSortMenu] = useState<boolean>(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: VFile } | null>(null);
  const [activeTabQuick, setActiveTabQuick] = useState<'all' | 'favorites' | 'recent'>('all');

  const containerRef = useRef<HTMLDivElement>(null);

  // Splitter Dragging Logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingSplitter || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const totalWidth = rect.width;
      let newRatio = Math.round((relativeX / totalWidth) * 100);
      if (newRatio < 25) newRatio = 25;
      if (newRatio > 75) newRatio = 75;
      setSplitRatio(newRatio);
    };

    const handleMouseUp = () => {
      if (isDraggingSplitter) {
        setIsDraggingSplitter(false);
      }
    };

    if (isDraggingSplitter) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSplitter]);

  // Toggle folder expansion in tree
  const toggleExpand = (folderId: string) => {
    setExpandedFolderIds((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  // Filter and sort items
  const currentItems = useMemo(() => {
    let list: VFile[] = [];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = files.filter(
        (f) => f.name.toLowerCase().includes(q) || (f.summary && f.summary.toLowerCase().includes(q))
      );
    } else if (activeTabQuick === 'favorites') {
      list = files.filter((f) => f.isFavorite);
    } else {
      list = files.filter((f) => f.parentId === currentFolderId);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      if (typeFilter === 'folder') {
        list = list.filter((f) => f.isFolder);
      } else {
        list = list.filter((f) => !f.isFolder && f.type === typeFilter);
      }
    }

    // Sort: Folders first, then files
    list.sort((a, b) => {
      if (a.isFolder && !b.isFolder) return -1;
      if (!a.isFolder && b.isFolder) return 1;

      let valA: string | number = '';
      let valB: string | number = '';

      if (sortField === 'name') {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      } else if (sortField === 'date') {
        valA = a.dateModified;
        valB = b.dateModified;
      } else if (sortField === 'type') {
        valA = a.type;
        valB = b.type;
      } else if (sortField === 'size') {
        valA = parseInt(a.size?.replace(/[^0-9]/g, '') || '0', 10);
        valB = parseInt(b.size?.replace(/[^0-9]/g, '') || '0', 10);
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [files, currentFolderId, searchQuery, activeTabQuick, typeFilter, sortField, sortOrder]);

  // Breadcrumbs calculation
  const breadcrumbs = useMemo(() => {
    if (currentFolderId === 'root') {
      return [{ id: 'root', name: 'Dieser PC', path: 'Dieser PC' }];
    }
    const crumbs: { id: string; name: string; path: string }[] = [];
    let cur = files.find((f) => f.id === currentFolderId);
    while (cur) {
      crumbs.unshift({ id: cur.id, name: cur.name, path: cur.path });
      cur = files.find((f) => f.id === cur?.parentId);
    }
    crumbs.unshift({ id: 'root', name: 'Dieser PC', path: 'Dieser PC' });
    return crumbs;
  }, [files, currentFolderId]);

  // Handle New File/Folder creation
  const handleCreateNew = (type: 'folder' | 'docx' | 'xlsx' | 'pptx' | 'txt') => {
    setShowNewMenu(false);
    if (type === 'folder') {
      const name = prompt('Name des neuen Ordners:', 'Neuer Ordner');
      if (name && name.trim()) {
        const newF = createFolder(currentFolderId, name.trim());
        setCurrentFolderId(newF.id);
        confetti({ particleCount: 25, spread: 45 });
      }
    } else {
      const defaultNames = {
        docx: 'Neues Word-Dokument',
        xlsx: 'Neue Excel-Tabelle',
        pptx: 'Neue PowerPoint-Präsentation',
        txt: 'Neues Textdokument',
      };
      const name = prompt(`Name der ${type.toUpperCase()}-Datei:`, defaultNames[type]);
      if (name && name.trim()) {
        const newFile = createFile(currentFolderId, name.trim(), type);
        setSelectedFileId(newFile.id);
        setShowPreviewPane(true);
        confetti({ particleCount: 30, spread: 55 });
      }
    }
  };

  // Render file icon
  const renderFileIcon = (item: VFile, size: 'sm' | 'md' | 'lg' = 'md') => {
    if (item.isFolder) {
      if (size === 'sm') {
        return <Folder className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />;
      }
      return (
        <div className="relative flex items-center justify-center">
          <div className="w-11 h-9 bg-gradient-to-b from-amber-400 to-amber-500 rounded-md shadow-xs flex items-center justify-center text-amber-900">
            <Folder className="w-6 h-6 text-amber-100 fill-amber-300 drop-shadow-xs" />
          </div>
        </div>
      );
    }

    switch (item.type) {
      case 'docx':
      case 'dotx':
        if (size === 'sm') {
          return (
            <div className="w-4 h-4 bg-blue-600 rounded-xs flex items-center justify-center text-white text-[8px] font-black shrink-0">
              W
            </div>
          );
        }
        return (
          <div className="relative flex items-center justify-center">
            <div className="w-9 h-11 bg-white border border-blue-200 rounded-sm shadow-xs flex flex-col items-center justify-between p-0.5 overflow-hidden">
              <div className="w-full bg-blue-600 rounded-xs py-0.5 flex items-center justify-center text-white font-extrabold text-[10px] shadow-2xs">
                W
              </div>
              <div className="w-full px-1 space-y-1 my-auto">
                <div className="h-0.5 w-full bg-slate-200 rounded-full" />
                <div className="h-0.5 w-4/5 bg-slate-200 rounded-full" />
                <div className="h-0.5 w-full bg-slate-200 rounded-full" />
              </div>
            </div>
          </div>
        );
      case 'xlsx':
        if (size === 'sm') {
          return (
            <div className="w-4 h-4 bg-emerald-600 rounded-xs flex items-center justify-center text-white text-[8px] font-black shrink-0">
              X
            </div>
          );
        }
        return (
          <div className="relative flex items-center justify-center">
            <div className="w-9 h-11 bg-white border border-emerald-200 rounded-sm shadow-xs flex flex-col items-center justify-between p-0.5 overflow-hidden">
              <div className="w-full bg-emerald-600 rounded-xs py-0.5 flex items-center justify-center text-white font-extrabold text-[10px] shadow-2xs">
                X
              </div>
              <div className="w-full px-1 space-y-1 my-auto">
                <div className="h-0.5 w-full bg-emerald-100 rounded-full" />
                <div className="h-0.5 w-3/4 bg-emerald-100 rounded-full" />
                <div className="h-0.5 w-full bg-emerald-100 rounded-full" />
              </div>
            </div>
          </div>
        );
      case 'pptx':
        if (size === 'sm') {
          return (
            <div className="w-4 h-4 bg-orange-600 rounded-xs flex items-center justify-center text-white text-[8px] font-black shrink-0">
              P
            </div>
          );
        }
        return (
          <div className="relative flex items-center justify-center">
            <div className="w-9 h-11 bg-white border border-orange-200 rounded-sm shadow-xs flex flex-col items-center justify-between p-0.5 overflow-hidden">
              <div className="w-full bg-orange-600 rounded-xs py-0.5 flex items-center justify-center text-white font-extrabold text-[10px] shadow-2xs">
                P
              </div>
              <div className="w-full px-1 space-y-1 my-auto">
                <div className="h-0.5 w-full bg-orange-100 rounded-full" />
                <div className="h-0.5 w-4/5 bg-orange-100 rounded-full" />
              </div>
            </div>
          </div>
        );
      case 'pdf':
        if (size === 'sm') {
          return (
            <div className="w-4 h-4 bg-rose-600 rounded-xs flex items-center justify-center text-white text-[7px] font-black shrink-0">
              PDF
            </div>
          );
        }
        return (
          <div className="relative flex items-center justify-center">
            <div className="w-9 h-11 bg-white border border-rose-200 rounded-sm shadow-xs flex flex-col items-center justify-between p-0.5 overflow-hidden">
              <div className="w-full bg-rose-600 rounded-xs py-0.5 flex items-center justify-center text-white font-extrabold text-[8px] shadow-2xs">
                PDF
              </div>
              <div className="w-full px-1 space-y-1 my-auto">
                <div className="h-0.5 w-full bg-rose-100 rounded-full" />
                <div className="h-0.5 w-2/3 bg-rose-100 rounded-full" />
              </div>
            </div>
          </div>
        );
      case 'html':
        return <FileCode className={size === 'sm' ? 'w-4 h-4 text-amber-600 shrink-0' : 'w-8 h-8 text-amber-600'} />;
      case 'url':
        return <ExternalLink className={size === 'sm' ? 'w-4 h-4 text-cyan-600 shrink-0' : 'w-8 h-8 text-cyan-600'} />;
      default:
        return <FileText className={size === 'sm' ? 'w-4 h-4 text-slate-500 shrink-0' : 'w-8 h-8 text-slate-500'} />;
    }
  };

  // Render Right Preview Pane Content
  const renderPreviewPane = () => {
    if (!selectedFile) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white border border-slate-200 rounded-2xl shadow-xs">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-inner">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Wähle eine Datei zur Bearbeitung</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1.5 leading-relaxed">
            Klicke auf ein beliebiges Word-Dokument (<span className="font-semibold text-blue-600">.docx</span>), eine Excel-Tabelle (<span className="font-semibold text-emerald-600">.xlsx</span>) oder eine Präsentation, um hier den vollwertigen Editor zu starten.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => handleCreateNew('docx')}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Neues Word-Dokument erstellen
            </button>
          </div>
        </div>
      );
    }

    if (selectedFile.type === 'docx' || selectedFile.type === 'dotx' || selectedFile.type === 'txt') {
      return <WordEditor file={selectedFile} isCompact={true} />;
    }

    if (selectedFile.type === 'xlsx') {
      return <ExcelViewer file={selectedFile} />;
    }

    if (selectedFile.type === 'pptx') {
      return <PowerPointViewer file={selectedFile} />;
    }

    return <MediaViewer file={selectedFile} />;
  };

  // Recursive Tree Node Renderer for the left sidebar
  const renderTreeNode = (folder: VFile, depth: number = 0) => {
    const isExpanded = expandedFolderIds.has(folder.id);
    const isCurrent = currentFolderId === folder.id;
    const subfolders = files.filter((f) => f.parentId === folder.id && f.isFolder);

    return (
      <div key={folder.id} className="select-none">
        <div
          style={{ paddingLeft: `${depth * 12 + 6}px` }}
          onClick={() => {
            setCurrentFolderId(folder.id);
            setActiveTabQuick('all');
          }}
          className={`flex items-center gap-1.5 py-1 px-1.5 rounded-lg cursor-pointer text-xs transition-colors group ${
            isCurrent
              ? 'bg-blue-100 text-blue-900 font-bold shadow-2xs'
              : 'text-slate-700 hover:bg-slate-200/70'
          }`}
        >
          {subfolders.length > 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(folder.id);
              }}
              className="p-0.5 hover:bg-slate-300 rounded text-slate-400 hover:text-slate-700 transition-colors"
            >
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          ) : (
            <span className="w-3.5" />
          )}

          {isExpanded ? (
            <FolderOpen className="w-3.5 h-3.5 text-amber-500 fill-amber-300 shrink-0" />
          ) : (
            <Folder className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
          )}

          <span className="truncate flex-1 text-[11px] font-medium">{folder.name}</span>
        </div>

        {isExpanded && subfolders.length > 0 && (
          <div className="flex flex-col">
            {subfolders.map((sf) => renderTreeNode(sf, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const rootFolders = useMemo(() => {
    return files.filter((f) => f.parentId === 'root' && f.isFolder);
  }, [files]);

  return (
    <div
      ref={containerRef}
      onClick={() => {
        setContextMenu(null);
        setShowNewMenu(false);
        setShowSortMenu(false);
      }}
      className="flex flex-col h-[calc(100vh-80px)] min-h-[720px] bg-slate-100 border border-slate-300 rounded-2xl shadow-xl overflow-hidden font-sans select-none"
    >
      {/* 1. WINDOWS EXPLORER COMMAND BAR / TOP RIBBON */}
      <div className="bg-white border-b border-slate-200 px-3 sm:px-4 py-2 flex items-center justify-between gap-2 sm:gap-3 select-none flex-wrap">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* New Item Dropdown */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowNewMenu(!showNewMenu);
                setShowSortMenu(false);
              }}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Neu</span>
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>

            {showNewMenu && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-full left-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1.5 text-xs animate-in fade-in-50"
              >
                <button
                  onClick={() => handleCreateNew('folder')}
                  className="flex items-center gap-2.5 w-full p-2 hover:bg-amber-50 rounded-lg text-slate-800 text-left font-medium"
                >
                  <FolderPlus className="w-4 h-4 text-amber-500" />
                  <span>Neuer Ordner</span>
                </button>
                <div className="h-px bg-slate-100 my-1" />
                <button
                  onClick={() => handleCreateNew('docx')}
                  className="flex items-center gap-2.5 w-full p-2 hover:bg-blue-50 rounded-lg text-slate-800 text-left font-medium"
                >
                  <div className="w-4 h-4 bg-blue-600 rounded-xs flex items-center justify-center text-white text-[9px] font-bold">
                    W
                  </div>
                  <span>Microsoft Word Dokument (.docx)</span>
                </button>
                <button
                  onClick={() => handleCreateNew('xlsx')}
                  className="flex items-center gap-2.5 w-full p-2 hover:bg-emerald-50 rounded-lg text-slate-800 text-left font-medium"
                >
                  <div className="w-4 h-4 bg-emerald-600 rounded-xs flex items-center justify-center text-white text-[9px] font-bold">
                    X
                  </div>
                  <span>Microsoft Excel Arbeitsblatt (.xlsx)</span>
                </button>
                <button
                  onClick={() => handleCreateNew('pptx')}
                  className="flex items-center gap-2.5 w-full p-2 hover:bg-orange-50 rounded-lg text-slate-800 text-left font-medium"
                >
                  <div className="w-4 h-4 bg-orange-600 rounded-xs flex items-center justify-center text-white text-[9px] font-bold">
                    P
                  </div>
                  <span>PowerPoint Präsentation (.pptx)</span>
                </button>
              </div>
            )}
          </div>

          <div className="h-5 w-px bg-slate-200 mx-0.5 hidden sm:block" />

          {/* Quick Item Actions */}
          <button
            onClick={() => {
              if (selectedFileId) duplicateItem(selectedFileId);
            }}
            disabled={!selectedFileId}
            title="Duplizieren / Kopieren"
            className="p-1.5 hover:bg-slate-100 disabled:opacity-30 rounded-lg text-slate-700 transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (selectedFileId) {
                const item = files.find((f) => f.id === selectedFileId);
                if (item) {
                  const newN = prompt('Neuer Name:', item.name);
                  if (newN && newN.trim()) renameItem(item.id, newN.trim());
                }
              }
            }}
            disabled={!selectedFileId}
            title="Umbenennen (F2)"
            className="p-1.5 hover:bg-slate-100 disabled:opacity-30 rounded-lg text-slate-700 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (selectedFileId) {
                if (confirm('Möchtest du dieses Element wirklich löschen?')) {
                  deleteItem(selectedFileId);
                }
              }
            }}
            disabled={!selectedFileId}
            title="Löschen (Entf)"
            className="p-1.5 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30 rounded-lg text-slate-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-slate-200 mx-0.5 hidden sm:block" />

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSortMenu(!showSortMenu);
                setShowNewMenu(false);
              }}
              title="Sortieren"
              className="flex items-center gap-1 px-2.5 py-1.5 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Sortieren</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {showSortMenu && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-full left-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1.5 text-xs animate-in fade-in-50"
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                  Sortieren nach
                </div>
                {(['name', 'date', 'type', 'size'] as SortField[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      if (sortField === f) {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortField(f);
                        setSortOrder('asc');
                      }
                      setShowSortMenu(false);
                    }}
                    className={`flex items-center justify-between w-full p-1.5 rounded-md text-left font-medium ${
                      sortField === f ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>
                      {f === 'name' ? 'Name' : f === 'date' ? 'Änderungsdatum' : f === 'type' ? 'Typ' : 'Größe'}
                    </span>
                    {sortField === f && (
                      <span className="text-[10px] text-blue-600 font-mono">
                        {sortOrder === 'asc' ? '↑ Aufsteigend' : '↓ Absteigend'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Left Sidebar Toggle & Search */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowLeftSidebar(!showLeftSidebar)}
            title={showLeftSidebar ? 'Navigationsbereich ausblenden' : 'Navigationsbereich einblenden'}
            className={`p-1.5 rounded-lg border text-xs font-medium transition-all ${
              showLeftSidebar
                ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                : 'bg-blue-50 border-blue-200 text-blue-700'
            }`}
          >
            {showLeftSidebar ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </button>
        </div>

        {/* Right Action Icons: Layout, View Mode & Preview Pane Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Preset Split Ratios */}
          {showPreviewPane && (
            <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setSplitRatio(25)}
                title="Word Großansicht (75% Word, 25% Explorer - viel Platz zum Schreiben)"
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                  splitRatio === 25 ? 'bg-blue-600 shadow-2xs text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📝 Word Fokus (75%)
              </button>
              <button
                onClick={() => setSplitRatio(50)}
                title="Geteilte Ansicht (50% / 50%)"
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                  splitRatio === 50 ? 'bg-white shadow-2xs text-blue-700 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                50 : 50
              </button>
              <button
                onClick={() => setSplitRatio(75)}
                title="Explorer Großansicht (75% Ordner, 25% Word)"
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                  splitRatio === 75 ? 'bg-white shadow-2xs text-blue-700 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📁 Explorer (75%)
              </button>
            </div>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('tiles')}
              title="Kacheln (Windows 11 Standard - breit mit Details)"
              className={`p-1.5 rounded-md text-xs transition-all flex items-center gap-1 ${
                viewMode === 'tiles' ? 'bg-white shadow-2xs text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden xl:inline text-[11px]">Kacheln</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              title="Große Symbole"
              className={`p-1.5 rounded-md text-xs transition-all flex items-center gap-1 ${
                viewMode === 'grid' ? 'bg-white shadow-2xs text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span className="hidden xl:inline text-[11px]">Symbole</span>
            </button>
            <button
              onClick={() => setViewMode('details')}
              title="Details (Tabelle mit Spalten)"
              className={`p-1.5 rounded-md text-xs transition-all flex items-center gap-1 ${
                viewMode === 'details' ? 'bg-white shadow-2xs text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ListIcon className="w-3.5 h-3.5" />
              <span className="hidden xl:inline text-[11px]">Details</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              title="Liste (Kompakt)"
              className={`p-1.5 rounded-md text-xs transition-all flex items-center gap-1 ${
                viewMode === 'list' ? 'bg-white shadow-2xs text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <AlignJustify className="w-3.5 h-3.5" />
              <span className="hidden xl:inline text-[11px]">Liste</span>
            </button>
          </div>

          <div className="h-5 w-px bg-slate-200 mx-0.5" />

          {/* Toggle Preview / Editor Pane */}
          <button
            onClick={() => setShowPreviewPane(!showPreviewPane)}
            title={showPreviewPane ? 'Rechte Vorschau schließen' : 'Rechte Vorschau & Word öffnen'}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              showPreviewPane
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {showPreviewPane ? (
              <>
                <PanelRightClose className="w-4 h-4 text-blue-600" />
                <span className="hidden sm:inline">Vorschau aus</span>
              </>
            ) : (
              <>
                <PanelRightOpen className="w-4 h-4 text-blue-600" />
                <span className="hidden sm:inline">Word öffnen</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. ADDRESS BREADCRUMB & SEARCH BAR */}
      <div className="bg-[#f8fafc] border-b border-slate-200 px-3 sm:px-4 py-2 flex items-center gap-2 text-xs select-none">
        {/* Navigation Buttons */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={navigateBack}
            disabled={historyIndex <= 0}
            title="Zurück"
            className="p-1.5 hover:bg-slate-200 disabled:opacity-25 rounded-md text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={navigateForward}
            disabled={historyIndex >= history.length - 1}
            title="Vorwärts"
            className="p-1.5 hover:bg-slate-200 disabled:opacity-25 rounded-md text-slate-700 transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={navigateUp}
            disabled={currentFolderId === 'root'}
            title="Eine Ebene nach oben"
            className="p-1.5 hover:bg-slate-200 disabled:opacity-25 rounded-md text-slate-700 transition-colors"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCurrentFolderId(currentFolderId)}
            title="Aktualisieren"
            className="p-1.5 hover:bg-slate-200 rounded-md text-slate-700 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Address Bar / Clickable Breadcrumbs */}
        <div className="flex-1 flex items-center gap-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1 overflow-x-auto shadow-2xs min-w-0">
          <Monitor className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.id}>
              {idx > 0 && <span className="text-slate-400 font-bold shrink-0">›</span>}
              <button
                onClick={() => setCurrentFolderId(crumb.id)}
                className={`hover:bg-blue-50 px-1.5 py-0.5 rounded text-xs truncate max-w-40 font-medium shrink-0 cursor-pointer ${
                  idx === breadcrumbs.length - 1 ? 'font-bold text-slate-900 bg-slate-100' : 'text-slate-600'
                }`}
              >
                {crumb.name}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Search Field */}
        <div className="w-40 sm:w-56 lg:w-64 relative shrink-0">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Dateien durchsuchen..."
            className="w-full pl-8 pr-7 py-1 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:border-blue-500 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs px-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 2b. FILTER CHIPS BAR */}
      <div className="bg-slate-50 border-b border-slate-200 px-3 sm:px-4 py-1.5 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <span className="text-slate-400 font-semibold uppercase tracking-wider mr-1 text-[10px] shrink-0">
          Filter:
        </span>
        <button
          onClick={() => setTypeFilter('all')}
          className={`px-2 py-0.5 rounded-full font-semibold transition-colors shrink-0 ${
            typeFilter === 'all'
              ? 'bg-slate-800 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          Alle ({files.filter((f) => f.parentId === currentFolderId).length})
        </button>
        <button
          onClick={() => setTypeFilter('folder')}
          className={`px-2 py-0.5 rounded-full font-semibold transition-colors shrink-0 flex items-center gap-1 ${
            typeFilter === 'folder'
              ? 'bg-amber-500 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-amber-50'
          }`}
        >
          📁 Ordner
        </button>
        <button
          onClick={() => setTypeFilter('docx')}
          className={`px-2 py-0.5 rounded-full font-semibold transition-colors shrink-0 flex items-center gap-1 ${
            typeFilter === 'docx'
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-blue-50'
          }`}
        >
          📄 Word (.docx)
        </button>
        <button
          onClick={() => setTypeFilter('xlsx')}
          className={`px-2 py-0.5 rounded-full font-semibold transition-colors shrink-0 flex items-center gap-1 ${
            typeFilter === 'xlsx'
              ? 'bg-emerald-600 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50'
          }`}
        >
          📊 Excel (.xlsx)
        </button>
        <button
          onClick={() => setTypeFilter('pptx')}
          className={`px-2 py-0.5 rounded-full font-semibold transition-colors shrink-0 flex items-center gap-1 ${
            typeFilter === 'pptx'
              ? 'bg-orange-600 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-orange-50'
          }`}
        >
          📽️ PowerPoint (.pptx)
        </button>
        <button
          onClick={() => setTypeFilter('pdf')}
          className={`px-2 py-0.5 rounded-full font-semibold transition-colors shrink-0 flex items-center gap-1 ${
            typeFilter === 'pdf'
              ? 'bg-rose-600 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-rose-50'
          }`}
        >
          📕 PDF
        </button>
      </div>

      {/* 3. MAIN EXPLORER SPLIT VIEW (Tree + Files + Draggable Splitter + Right Preview) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Navigation Tree */}
        {showLeftSidebar && (
          <div className="w-56 sm:w-60 bg-[#f8fafc] border-r border-slate-200 p-2.5 overflow-y-auto hidden md:flex flex-col gap-3 select-none shrink-0">
            {/* Quick Access */}
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 mb-1 block">
                Schnellzugriff
              </span>
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => {
                    setCurrentFolderId('root');
                    setActiveTabQuick('all');
                  }}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors text-left ${
                    currentFolderId === 'root' && activeTabQuick === 'all'
                      ? 'bg-blue-100 text-blue-900 font-bold'
                      : 'text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  <Monitor className="w-4 h-4 text-blue-600" />
                  <span>Dieser PC (Hauptordner)</span>
                </button>

                <button
                  onClick={() => setActiveTabQuick('favorites')}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors text-left ${
                    activeTabQuick === 'favorites'
                      ? 'bg-amber-100 text-amber-900 font-bold'
                      : 'text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>Favoriten</span>
                </button>
              </div>
            </div>

            <div className="h-px bg-slate-200" />

            {/* Dieser PC / Hierarchical Tree */}
            <div className="flex-1 overflow-y-auto">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 mb-1 block">
                Schulfächer & Ordner
              </span>
              <div className="flex flex-col gap-0.5">
                {rootFolders.map((rf) => renderTreeNode(rf, 0))}
              </div>
            </div>
          </div>
        )}

        {/* Center Files & Folders List Area */}
        <div
          style={{
            width: showPreviewPane ? `${splitRatio}%` : '100%',
          }}
          className="flex flex-col bg-white overflow-hidden transition-none"
        >
          <div
            className="flex-1 p-3 sm:p-4 overflow-auto"
            onContextMenu={(e) => {
              e.preventDefault();
            }}
          >
            {currentItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 text-slate-400">
                <FolderOpen className="w-12 h-12 stroke-[1.5] mb-2 text-slate-300" />
                <p className="font-semibold text-sm text-slate-700">Keine Elemente gefunden</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                  {searchQuery
                    ? 'Keine passende Datei für deine Suche gefunden.'
                    : 'Klicke oben auf „Neu“, um Ordner oder Word-Dokumente zu erstellen.'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-3 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                  >
                    Suche zurücksetzen
                  </button>
                )}
              </div>
            ) : viewMode === 'tiles' ? (
              /* TILES VIEW (Windows 11 Standard): Wide horizontal cards with icon on left and full name on right */
              <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-2 sm:gap-2.5 select-none">
                {currentItems.map((item) => {
                  const isSelected = selectedFileId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedFileId(item.id);
                      }}
                      onDoubleClick={() => {
                        if (item.isFolder) {
                          setCurrentFolderId(item.id);
                        } else {
                          setSelectedFileId(item.id);
                          setShowPreviewPane(true);
                        }
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setContextMenu({ x: e.clientX, y: e.clientY, item });
                      }}
                      className={`group flex items-center gap-3 p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer relative select-none ${
                        isSelected
                          ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                          : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      {/* Icon */}
                      <div className="shrink-0">{renderFileIcon(item, 'md')}</div>

                      {/* Name & Details */}
                      <div className="flex-1 min-w-0 pr-4">
                        <div
                          title={item.name}
                          className="text-xs font-semibold text-slate-800 truncate leading-tight"
                        >
                          {item.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                          {item.isFolder ? 'Dateiordner' : `${item.type.toUpperCase()} • ${item.size || '15 KB'}`}
                        </div>
                      </div>

                      {/* Favorite Pin */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item.id);
                        }}
                        className={`absolute top-1.5 right-1.5 p-1 rounded-full transition-opacity ${
                          item.isFavorite
                            ? 'opacity-100 text-amber-500'
                            : 'opacity-0 group-hover:opacity-100 text-slate-400 hover:text-amber-500'
                        }`}
                      >
                        <Star className={`w-3 h-3 ${item.isFavorite ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : viewMode === 'grid' ? (
              /* LARGE ICONS VIEW */
              <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2.5 select-none">
                {currentItems.map((item) => {
                  const isSelected = selectedFileId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedFileId(item.id);
                      }}
                      onDoubleClick={() => {
                        if (item.isFolder) {
                          setCurrentFolderId(item.id);
                        } else {
                          setSelectedFileId(item.id);
                          setShowPreviewPane(true);
                        }
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setContextMenu({ x: e.clientX, y: e.clientY, item });
                      }}
                      className={`group flex flex-col items-center justify-between p-2.5 rounded-xl border text-center transition-all cursor-pointer relative min-h-[115px] ${
                        isSelected
                          ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                          : 'bg-white border-slate-200/80 hover:bg-slate-50/80 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      {/* Favorite Pin */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item.id);
                        }}
                        className={`absolute top-1.5 right-1.5 p-1 rounded-full transition-opacity ${
                          item.isFavorite
                            ? 'opacity-100 text-amber-500'
                            : 'opacity-0 group-hover:opacity-100 text-slate-400 hover:text-amber-500'
                        }`}
                      >
                        <Star className={`w-3 h-3 ${item.isFavorite ? 'fill-amber-400' : ''}`} />
                      </button>

                      {/* Icon */}
                      <div className="my-1.5">{renderFileIcon(item, 'md')}</div>

                      {/* Name */}
                      <div className="w-full px-0.5">
                        <span
                          title={item.name}
                          className="text-[11px] sm:text-xs font-semibold text-slate-800 line-clamp-2 break-words leading-tight block text-center"
                        >
                          {item.name}
                        </span>
                      </div>

                      {/* Meta Subtitle */}
                      <span className="text-[10px] text-slate-400 mt-1 font-medium">
                        {item.isFolder ? 'Ordner' : item.size || '15 KB'}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : viewMode === 'list' ? (
              /* COMPACT LIST VIEW */
              <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-1.5 select-none">
                {currentItems.map((item) => {
                  const isSelected = selectedFileId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedFileId(item.id)}
                      onDoubleClick={() => {
                        if (item.isFolder) setCurrentFolderId(item.id);
                        else {
                          setSelectedFileId(item.id);
                          setShowPreviewPane(true);
                        }
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setContextMenu({ x: e.clientX, y: e.clientY, item });
                      }}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border text-left transition-all cursor-pointer text-xs ${
                        isSelected
                          ? 'bg-blue-100/80 border-blue-400 font-bold text-blue-900'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      {renderFileIcon(item, 'sm')}
                      <span className="truncate flex-1 font-medium text-xs">{item.name}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* DETAILS / TABLE VIEW */
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold select-none text-[11px]">
                      <th className="pb-2 pl-2">Name</th>
                      <th className="pb-2 w-32">Änderungsdatum</th>
                      <th className="pb-2 w-28">Typ</th>
                      <th className="pb-2 w-20 text-right pr-2">Größe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item) => {
                      const isSelected = selectedFileId === item.id;
                      return (
                        <tr
                          key={item.id}
                          onClick={() => {
                            setSelectedFileId(item.id);
                          }}
                          onDoubleClick={() => {
                            if (item.isFolder) {
                              setCurrentFolderId(item.id);
                            } else {
                              setSelectedFileId(item.id);
                              setShowPreviewPane(true);
                            }
                          }}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setContextMenu({ x: e.clientX, y: e.clientY, item });
                          }}
                          className={`border-b border-slate-100 cursor-pointer transition-colors ${
                            isSelected ? 'bg-blue-100/70 font-semibold text-blue-900' : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="py-2 pl-2 flex items-center gap-2">
                            {renderFileIcon(item, 'sm')}
                            <span className="truncate max-w-xs font-medium text-slate-800">{item.name}</span>
                          </td>
                          <td className="py-2 text-slate-500 text-[11px]">{item.dateModified}</td>
                          <td className="py-2 text-slate-500 uppercase font-mono text-[10px]">
                            {item.isFolder ? 'Dateiordner' : `${item.type}-Datei`}
                          </td>
                          <td className="py-2 text-right pr-2 text-slate-500 font-mono text-[11px]">
                            {item.isFolder ? '' : item.size || '14 KB'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Bottom Status Bar */}
          <div className="bg-[#f8fafc] border-t border-slate-200 px-3 sm:px-4 py-1.5 flex items-center justify-between text-xs text-slate-500 select-none">
            <span className="truncate">
              {currentItems.length} Elemente{' '}
              {selectedFile ? `• 1 Element ausgewählt (${selectedFile.name})` : ''}
            </span>
            <span className="font-mono text-[11px] text-slate-400 shrink-0">Schule Lernportal A-Zug</span>
          </div>
        </div>

        {/* DRAGGABLE SPLITTER BAR (when preview is open) */}
        {showPreviewPane && (
          <div
            onMouseDown={(e) => {
              e.preventDefault();
              setIsDraggingSplitter(true);
            }}
            title="Ziehen zum Anpassen der Ansichtsbreite"
            className={`w-2 hover:w-2.5 bg-slate-200 hover:bg-blue-500 cursor-col-resize flex items-center justify-center transition-all select-none z-20 ${
              isDraggingSplitter ? 'bg-blue-600 w-2.5 ring-2 ring-blue-400' : ''
            }`}
          >
            <div className="h-8 w-0.5 bg-slate-400 rounded-full" />
          </div>
        )}

        {/* Right Preview Pane & Word Editor */}
        {showPreviewPane && (
          <div
            style={{
              width: `${100 - splitRatio}%`,
            }}
            className="border-l border-slate-300 bg-slate-100 p-2 sm:p-3.5 overflow-y-auto flex flex-col shadow-inner min-w-[320px]"
          >
            {renderPreviewPane()}
          </div>
        )}
      </div>

      {/* Right-Click Context Menu */}
      {contextMenu && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed bg-white border border-slate-200 rounded-xl shadow-2xl z-50 p-1.5 text-xs w-52 animate-in fade-in-50"
        >
          <button
            onClick={() => {
              if (contextMenu.item.isFolder) {
                setCurrentFolderId(contextMenu.item.id);
              } else {
                setSelectedFileId(contextMenu.item.id);
                setShowPreviewPane(true);
              }
              setContextMenu(null);
            }}
            className="flex items-center gap-2 w-full p-2 hover:bg-blue-50 rounded-lg text-slate-800 text-left font-bold"
          >
            <FolderOpen className="w-4 h-4 text-blue-600" />
            <span>{contextMenu.item.isFolder ? 'Ordner öffnen' : 'In Word/Office bearbeiten'}</span>
          </button>

          <button
            onClick={() => {
              duplicateItem(contextMenu.item.id);
              setContextMenu(null);
            }}
            className="flex items-center gap-2 w-full p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 text-left font-medium"
          >
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            <span>Duplizieren</span>
          </button>

          <button
            onClick={() => {
              toggleFavorite(contextMenu.item.id);
              setContextMenu(null);
            }}
            className="flex items-center gap-2 w-full p-1.5 hover:bg-amber-50 rounded-lg text-slate-700 text-left font-medium"
          >
            <Star className="w-3.5 h-3.5 text-amber-500" />
            <span>{contextMenu.item.isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}</span>
          </button>

          <div className="h-px bg-slate-100 my-1" />

          <button
            onClick={() => {
              const newN = prompt('Neuer Name:', contextMenu.item.name);
              if (newN && newN.trim()) renameItem(contextMenu.item.id, newN.trim());
              setContextMenu(null);
            }}
            className="flex items-center gap-2 w-full p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 text-left font-medium"
          >
            <Edit2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Umbenennen</span>
          </button>

          <button
            onClick={() => {
              if (confirm(`„${contextMenu.item.name}“ wirklich löschen?`)) {
                deleteItem(contextMenu.item.id);
              }
              setContextMenu(null);
            }}
            className="flex items-center gap-2 w-full p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg text-left font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Löschen</span>
          </button>
        </div>
      )}
    </div>
  );
};
