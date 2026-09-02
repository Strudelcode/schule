import React, { useState, useEffect } from 'react';
import { FootballTeam, FootballMatch } from '../types';
import { Trophy, Plus, Trash2, Edit, Download, Upload, RefreshCw, UserCheck, ShieldAlert, Check } from 'lucide-react';

const LS_TEAMS = 'fullapp_teams_v2';
const LS_MATCHES = 'fullapp_matches_v2';

const INITIAL_TEAMS: FootballTeam[] = [
  { name: 'FC Adler', logo: '' },
  { name: 'SV Südtirol', logo: '' },
  { name: 'Dynamo Bozen', logo: '' },
  { name: 'Red Stars', logo: '' },
];

export const FootballManager: React.FC = () => {
  const [teams, setTeams] = useState<FootballTeam[]>(() => {
    try {
      const saved = localStorage.getItem(LS_TEAMS);
      return saved ? JSON.parse(saved) : INITIAL_TEAMS;
    } catch {
      return INITIAL_TEAMS;
    }
  });

  const [matches, setMatches] = useState<FootballMatch[]>(() => {
    try {
      const saved = localStorage.getItem(LS_MATCHES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(LS_TEAMS, JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem(LS_MATCHES, JSON.stringify(matches));
  }, [matches]);

  // Form states for Match
  const [labelHome, setLabelHome] = useState('');
  const [labelAway, setLabelAway] = useState('');
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [homeGoals, setHomeGoals] = useState<number | ''>('');
  const [awayGoals, setAwayGoals] = useState<number | ''>('');
  const [matchDate, setMatchDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [editIndex, setEditIndex] = useState<number>(-1);

  // Scorer subforms
  const [tempScorersHome, setTempScorersHome] = useState<{ name: string; goals: number }[]>([]);
  const [tempScorersAway, setTempScorersAway] = useState<{ name: string; goals: number }[]>([]);
  const [scorerHomeName, setScorerHomeName] = useState('');
  const [scorerHomeGoals, setScorerHomeGoals] = useState<number>(1);
  const [scorerAwayName, setScorerAwayName] = useState('');
  const [scorerAwayGoals, setScorerAwayGoals] = useState<number>(1);

  // New Team form
  const [newTeamName, setNewTeamName] = useState('');

  // Add team
  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    if (teams.some((t) => t.name.toLowerCase() === newTeamName.trim().toLowerCase())) {
      alert('Dieses Team existiert bereits!');
      return;
    }
    setTeams([...teams, { name: newTeamName.trim(), logo: '' }]);
    setNewTeamName('');
  };

  const handleDeleteTeam = (index: number) => {
    if (confirm(`Team „${teams[index].name}“ wirklich löschen?`)) {
      setTeams(teams.filter((_, i) => i !== index));
    }
  };

  // Add temp scorer
  const handleAddScorer = (side: 'home' | 'away') => {
    if (side === 'home') {
      if (!scorerHomeName.trim() || scorerHomeGoals <= 0) return;
      setTempScorersHome([...tempScorersHome, { name: scorerHomeName.trim(), goals: scorerHomeGoals }]);
      setScorerHomeName('');
      setScorerHomeGoals(1);
    } else {
      if (!scorerAwayName.trim() || scorerAwayGoals <= 0) return;
      setTempScorersAway([...tempScorersAway, { name: scorerAwayName.trim(), goals: scorerAwayGoals }]);
      setScorerAwayName('');
      setScorerAwayGoals(1);
    }
  };

  // Save match
  const handleSaveMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeTeam || !awayTeam) {
      alert('Bitte Heim- und Gastteam auswählen!');
      return;
    }
    if (homeTeam === awayTeam) {
      alert('Heim- und Gastteam dürfen nicht gleich sein!');
      return;
    }
    if (!matchDate) {
      alert('Bitte Spieldatum auswählen!');
      return;
    }

    const hG = typeof homeGoals === 'number' ? homeGoals : 0;
    const aG = typeof awayGoals === 'number' ? awayGoals : 0;

    const [y, m, d] = matchDate.split('-');
    const formattedDate = `${d}.${m}.${y}`;

    const newMatch: FootballMatch = {
      labelHome,
      labelAway,
      homeTeam,
      awayTeam,
      homeGoals: hG,
      awayGoals: aG,
      date: formattedDate,
      scorers: {
        home: [...tempScorersHome],
        away: [...tempScorersAway],
      },
    };

    if (editIndex >= 0) {
      const updated = [...matches];
      updated[editIndex] = newMatch;
      setMatches(updated);
      setEditIndex(-1);
    } else {
      setMatches([...matches, newMatch]);
    }

    // Reset match form
    setLabelHome('');
    setLabelAway('');
    setHomeTeam('');
    setAwayTeam('');
    setHomeGoals('');
    setAwayGoals('');
    setTempScorersHome([]);
    setTempScorersAway([]);
  };

  const handleEditMatch = (index: number) => {
    const m = matches[index];
    setEditIndex(index);
    setLabelHome(m.labelHome || '');
    setLabelAway(m.labelAway || '');
    setHomeTeam(m.homeTeam);
    setAwayTeam(m.awayTeam);
    setHomeGoals(m.homeGoals);
    setAwayGoals(m.awayGoals);
    if (m.date && m.date.includes('.')) {
      const [d, mo, y] = m.date.split('.');
      setMatchDate(`${y}-${mo}-${d}`);
    }
    setTempScorersHome(m.scorers?.home ? [...m.scorers.home] : []);
    setTempScorersAway(m.scorers?.away ? [...m.scorers.away] : []);
  };

  const handleDeleteMatch = (index: number) => {
    if (confirm('Spiel wirklich löschen?')) {
      setMatches(matches.filter((_, i) => i !== index));
    }
  };

  // Compute standings table
  const tableData: Record<
    string,
    { team: string; played: number; wins: number; draws: number; losses: number; gf: number; ga: number; gd: number; pts: number }
  > = {};

  teams.forEach((t) => {
    tableData[t.name] = { team: t.name, played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
  });

  const scorersMap: Record<string, number> = {};

  matches.forEach((m) => {
    if (!tableData[m.homeTeam]) {
      tableData[m.homeTeam] = { team: m.homeTeam, played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
    }
    if (!tableData[m.awayTeam]) {
      tableData[m.awayTeam] = { team: m.awayTeam, played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
    }

    const home = tableData[m.homeTeam];
    const away = tableData[m.awayTeam];

    home.played += 1;
    away.played += 1;
    home.gf += Number(m.homeGoals);
    home.ga += Number(m.awayGoals);
    away.gf += Number(m.awayGoals);
    away.ga += Number(m.homeGoals);

    if (Number(m.homeGoals) > Number(m.awayGoals)) {
      home.wins += 1;
      away.losses += 1;
      home.pts += 3;
    } else if (Number(m.homeGoals) < Number(m.awayGoals)) {
      away.wins += 1;
      home.losses += 1;
      away.pts += 3;
    } else {
      home.draws += 1;
      away.draws += 1;
      home.pts += 1;
      away.pts += 1;
    }

    (m.scorers?.home || []).forEach((s) => {
      scorersMap[s.name] = (scorersMap[s.name] || 0) + Number(s.goals);
    });
    (m.scorers?.away || []).forEach((s) => {
      scorersMap[s.name] = (scorersMap[s.name] || 0) + Number(s.goals);
    });
  });

  Object.values(tableData).forEach((t) => {
    t.gd = t.gf - t.ga;
  });

  const standings = Object.values(tableData).sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.gd !== a.gd) return b.gd - a.gd;
    return b.gf - a.gf;
  });

  const topScorers = Object.entries(scorersMap)
    .map(([name, goals]) => ({ name, goals }))
    .sort((a, b) => b.goals - a.goals);

  // Export JSON
  const handleExport = () => {
    const data = { teams, matches };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fussball_manager_daten.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.teams) && Array.isArray(parsed.matches)) {
          setTeams(parsed.teams);
          setMatches(parsed.matches);
          alert('Daten erfolgreich importiert!');
        } else {
          alert('Ungültiges Dateiformat.');
        }
      } catch {
        alert('Fehler beim Parsen der JSON-Datei.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-7 h-7 text-amber-300" />
            <h2 className="text-2xl font-extrabold">⚽ Voller Fußball-Manager</h2>
          </div>
          <p className="text-emerald-100 text-xs mt-1">
            Vollwertige Ligatabelle, Spielplan, Torschützenliste & Teamverwaltung (aus 99_Unklar zuordnen/Dateien/fußball.html).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1 bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>
          <label className="flex items-center gap-1 bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            Import JSON
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Teams & Match Creator (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Teams section */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-base flex items-center justify-between">
              <span>Teams verwalten ({teams.length})</span>
            </h3>

            <form onSubmit={handleAddTeam} className="flex gap-2">
              <input
                type="text"
                placeholder="Teamname (z. B. FC Adler)"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="flex-1 p-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" /> Team hinzufügen
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              {teams.map((t, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-800"
                >
                  <span className="text-base">⚽</span>
                  <span>{t.name}</span>
                  <button
                    onClick={() => handleDeleteTeam(idx)}
                    className="text-slate-400 hover:text-rose-600 transition-colors ml-1"
                    title="Team löschen"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Match Creator Form */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-base">
                {editIndex >= 0 ? '📝 Spiel bearbeiten' : '🏆 Spiel eintragen'}
              </h3>
              {editIndex >= 0 && (
                <button
                  onClick={() => {
                    setEditIndex(-1);
                    setLabelHome('');
                    setLabelAway('');
                    setHomeTeam('');
                    setAwayTeam('');
                    setHomeGoals('');
                    setAwayGoals('');
                    setTempScorersHome([]);
                    setTempScorersAway([]);
                  }}
                  className="text-xs text-rose-600 font-bold hover:underline"
                >
                  Abbrechen
                </button>
              )}
            </div>

            <form onSubmit={handleSaveMatch} className="space-y-4">
              {/* Teams & Score Row */}
              <div className="grid grid-cols-1 sm:grid-cols-7 gap-3 items-center">
                {/* Home */}
                <div className="sm:col-span-3 space-y-1">
                  <label className="text-xs font-bold text-slate-600 block">Heimteam</label>
                  <select
                    value={homeTeam}
                    onChange={(e) => setHomeTeam(e.target.value)}
                    required
                    className="w-full p-2.5 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="">Heim wählen...</option>
                    {teams.map((t, idx) => (
                      <option key={idx} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Score */}
                <div className="sm:col-span-1 flex flex-col items-center justify-center">
                  <label className="text-xs font-bold text-slate-600 mb-1">Tore</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      value={homeGoals}
                      onChange={(e) => setHomeGoals(e.target.value === '' ? '' : parseInt(e.target.value))}
                      placeholder="0"
                      className="w-10 text-center font-bold p-1.5 border rounded-lg"
                    />
                    <span className="font-bold">:</span>
                    <input
                      type="number"
                      min="0"
                      value={awayGoals}
                      onChange={(e) => setAwayGoals(e.target.value === '' ? '' : parseInt(e.target.value))}
                      placeholder="0"
                      className="w-10 text-center font-bold p-1.5 border rounded-lg"
                    />
                  </div>
                </div>

                {/* Away */}
                <div className="sm:col-span-3 space-y-1">
                  <label className="text-xs font-bold text-slate-600 block">Gastteam</label>
                  <select
                    value={awayTeam}
                    onChange={(e) => setAwayTeam(e.target.value)}
                    required
                    className="w-full p-2.5 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="">Gast wählen...</option>
                    {teams.map((t, idx) => (
                      <option key={idx} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Spieldatum</label>
                <input
                  type="date"
                  value={matchDate}
                  onChange={(e) => setMatchDate(e.target.value)}
                  className="p-2 border border-slate-300 rounded-xl text-sm w-full sm:w-48"
                />
              </div>

              {/* Torschützen sub-forms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                {/* Home scorers */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700">Torschützen (Heim)</div>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Spielername"
                      value={scorerHomeName}
                      onChange={(e) => setScorerHomeName(e.target.value)}
                      className="flex-1 p-1.5 text-xs border rounded-lg"
                    />
                    <input
                      type="number"
                      min="1"
                      value={scorerHomeGoals}
                      onChange={(e) => setScorerHomeGoals(parseInt(e.target.value) || 1)}
                      className="w-12 p-1.5 text-xs text-center border rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddScorer('home')}
                      className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                  <div className="space-y-1">
                    {tempScorersHome.map((s, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-xs bg-slate-50 px-2 py-1 rounded-md"
                      >
                        <span>
                          {s.name} ({s.goals} Tore)
                        </span>
                        <button
                          type="button"
                          onClick={() => setTempScorersHome(tempScorersHome.filter((_, idx) => idx !== i))}
                          className="text-rose-500 font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Away scorers */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700">Torschützen (Gast)</div>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Spielername"
                      value={scorerAwayName}
                      onChange={(e) => setScorerAwayName(e.target.value)}
                      className="flex-1 p-1.5 text-xs border rounded-lg"
                    />
                    <input
                      type="number"
                      min="1"
                      value={scorerAwayGoals}
                      onChange={(e) => setScorerAwayGoals(parseInt(e.target.value) || 1)}
                      className="w-12 p-1.5 text-xs text-center border rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddScorer('away')}
                      className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                  <div className="space-y-1">
                    {tempScorersAway.map((s, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-xs bg-slate-50 px-2 py-1 rounded-md"
                      >
                        <span>
                          {s.name} ({s.goals} Tore)
                        </span>
                        <button
                          type="button"
                          onClick={() => setTempScorersAway(tempScorersAway.filter((_, idx) => idx !== i))}
                          className="text-rose-500 font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors shadow-xs"
              >
                {editIndex >= 0 ? '💾 Änderungen speichern' : '🏆 Spiel speichern'}
              </button>
            </form>
          </div>

          {/* Matches History */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 font-bold text-slate-800 text-sm">
              Ausgetragene Spiele ({matches.length})
            </div>
            {matches.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">Noch keine Spiele eingetragen.</div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {matches.map((m, idx) => (
                  <div key={idx} className="p-3.5 hover:bg-slate-50/60 transition-colors flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-xs text-slate-400">{m.date}</div>
                      <div className="text-sm font-bold text-slate-800">
                        {m.homeTeam} <span className="text-emerald-600 mx-1">{m.homeGoals} : {m.awayGoals}</span> {m.awayTeam}
                      </div>
                      {(m.scorers?.home?.length > 0 || m.scorers?.away?.length > 0) && (
                        <div className="text-xs text-slate-500 flex gap-2">
                          {m.scorers?.home?.length > 0 && (
                            <span>Heim: {m.scorers.home.map((s) => `${s.name} (${s.goals})`).join(', ')}</span>
                          )}
                          {m.scorers?.away?.length > 0 && (
                            <span>Gast: {m.scorers.away.map((s) => `${s.name} (${s.goals})`).join(', ')}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditMatch(idx)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
                        title="Bearbeiten"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMatch(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Löschen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Table Standings & Top Scorers (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Standings Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-900 text-white font-bold text-sm flex items-center justify-between">
              <span>🏆 Offizielle Tabelle</span>
              <span className="text-xs text-slate-400">{standings.length} Teams</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse">
                <thead className="bg-slate-100 text-slate-600 font-bold border-b">
                  <tr>
                    <th className="py-2 px-2">#</th>
                    <th className="py-2 px-3 text-left">Team</th>
                    <th className="py-2 px-1.5">Sp</th>
                    <th className="py-2 px-1.5">S</th>
                    <th className="py-2 px-1.5">U</th>
                    <th className="py-2 px-1.5">N</th>
                    <th className="py-2 px-1.5">Tore</th>
                    <th className="py-2 px-1.5">Diff</th>
                    <th className="py-2 px-2 font-extrabold text-slate-900">Pkt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {standings.map((s, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-emerald-50/40 transition-colors ${
                        idx === 0 ? 'bg-amber-50/40 font-bold' : ''
                      }`}
                    >
                      <td className="py-2 px-2 text-slate-500">{idx + 1}.</td>
                      <td className="py-2 px-3 text-left font-bold text-slate-800">{s.team}</td>
                      <td className="py-2 px-1.5">{s.played}</td>
                      <td className="py-2 px-1.5 text-emerald-600 font-semibold">{s.wins}</td>
                      <td className="py-2 px-1.5 text-slate-500">{s.draws}</td>
                      <td className="py-2 px-1.5 text-rose-600">{s.losses}</td>
                      <td className="py-2 px-1.5">
                        {s.gf}:{s.ga}
                      </td>
                      <td className={`py-2 px-1.5 font-semibold ${s.gd > 0 ? 'text-emerald-600' : s.gd < 0 ? 'text-rose-600' : ''}`}>
                        {s.gd > 0 ? `+${s.gd}` : s.gd}
                      </td>
                      <td className="py-2 px-2 font-extrabold text-emerald-900 text-sm bg-emerald-50/50">
                        {s.pts}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Scorers List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <span>🎯 Top-Torschützen (Torjägerliste)</span>
            </h4>

            {topScorers.length === 0 ? (
              <div className="text-xs text-slate-400 text-center py-4">Noch keine Torschützen eingetragen.</div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {topScorers.map((scorer, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-800">{scorer.name}</span>
                    </div>
                    <span className="font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      {scorer.goals} {scorer.goals === 1 ? 'Tor' : 'Tore'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
