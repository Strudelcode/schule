import React, { useState, useEffect } from 'react';
import { VFile } from '../types';
import { useFileSystem } from '../context/FileSystemContext';
import { Save, Download, Plus, Trash2, Calculator, Check, Table, Printer } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  file: VFile;
  onClose?: () => void;
}

export const ExcelViewer: React.FC<Props> = ({ file, onClose }) => {
  const { updateFileSpreadsheet } = useFileSystem();

  const initialRows =
    file.spreadsheet?.sheets?.[0]?.rows || [
      ['A', 'B', 'C', 'D'],
      ['1', '2', '3', '4'],
      ['5', '6', '7', '8'],
    ];

  const [data, setData] = useState<(string | number)[][]>(initialRows);
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  const [formulaValue, setFormulaValue] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  useEffect(() => {
    if (file.spreadsheet?.sheets?.[0]?.rows) {
      setData(file.spreadsheet.sheets[0].rows);
    }
  }, [file.id]);

  const handleCellChange = (r: number, c: number, val: string) => {
    const next = data.map((row, ri) =>
      row.map((cell, ci) => {
        if (ri === r && ci === c) {
          const num = Number(val);
          return !isNaN(num) && val.trim() !== '' ? num : val;
        }
        return cell;
      })
    );
    setData(next);
    setIsSaved(false);
  };

  const handleSave = () => {
    updateFileSpreadsheet(file.id, {
      sheets: [{ name: 'Tabelle1', rows: data }],
    });
    setIsSaved(true);
    setSaveToast(`✅ Tabelle gespeichert in ${file.path}`);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
    setTimeout(() => setSaveToast(null), 3000);
  };

  const addRow = () => {
    const cols = data[0]?.length || 4;
    const newRow = Array(cols).fill('');
    setData([...data, newRow]);
    setIsSaved(false);
  };

  const addColumn = () => {
    const next = data.map((row) => [...row, '']);
    setData(next);
    setIsSaved(false);
  };

  const getColLetter = (index: number) => {
    return String.fromCharCode(65 + index);
  };

  return (
    <div className="flex flex-col bg-white border border-slate-300 rounded-2xl shadow-xl overflow-hidden h-full min-h-[500px]">
      {/* Green Excel Ribbon Header */}
      <div className="bg-[#107c41] text-white px-4 py-2 flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-extrabold text-sm">
            <span className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              X
            </span>
            <span>Microsoft Excel</span>
          </div>

          <div className="h-4 w-px bg-emerald-400/40" />
          <span className="font-bold text-xs sm:text-sm">{file.name}</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              isSaved ? 'bg-emerald-500/30 text-emerald-100' : 'bg-amber-400 text-slate-900 font-bold'
            }`}
          >
            {isSaved ? 'Gespeichert' : 'Ungespeichert'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md text-xs font-bold transition-all"
          >
            <Save className="w-3.5 h-3.5" /> Speichern
          </button>
          {onClose && (
            <button onClick={onClose} className="p-1 hover:bg-emerald-700 rounded text-white">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Toolbar & Formula Bar */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={addRow}
            className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded font-semibold text-slate-700"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" /> Zeile hinzufügen
          </button>
          <button
            onClick={addColumn}
            className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded font-semibold text-slate-700"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" /> Spalte hinzufügen
          </button>
        </div>

        {/* Formula Bar */}
        <div className="flex items-center gap-2 flex-1 max-w-md bg-white border border-slate-300 rounded px-2 py-1">
          <span className="font-mono font-bold text-slate-400 text-xs">fx</span>
          <input
            type="text"
            value={
              selectedCell ? String(data[selectedCell.r]?.[selectedCell.c] ?? '') : formulaValue
            }
            onChange={(e) => {
              if (selectedCell) {
                handleCellChange(selectedCell.r, selectedCell.c, e.target.value);
              }
            }}
            placeholder="Zellwert oder Formel..."
            className="w-full text-xs outline-none font-mono"
          />
        </div>
      </div>

      {saveToast && (
        <div className="bg-emerald-600 text-white px-4 py-1.5 text-xs font-bold">{saveToast}</div>
      )}

      {/* Spreadsheet Grid Table */}
      <div className="flex-1 overflow-auto bg-slate-100 p-3">
        <table className="border-collapse bg-white shadow-xs text-xs font-mono w-full">
          <thead>
            <tr className="bg-slate-200 text-slate-600 select-none">
              <th className="w-10 p-1.5 border border-slate-300 bg-slate-300/60 font-bold">#</th>
              {data[0]?.map((_, colIdx) => (
                <th key={colIdx} className="min-w-28 p-1.5 border border-slate-300 font-bold">
                  {getColLetter(colIdx)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-emerald-50/20">
                <td className="p-1.5 border border-slate-300 bg-slate-100 text-center font-bold text-slate-500 select-none">
                  {rowIdx + 1}
                </td>
                {row.map((cell, colIdx) => {
                  const isSelected = selectedCell?.r === rowIdx && selectedCell?.c === colIdx;
                  return (
                    <td
                      key={colIdx}
                      className={`p-0 border border-slate-300 ${
                        isSelected ? 'ring-2 ring-emerald-600 bg-emerald-50/40' : ''
                      }`}
                      onClick={() => setSelectedCell({ r: rowIdx, c: colIdx })}
                    >
                      <input
                        type="text"
                        value={cell ?? ''}
                        onChange={(e) => handleCellChange(rowIdx, colIdx, e.target.value)}
                        className={`w-full p-2 outline-none bg-transparent font-sans text-xs ${
                          rowIdx === 0 ? 'font-bold bg-slate-50 text-slate-900' : 'text-slate-800'
                        }`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Sheet Tab Bar */}
      <div className="bg-slate-200 border-t border-slate-300 px-4 py-1 flex items-center justify-between text-xs text-slate-600 select-none">
        <div className="flex items-center gap-1">
          <div className="bg-white px-3 py-1 rounded-t border-t-2 border-emerald-600 font-bold text-slate-800">
            Tabelle 1
          </div>
          <button className="p-1 hover:bg-slate-300 rounded">+</button>
        </div>
        <div>
          {data.length} Zeilen • {data[0]?.length || 0} Spalten
        </div>
      </div>
    </div>
  );
};
