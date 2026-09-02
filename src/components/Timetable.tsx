import React, { useState } from 'react';
import { TIMETABLE_DATA } from '../data/schoolData';
import { Calendar, Clock, MapPin, User, ChevronRight } from 'lucide-react';

export const Timetable: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>('Alle');
  const days = ['Alle', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];

  const filteredSlots =
    selectedDay === 'Alle'
      ? TIMETABLE_DATA
      : TIMETABLE_DATA.filter((s) => s.day === selectedDay);

  const getSubjectBadgeColor = (subject: string) => {
    if (subject.includes('Mathematik')) return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    if (subject.includes('Deutsch')) return 'bg-amber-100 text-amber-800 border-amber-200';
    if (subject.includes('Englisch')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (subject.includes('Italienisch')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (subject.includes('Biologie') || subject.includes('Natwi')) return 'bg-teal-100 text-teal-800 border-teal-200';
    if (subject.includes('Geografie')) return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    if (subject.includes('Geschichte')) return 'bg-rose-100 text-rose-800 border-rose-200';
    if (subject.includes('Musik')) return 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200';
    if (subject.includes('Religion')) return 'bg-purple-100 text-purple-800 border-purple-200';
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  return (
    <div className="space-y-6">
      {/* Header info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-slate-800">Wochen-Stundenplan</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Unterrichtszeiten der Klasse (Quelle: 00_Organisation/Tabellen/Stundenplan-Schule.xlsx)
          </p>
        </div>

        {/* Day selection */}
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1.5 rounded-xl">
          {days.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedDay === d
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Grid or table of schedule */}
      {selectedDay === 'Alle' ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'].map((day) => {
            const daySlots = TIMETABLE_DATA.filter((s) => s.day === day);
            return (
              <div key={day} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="bg-slate-900 text-white font-bold p-3 text-center text-sm">
                  {day}
                </div>
                <div className="p-3 space-y-2.5">
                  {daySlots.map((slot, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border transition-all ${getSubjectBadgeColor(slot.subject)}`}
                    >
                      <div className="flex justify-between items-center text-xs font-semibold opacity-75">
                        <span>{slot.period}. Stunde</span>
                        <span>{slot.time.split(' - ')[0]}</span>
                      </div>
                      <div className="font-bold text-sm mt-1">{slot.subject}</div>
                      <div className="flex items-center justify-between text-xs mt-2 opacity-90">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {slot.room}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {slot.teacher}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 max-w-2xl mx-auto space-y-3">
          <h3 className="font-bold text-lg text-slate-800 border-b pb-2">{selectedDay} Übersicht</h3>
          {filteredSlots.map((slot, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex items-center justify-between ${getSubjectBadgeColor(slot.subject)}`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold opacity-75">
                  <Clock className="w-3.5 h-3.5" />
                  {slot.period}. Stunde ({slot.time})
                </div>
                <div className="text-base font-extrabold">{slot.subject}</div>
              </div>
              <div className="text-right text-xs space-y-1 font-medium">
                <div className="flex items-center justify-end gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Raum {slot.room}
                </div>
                <div className="flex items-center justify-end gap-1">
                  <User className="w-3.5 h-3.5" /> {slot.teacher}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
