import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { VFile, FileType } from '../types';
import { INITIAL_FILES } from '../data/virtualFileSystem';

const LS_FILES_KEY = 'schule_vfs_files_v3';

interface FileSystemContextType {
  files: VFile[];
  currentFolderId: string;
  currentFolderPath: string;
  selectedFileId: string | null;
  selectedFile: VFile | null;
  history: string[];
  historyIndex: number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  setCurrentFolderId: (id: string) => void;
  setSelectedFileId: (id: string | null) => void;
  navigateBack: () => void;
  navigateForward: () => void;
  navigateUp: () => void;
  navigateToPath: (path: string) => void;
  createFolder: (parentId: string, name: string) => VFile;
  createFile: (parentId: string, name: string, type: FileType, content?: string) => VFile;
  updateFileContent: (fileId: string, content: string) => void;
  updateFileSpreadsheet: (fileId: string, spreadsheet: any) => void;
  updateFileSlides: (fileId: string, slides: any) => void;
  renameItem: (id: string, newName: string) => void;
  deleteItem: (id: string) => void;
  duplicateItem: (id: string) => void;
  toggleFavorite: (id: string) => void;
  resetToDefault: () => void;
  getFileIconColor: (type: FileType) => string;
  getFolderChildren: (folderId: string) => VFile[];
  allFolders: VFile[];
}

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined);

export const FileSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<VFile[]>(() => {
    try {
      const saved = localStorage.getItem(LS_FILES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_FILES;
    } catch {
      return INITIAL_FILES;
    }
  });

  const [currentFolderId, setCurrentFolderIdState] = useState<string>('root');
  const [selectedFileId, setSelectedFileId] = useState<string | null>('file_de_wortarten');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Navigation history
  const [history, setHistory] = useState<string[]>(['root']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LS_FILES_KEY, JSON.stringify(files));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [files]);

  const currentFolder = useMemo(() => {
    return files.find((f) => f.id === currentFolderId && f.isFolder);
  }, [files, currentFolderId]);

  const currentFolderPath = currentFolder ? currentFolder.path : 'Dieser PC';

  const selectedFile = useMemo(() => {
    return files.find((f) => f.id === selectedFileId && !f.isFolder) || null;
  }, [files, selectedFileId]);

  const setCurrentFolderId = (id: string) => {
    if (id === currentFolderId) return;
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push(id);
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
    setCurrentFolderIdState(id);
  };

  const navigateBack = () => {
    if (historyIndex > 0) {
      const prevId = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setCurrentFolderIdState(prevId);
    }
  };

  const navigateForward = () => {
    if (historyIndex < history.length - 1) {
      const nextId = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setCurrentFolderIdState(nextId);
    }
  };

  const navigateUp = () => {
    if (currentFolderId === 'root') return;
    const current = files.find((f) => f.id === currentFolderId);
    if (!current || current.parentId === 'root') {
      setCurrentFolderId('root');
    } else {
      setCurrentFolderId(current.parentId);
    }
  };

  const navigateToPath = (targetPath: string) => {
    if (targetPath === '/' || targetPath === 'Dieser PC') {
      setCurrentFolderId('root');
      return;
    }
    const clean = targetPath.startsWith('/') ? targetPath : `/${targetPath}`;
    const match = files.find((f) => f.isFolder && f.path.toLowerCase() === clean.toLowerCase());
    if (match) {
      setCurrentFolderId(match.id);
    }
  };

  const getFolderChildren = (folderId: string) => {
    return files.filter((f) => f.parentId === folderId);
  };

  const allFolders = useMemo(() => {
    return files.filter((f) => f.isFolder);
  }, [files]);

  const createFolder = (parentId: string, name: string): VFile => {
    const parent = files.find((f) => f.id === parentId);
    const parentPath = parent ? parent.path : '';
    const newPath = `${parentPath}/${name}`.replace('//', '/');

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newFolder: VFile = {
      id: `folder_${Date.now()}`,
      name,
      path: newPath,
      parentId,
      isFolder: true,
      type: 'folder',
      dateModified: formattedDate,
    };

    setFiles((prev) => [...prev, newFolder]);
    return newFolder;
  };

  const createFile = (parentId: string, name: string, type: FileType, content?: string): VFile => {
    const parent = files.find((f) => f.id === parentId);
    const parentPath = parent ? parent.path : '';
    const ext = name.includes('.') ? '' : `.${type}`;
    const fullName = `${name}${ext}`;
    const newPath = `${parentPath}/${fullName}`.replace('//', '/');

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    let defaultContent = content || '';
    let spreadsheetData = undefined;
    let slidesData = undefined;

    if (type === 'docx' && !content) {
      defaultContent = `<h1>${name.replace('.docx', '')}</h1><p>Hier mit dem Schreiben deines Schul-Dokuments beginnen...</p>`;
    } else if (type === 'xlsx') {
      spreadsheetData = {
        sheets: [
          {
            name: 'Tabelle1',
            rows: [
              ['Nr.', 'Bezeichnung', 'Wert 1', 'Wert 2', 'Summe'],
              ['1', 'Posten A', 10, 20, 30],
              ['2', 'Posten B', 15, 25, 40],
              ['3', 'Posten C', 5, 10, 15],
              ['Gesamt', '', '', '', '=SUMME(E2:E4)'],
            ],
          },
        ],
      };
    } else if (type === 'pptx') {
      slidesData = [
        {
          title: name.replace('.pptx', ''),
          bullets: ['Unterüberschrift der Präsentation', 'Erstellt mit dem Schule-Lernportal'],
          notes: 'Notizen für die Einleitung',
        },
        {
          title: 'Gliederung & Punkte',
          bullets: ['Themenüberblick', 'Wichtige Fakten & Beispiele', 'Fazit & Diskussion'],
        },
      ];
    }

    const newFile: VFile = {
      id: `file_${Date.now()}`,
      name: fullName,
      path: newPath,
      parentId,
      isFolder: false,
      type,
      size: '12.4 KB',
      dateModified: formattedDate,
      content: defaultContent,
      spreadsheet: spreadsheetData,
      slides: slidesData,
    };

    setFiles((prev) => [...prev, newFile]);
    setSelectedFileId(newFile.id);
    return newFile;
  };

  const updateFileContent = (fileId: string, content: string) => {
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, content, dateModified: formattedDate } : f))
    );
  };

  const updateFileSpreadsheet = (fileId: string, spreadsheet: any) => {
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, spreadsheet, dateModified: formattedDate } : f))
    );
  };

  const updateFileSlides = (fileId: string, slides: any) => {
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, slides, dateModified: formattedDate } : f))
    );
  };

  const renameItem = (id: string, newName: string) => {
    if (!newName.trim()) return;
    setFiles((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const parts = item.path.split('/');
        parts[parts.length - 1] = newName;
        const newPath = parts.join('/');
        return { ...item, name: newName, path: newPath };
      })
    );
  };

  const deleteItem = (id: string) => {
    // Delete item and any recursive children if folder
    const toDeleteIds = new Set<string>([id]);

    let changed = true;
    while (changed) {
      changed = false;
      files.forEach((f) => {
        if (toDeleteIds.has(f.parentId) && !toDeleteIds.has(f.id)) {
          toDeleteIds.add(f.id);
          changed = true;
        }
      });
    }

    setFiles((prev) => prev.filter((f) => !toDeleteIds.has(f.id)));
    if (selectedFileId && toDeleteIds.has(selectedFileId)) {
      setSelectedFileId(null);
    }
  };

  const duplicateItem = (id: string) => {
    const item = files.find((f) => f.id === id);
    if (!item) return;

    const copyName = item.isFolder ? `${item.name} - Kopie` : item.name.replace(/(\.[^.]+)$/, ' - Kopie$1');
    const copyId = `${item.isFolder ? 'folder' : 'file'}_${Date.now()}`;
    const copyPath = `${item.path.substring(0, item.path.lastIndexOf('/'))}/${copyName}`;

    const duplicate: VFile = {
      ...item,
      id: copyId,
      name: copyName,
      path: copyPath,
      dateModified: 'Jetzt',
    };

    setFiles((prev) => [...prev, duplicate]);
  };

  const toggleFavorite = (id: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isFavorite: !f.isFavorite } : f))
    );
  };

  const resetToDefault = () => {
    setFiles(INITIAL_FILES);
    setCurrentFolderIdState('root');
    setSelectedFileId('file_de_wortarten');
    localStorage.removeItem(LS_FILES_KEY);
  };

  const getFileIconColor = (type: FileType) => {
    switch (type) {
      case 'docx':
      case 'dotx':
        return 'text-blue-600';
      case 'xlsx':
        return 'text-emerald-600';
      case 'pptx':
        return 'text-orange-600';
      case 'pdf':
        return 'text-rose-600';
      case 'html':
        return 'text-amber-600';
      case 'jpg':
      case 'png':
        return 'text-purple-600';
      case 'mp4':
      case 'mp3':
        return 'text-indigo-600';
      default:
        return 'text-slate-600';
    }
  };

  return (
    <FileSystemContext.Provider
      value={{
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
        updateFileContent,
        updateFileSpreadsheet,
        updateFileSlides,
        renameItem,
        deleteItem,
        duplicateItem,
        toggleFavorite,
        resetToDefault,
        getFileIconColor,
        getFolderChildren,
        allFolders,
      }}
    >
      {children}
    </FileSystemContext.Provider>
  );
};

export const useFileSystem = () => {
  const context = useContext(FileSystemContext);
  if (!context) {
    throw new Error('useFileSystem must be used within a FileSystemProvider');
  }
  return context;
};
