import React, { useState } from 'react';
import { IRREGULAR_VERBS_EN } from '../data/schoolData';
import { Search, CheckCircle, XCircle, RotateCcw, Award, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const LanguageTrainer: React.FC = () => {
  const [langTab, setLangTab] = useState<'en_verbs' | 'it_participle' | 'quiz'>('en_verbs');
  const [searchTerm, setSearchTerm] = useState('');

  // English Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [userPast, setUserPast] = useState('');
  const [userParticiple, setUserParticiple] = useState('');
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  // Filtered irregular verbs
  const filteredVerbs = IRREGULAR_VERBS_EN.filter(
    (v) =>
      v.infinitive.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.pastSimple.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.pastParticiple.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.german.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentQuizVerb = IRREGULAR_VERBS_EN[quizIndex % IRREGULAR_VERBS_EN.length];

  const handleCheckQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = (s: string) => s.trim().toLowerCase();
    const correctPast = clean(currentQuizVerb.pastSimple).split('/')[0].trim();
    const correctParticiple = clean(currentQuizVerb.pastParticiple).split('/')[0].trim();

    const pastMatch =
      clean(userPast) === correctPast ||
      currentQuizVerb.pastSimple.toLowerCase().includes(clean(userPast));
    const partMatch =
      clean(userParticiple) === correctParticiple ||
      currentQuizVerb.pastParticiple.toLowerCase().includes(clean(userParticiple));

    const right = pastMatch && partMatch;
    setIsCorrect(right);
    setChecked(true);
    if (right) {
      setScore((s) => s + 1);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    }
  };

  const handleNextVerb = () => {
    setChecked(false);
    setUserPast('');
    setUserParticiple('');
    setQuizIndex((i) => i + 1);
  };

  return (
    <div className="space-y-6">
      {/* Sub tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-200/70 rounded-xl max-w-lg">
        <button
          onClick={() => setLangTab('en_verbs')}
          className={`flex-1 py-2 px-3 rounded-lg font-semibold text-xs sm:text-sm transition-all ${
            langTab === 'en_verbs'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🇬🇧 English Verbs ({IRREGULAR_VERBS_EN.length})
        </button>
        <button
          onClick={() => setLangTab('quiz')}
          className={`flex-1 py-2 px-3 rounded-lg font-semibold text-xs sm:text-sm transition-all ${
            langTab === 'quiz'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🎯 Vokabel-Test (Score: {score})
        </button>
        <button
          onClick={() => setLangTab('it_participle')}
          className={`flex-1 py-2 px-3 rounded-lg font-semibold text-xs sm:text-sm transition-all ${
            langTab === 'it_participle'
              ? 'bg-white text-emerald-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🇮🇹 Italiano Participio
        </button>
      </div>

      {/* 1. ENGLISH VERBS TABLE */}
      {langTab === 'en_verbs' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800">English Irregular Verbs List</h3>
              <p className="text-xs text-slate-500">
                Wichtige unregelmäßige Verben aus dem Englischunterricht zum Nachschlagen und Lernen.
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Verb oder Deutsch suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Infinitive (V1)</th>
                  <th className="py-3 px-4">Past Simple (V2)</th>
                  <th className="py-3 px-4">Past Participle (V3)</th>
                  <th className="py-3 px-4">Deutsch (Bedeutung)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVerbs.map((v, i) => (
                  <tr key={i} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-2.5 px-4 font-bold text-blue-900">{v.infinitive}</td>
                    <td className="py-2.5 px-4 font-mono text-slate-700">{v.pastSimple}</td>
                    <td className="py-2.5 px-4 font-mono text-slate-700">{v.pastParticiple}</td>
                    <td className="py-2.5 px-4 text-slate-600">{v.german}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. INTERACTIVE QUIZ TRAINER */}
      {langTab === 'quiz' && (
        <div className="max-w-2xl bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-500" />
              <span className="font-bold text-slate-800 text-lg">Unregelmäßige Verben Trainer</span>
            </div>
            <div className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold rounded-full">
              Punkte: {score}
            </div>
          </div>

          {/* Flashcard question */}
          <div className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white text-center shadow-md space-y-2">
            <span className="text-xs uppercase tracking-widest text-blue-200 font-bold">Infinitiv</span>
            <h2 className="text-4xl font-extrabold">{currentQuizVerb.infinitive}</h2>
            <p className="text-blue-100 text-sm font-medium">Bedeutung: „{currentQuizVerb.german}“</p>
          </div>

          <form onSubmit={handleCheckQuiz} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  1. Past Simple (V2)
                </label>
                <input
                  type="text"
                  value={userPast}
                  onChange={(e) => setUserPast(e.target.value)}
                  disabled={checked}
                  placeholder="z. B. went"
                  className="w-full p-3 border border-slate-300 rounded-xl font-mono text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  2. Past Participle (V3)
                </label>
                <input
                  type="text"
                  value={userParticiple}
                  onChange={(e) => setUserParticiple(e.target.value)}
                  disabled={checked}
                  placeholder="z. B. gone"
                  className="w-full p-3 border border-slate-300 rounded-xl font-mono text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {!checked ? (
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-xs"
              >
                Antwort prüfen
              </button>
            ) : (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-xl flex items-start gap-3 ${
                    isCorrect ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                  )}
                  <div>
                    <div className="font-bold">{isCorrect ? 'Hervorragend! Richtig!' : 'Leider nicht ganz richtig!'}</div>
                    <div className="text-sm mt-1">
                      Richtige Formen: <span className="font-bold">{currentQuizVerb.infinitive}</span> →{' '}
                      <span className="font-bold">{currentQuizVerb.pastSimple}</span> →{' '}
                      <span className="font-bold">{currentQuizVerb.pastParticiple}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNextVerb}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors"
                >
                  Nächstes Verb →
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* 3. ITALIAN PARTICIPLES */}
      {langTab === 'it_participle' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">🇮🇹 Participio Passato Irregolare</h3>
            <p className="text-xs text-slate-500">
              Übersicht der häufigsten unregelmäßigen Partizipien im Italienischen für das Passato Prossimo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { inf: 'aprire', pp: 'aperto', de: 'öffnen' },
              { inf: 'bere', pp: 'bevuto', de: 'trinken' },
              { inf: 'chiedere', pp: 'chiesto', de: 'fragen / bitten' },
              { inf: 'chiudere', pp: 'chiuso', de: 'schließen' },
              { inf: 'decidere', pp: 'deciso', de: 'entscheiden' },
              { inf: 'dire', pp: 'detto', de: 'sagen' },
              { inf: 'fare', pp: 'fatto', de: 'machen / tun' },
              { inf: 'leggere', pp: 'letto', de: 'lesen' },
              { inf: 'mettere', pp: 'messo', de: 'legen / setzen' },
              { inf: 'morire', pp: 'morto', de: 'sterben' },
              { inf: 'nascere', pp: 'nato', de: 'geboren werden' },
              { inf: 'offrire', pp: 'offerto', de: 'anbieten' },
              { inf: 'perdere', pp: 'perso / perduto', de: 'verlieren' },
              { inf: 'prendere', pp: 'preso', de: 'nehmen' },
              { inf: 'rimanere', pp: 'rimasto', de: 'bleiben' },
              { inf: 'rispondere', pp: 'risposto', de: 'antworten' },
              { inf: 'scrivere', pp: 'scritto', de: 'schreiben' },
              { inf: 'spegnere', pp: 'spento', de: 'ausschalten' },
              { inf: 'vedere', pp: 'visto / veduto', de: 'sehen' },
              { inf: 'venire', pp: 'venuto', de: 'kommen' },
              { inf: 'vincere', pp: 'vinto', de: 'gewinnen' },
            ].map((item, idx) => (
              <div key={idx} className="p-3.5 bg-emerald-50/50 border border-emerald-200/80 rounded-xl">
                <div className="text-xs text-emerald-800 font-semibold">{item.de}</div>
                <div className="font-bold text-slate-800 text-base mt-0.5">{item.inf}</div>
                <div className="text-emerald-700 font-mono font-bold mt-1 text-sm">→ {item.pp}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
