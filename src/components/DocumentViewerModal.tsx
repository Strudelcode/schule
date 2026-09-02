import React, { useState } from 'react';
import { DocumentItem } from '../types';
import { X, BookOpen, CheckCircle, FileText, Sparkles, Check, HelpCircle, Monitor, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  doc: DocumentItem | null;
  onClose: () => void;
  onOpenInExplorer?: (doc: DocumentItem) => void;
}

export const DocumentViewerModal: React.FC<Props> = ({ doc, onClose, onOpenInExplorer }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState<boolean>(false);

  if (!doc) return null;

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (submittedQuiz) return;
    setSelectedAnswers({ ...selectedAnswers, [qIdx]: optIdx });
  };

  const handleCheckQuiz = () => {
    setSubmittedQuiz(true);
    if (!doc.quiz) return;
    const allCorrect = doc.quiz.every((q, i) => selectedAnswers[i] === q.correctIndex);
    if (allCorrect) {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                {doc.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">.{doc.type}</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">{doc.title}</h2>
            <div className="text-xs text-slate-500 font-mono truncate max-w-md">
              {doc.originalPath}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-700">
          {/* Summary Block */}
          <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl">
            <div className="font-bold text-indigo-900 text-xs uppercase tracking-wide mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Zusammenfassung & Kernaussage
            </div>
            <p className="text-indigo-950 font-medium leading-relaxed">{doc.summary}</p>
          </div>

          {/* Rules / Vocabulary / Rules table */}
          {doc.rules && doc.rules.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Regeln & Fachbegriffe
              </h3>
              <div className="space-y-2.5">
                {doc.rules.map((rule, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                    <div className="font-bold text-slate-900 text-sm">{rule.term}</div>
                    <div className="text-slate-600 text-xs">{rule.explanation}</div>
                    {rule.example && (
                      <div className="text-xs text-indigo-700 font-mono bg-indigo-50/50 p-1.5 rounded-md mt-1">
                        Beispiel: {rule.example}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sections if available */}
          {doc.sections && doc.sections.length > 0 && (
            <div className="space-y-4">
              {doc.sections.map((sec, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="font-bold text-slate-800 text-sm">{sec.title}</h4>
                  <div className="text-slate-600 text-xs leading-relaxed whitespace-pre-line bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    {sec.body}
                  </div>
                  {sec.bulletPoints && (
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 pl-2">
                      {sec.bulletPoints.map((bp, bIdx) => (
                        <li key={bIdx}>{bp}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Interactive Quiz if present */}
          {doc.quiz && doc.quiz.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  Verständnis-Check ({doc.quiz.length} Fragen)
                </h3>
              </div>

              {doc.quiz.map((q, qIdx) => (
                <div key={qIdx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="font-semibold text-slate-900 text-xs">
                    {qIdx + 1}. {q.question}
                  </div>
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[qIdx] === optIdx;
                      let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';

                      if (submittedQuiz) {
                        if (optIdx === q.correctIndex) {
                          btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold';
                        } else if (isSelected) {
                          btnStyle = 'bg-rose-100 border-rose-500 text-rose-900 line-through';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold ring-2 ring-indigo-500/20';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(qIdx, optIdx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {submittedQuiz && optIdx === q.correctIndex && (
                            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {submittedQuiz && (
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600">
                      <strong>Erklärung:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              ))}

              {!submittedQuiz ? (
                <button
                  onClick={handleCheckQuiz}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Antworten überprüfen
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSubmittedQuiz(false);
                    setSelectedAnswers({});
                  }}
                  className="w-full py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Quiz wiederholen
                </button>
              )}
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {doc.tags.map((tag, idx) => (
              <span key={idx} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          {onOpenInExplorer ? (
            <button
              onClick={() => {
                onClose();
                onOpenInExplorer(doc);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Monitor className="w-4 h-4" />
              <span>In Windows-Explorer & Word öffnen</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
