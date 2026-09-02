import React from 'react';
import { VFile } from '../types';
import { FileCode, Globe, Image as ImageIcon, ExternalLink, Download } from 'lucide-react';

interface Props {
  file: VFile;
  onClose?: () => void;
}

export const MediaViewer: React.FC<Props> = ({ file, onClose }) => {
  if (file.type === 'html') {
    return (
      <div className="flex flex-col bg-white border border-slate-300 rounded-2xl shadow-xl overflow-hidden h-full min-h-[500px]">
        {/* Top Header */}
        <div className="bg-amber-700 text-white px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-300" />
            <span className="font-bold text-sm">{file.name}</span>
            <span className="text-xs bg-amber-800/60 px-2 py-0.5 rounded text-amber-100">
              HTML / Web-Vorschau
            </span>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-1 hover:bg-amber-800 rounded text-white">
              ✕
            </button>
          )}
        </div>

        {/* Live Preview / Code container */}
        <div className="flex-1 p-6 bg-slate-50 overflow-auto">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Webseite gerendert:
            </h3>
            <div
              className="prose max-w-none p-4 border rounded-lg bg-amber-50/20"
              dangerouslySetInnerHTML={{ __html: file.content || '' }}
            />
          </div>

          <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto">
            <h4 className="text-slate-400 font-sans font-bold text-xs uppercase mb-2">Quellcode:</h4>
            <pre>{file.content}</pre>
          </div>
        </div>
      </div>
    );
  }

  if (file.type === 'url') {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-300 rounded-2xl shadow-xl text-center h-full min-h-[400px]">
        <div className="w-16 h-16 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center mb-4">
          <Globe className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">{file.name}</h2>
        <p className="text-slate-500 text-sm mb-6">Internetverknüpfung / Schullink</p>
        <div className="p-3 bg-slate-50 border rounded-lg font-mono text-xs text-blue-600 max-w-md break-all mb-6">
          {file.content || 'https://schule.digital-portal.schule'}
        </div>
        <a
          href={file.content || '#'}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all"
        >
          <ExternalLink className="w-4 h-4" /> Link im Browser öffnen
        </a>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white border border-slate-300 rounded-2xl text-center h-full flex flex-col items-center justify-center">
      <FileCode className="w-12 h-12 text-slate-400 mb-3" />
      <h3 className="text-lg font-bold text-slate-800">{file.name}</h3>
      <p className="text-slate-500 text-sm mt-1">Dateityp: {file.type.toUpperCase()}</p>
      <div className="mt-4 p-4 bg-slate-50 border rounded-lg text-left w-full max-w-lg text-xs font-mono">
        {file.content || 'Kein Vorschautext vorhanden.'}
      </div>
    </div>
  );
};
