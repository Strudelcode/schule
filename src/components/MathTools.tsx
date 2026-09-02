import React, { useState } from 'react';
import { Calculator, Sparkles, ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const MathTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'brueche' | 'ggt_kgv' | 'geometrie' | 'prozent'>('brueche');

  // Fractions state
  const [num1, setNum1] = useState<number>(3);
  const [den1, setDen1] = useState<number>(4);
  const [op, setOp] = useState<'+' | '-' | '*' | '/'>('+');
  const [num2, setNum2] = useState<number>(2);
  const [den2, setDen2] = useState<number>(5);

  // ggT / kgV state
  const [valA, setValA] = useState<number>(24);
  const [valB, setValB] = useState<number>(36);

  // Geometry state
  const [shape, setShape] = useState<'rect' | 'triangle' | 'circle' | 'trapez'>('rect');
  const [dimA, setDimA] = useState<number>(6);
  const [dimB, setDimB] = useState<number>(4);
  const [dimH, setDimH] = useState<number>(5);

  // Percentage state
  const [pGrundwert, setPGrundwert] = useState<number>(250);
  const [pProzentsatz, setPProzentsatz] = useState<number>(15);

  // Helper gcd
  const gcd = (a: number, b: number): number => {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  };

  // Helper lcm
  const lcm = (a: number, b: number): number => {
    if (a === 0 || b === 0) return 0;
    return Math.abs(Math.round(a * b)) / gcd(a, b);
  };

  // Prime factorization helper
  const getPrimeFactors = (n: number): number[] => {
    n = Math.abs(Math.round(n));
    const factors: number[] = [];
    let divisor = 2;
    while (n >= 2) {
      if (n % divisor === 0) {
        factors.push(divisor);
        n = n / divisor;
      } else {
        divisor++;
      }
    }
    return factors;
  };

  // Calculate fractions
  const calculateFraction = () => {
    const d1 = den1 === 0 ? 1 : den1;
    const d2 = den2 === 0 ? 1 : den2;
    let resNum = 0;
    let resDen = 1;
    let steps: string[] = [];

    if (op === '+') {
      const commonDen = lcm(d1, d2);
      const mult1 = commonDen / d1;
      const mult2 = commonDen / d2;
      const expNum1 = num1 * mult1;
      const expNum2 = num2 * mult2;
      resNum = expNum1 + expNum2;
      resDen = commonDen;
      steps = [
        `1. Hauptnenner von ${d1} und ${d2} bestimmen: kgV(${d1}, ${d2}) = ${commonDen}`,
        `2. Brüche erweitern: ${num1}/${d1} = ${expNum1}/${commonDen} und ${num2}/${d2} = ${expNum2}/${commonDen}`,
        `3. Zähler addieren: ${expNum1} + ${expNum2} = ${resNum}`,
        `4. Zwischenergebnis: ${resNum}/${resDen}`,
      ];
    } else if (op === '-') {
      const commonDen = lcm(d1, d2);
      const mult1 = commonDen / d1;
      const mult2 = commonDen / d2;
      const expNum1 = num1 * mult1;
      const expNum2 = num2 * mult2;
      resNum = expNum1 - expNum2;
      resDen = commonDen;
      steps = [
        `1. Hauptnenner von ${d1} und ${d2} bestimmen: kgV(${d1}, ${d2}) = ${commonDen}`,
        `2. Brüche erweitern: ${num1}/${d1} = ${expNum1}/${commonDen} und ${num2}/${d2} = ${expNum2}/${commonDen}`,
        `3. Zähler subtrahieren: ${expNum1} - ${expNum2} = ${resNum}`,
        `4. Zwischenergebnis: ${resNum}/${resDen}`,
      ];
    } else if (op === '*') {
      resNum = num1 * num2;
      resDen = d1 * d2;
      steps = [
        `1. Regel: „Zähler mal Zähler, Nenner mal Nenner“`,
        `2. Zähler: ${num1} · ${num2} = ${resNum}`,
        `3. Nenner: ${d1} · ${d2} = ${resDen}`,
        `4. Zwischenergebnis: ${resNum}/${resDen}`,
      ];
    } else if (op === '/') {
      resNum = num1 * d2;
      resDen = d1 * num2;
      steps = [
        `1. Regel: „Mit dem Kehrwert multiplizieren“: ${num2}/${d2} wird zu ${d2}/${num2}`,
        `2. Zähler: ${num1} · ${d2} = ${resNum}`,
        `3. Nenner: ${d1} · ${num2} = ${resDen}`,
        `4. Zwischenergebnis: ${resNum}/${resDen}`,
      ];
    }

    const divisor = gcd(resNum, resDen);
    const finalNum = resNum / divisor;
    const finalDen = resDen / divisor;
    const isMixed = Math.abs(finalNum) >= finalDen && finalDen !== 1;
    const whole = isMixed ? Math.floor(Math.abs(finalNum) / finalDen) * (finalNum < 0 ? -1 : 1) : 0;
    const remNum = isMixed ? Math.abs(finalNum) % finalDen : 0;

    return {
      rawNum: resNum,
      rawDen: resDen,
      finalNum,
      finalDen,
      divisor,
      isMixed,
      whole,
      remNum,
      steps,
      decimal: (finalNum / finalDen).toFixed(4).replace(/\.?0+$/, ''),
    };
  };

  const fractionResult = calculateFraction();
  const primeA = getPrimeFactors(valA);
  const primeB = getPrimeFactors(valB);
  const curGcd = gcd(valA, valB);
  const curLcm = lcm(valA, valB);

  return (
    <div className="space-y-6">
      {/* Sub-tab navigation */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-200/70 rounded-xl max-w-xl">
        <button
          onClick={() => setActiveTab('brueche')}
          className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
            activeTab === 'brueche'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ➕ Bruchrechner
        </button>
        <button
          onClick={() => setActiveTab('ggt_kgv')}
          className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
            activeTab === 'ggt_kgv'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🔢 ggT & kgV
        </button>
        <button
          onClick={() => setActiveTab('geometrie')}
          className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
            activeTab === 'geometrie'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📐 Geometrie
        </button>
        <button
          onClick={() => setActiveTab('prozent')}
          className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
            activeTab === 'prozent'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          % Prozent
        </button>
      </div>

      {/* 1. BRUCHRECHNER */}
      {activeTab === 'brueche' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-indigo-600" />
                Interaktiver Bruchrechner
              </h3>
              <button
                onClick={() => {
                  setNum1(Math.floor(Math.random() * 8) + 1);
                  setDen1(Math.floor(Math.random() * 8) + 2);
                  setNum2(Math.floor(Math.random() * 8) + 1);
                  setDen2(Math.floor(Math.random() * 8) + 2);
                }}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 px-2.5 py-1.5 rounded-lg border border-indigo-100"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Zufallsaufgabe
              </button>
            </div>

            {/* Fraction input formula */}
            <div className="flex items-center justify-center gap-4 py-4 bg-slate-50/80 rounded-xl border border-slate-200/80">
              {/* Fraction 1 */}
              <div className="flex flex-col items-center w-20">
                <input
                  type="number"
                  value={num1}
                  onChange={(e) => setNum1(parseInt(e.target.value) || 0)}
                  className="w-16 text-center text-lg font-bold py-1.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="w-16 h-0.5 bg-slate-800 my-1.5 rounded-full" />
                <input
                  type="number"
                  value={den1}
                  onChange={(e) => setDen1(parseInt(e.target.value) || 1)}
                  className="w-16 text-center text-lg font-bold py-1.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Operator */}
              <select
                value={op}
                onChange={(e) => setOp(e.target.value as '+' | '-' | '*' | '/')}
                className="text-2xl font-bold p-2 border border-slate-300 rounded-xl bg-white text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="+">+</option>
                <option value="-">−</option>
                <option value="*">×</option>
                <option value="/">÷</option>
              </select>

              {/* Fraction 2 */}
              <div className="flex flex-col items-center w-20">
                <input
                  type="number"
                  value={num2}
                  onChange={(e) => setNum2(parseInt(e.target.value) || 0)}
                  className="w-16 text-center text-lg font-bold py-1.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="w-16 h-0.5 bg-slate-800 my-1.5 rounded-full" />
                <input
                  type="number"
                  value={den2}
                  onChange={(e) => setDen2(parseInt(e.target.value) || 1)}
                  className="w-16 text-center text-lg font-bold py-1.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="text-2xl font-bold text-slate-400">=</div>

              {/* Result display */}
              <div className="flex flex-col items-center min-w-[4rem] px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900 font-extrabold">
                <span className="text-xl">{fractionResult.finalNum}</span>
                {fractionResult.finalDen !== 1 && (
                  <>
                    <div className="w-full h-0.5 bg-indigo-800 my-1 rounded-full" />
                    <span className="text-xl">{fractionResult.finalDen}</span>
                  </>
                )}
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setNum1(1);
                  setDen1(2);
                  setNum2(1);
                  setDen2(4);
                  setOp('+');
                }}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium"
              >
                1/2 + 1/4
              </button>
              <button
                onClick={() => {
                  setNum1(3);
                  setDen1(5);
                  setNum2(2);
                  setDen2(3);
                  setOp('*');
                }}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium"
              >
                3/5 × 2/3
              </button>
              <button
                onClick={() => {
                  setNum1(5);
                  setDen1(6);
                  setNum2(1);
                  setDen2(3);
                  setOp('-');
                }}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium"
              >
                5/6 − 1/3
              </button>
            </div>
          </div>

          {/* Right: Step by step solution */}
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Schritt-für-Schritt Erklärung
            </h4>

            <div className="space-y-2.5 text-sm text-slate-700">
              {fractionResult.steps.map((step, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 font-mono text-xs md:text-sm">
                  {step}
                </div>
              ))}

              {fractionResult.divisor > 1 && (
                <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 font-semibold text-xs md:text-sm">
                  ✓ Gekürzt mit {fractionResult.divisor}: {fractionResult.rawNum}/{fractionResult.rawDen} ={' '}
                  <span className="underline font-bold">
                    {fractionResult.finalNum}/{fractionResult.finalDen}
                  </span>
                </div>
              )}

              {fractionResult.isMixed && (
                <div className="p-2.5 bg-indigo-50 rounded-lg border border-indigo-200 text-indigo-900 font-medium text-xs md:text-sm">
                  📌 Als gemischte Zahl:{' '}
                  <span className="font-bold">
                    {fractionResult.whole} {fractionResult.remNum}/{fractionResult.finalDen}
                  </span>
                </div>
              )}

              <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs md:text-sm">
                💡 Dezimalwert: <span className="font-bold font-mono">{fractionResult.decimal}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ggT & kgV */}
      {activeTab === 'ggt_kgv' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-600" />
              Zahlen eingeben
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Zahl A</label>
                <input
                  type="number"
                  min="1"
                  max="99999"
                  value={valA}
                  onChange={(e) => setValA(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-xl font-bold p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Zahl B</label>
                <input
                  type="number"
                  min="1"
                  max="99999"
                  value={valB}
                  onChange={(e) => setValB(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-xl font-bold p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setValA(48);
                  setValB(72);
                }}
                className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-semibold text-slate-700"
              >
                48 & 72
              </button>
              <button
                onClick={() => {
                  setValA(18);
                  setValB(30);
                }}
                className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-semibold text-slate-700"
              >
                18 & 30
              </button>
              <button
                onClick={() => {
                  setValA(105);
                  setValB(140);
                }}
                className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-semibold text-slate-700"
              >
                105 & 140
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-center">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">ggT({valA}, {valB})</span>
                <div className="text-3xl font-extrabold text-indigo-950 mt-1">{curGcd}</div>
                <div className="text-xs text-indigo-700 mt-1">Größter gemeinsamer Teiler</div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">kgV({valA}, {valB})</span>
                <div className="text-3xl font-extrabold text-emerald-950 mt-1">{curLcm}</div>
                <div className="text-xs text-emerald-700 mt-1">Kleinstes gemeinsames Vielfaches</div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm">
                <div className="font-semibold text-slate-800">Primfaktorzerlegung:</div>
                <div className="font-mono text-slate-700 mt-1">
                  • <strong>{valA}</strong> = {primeA.join(' · ') || valA}
                </div>
                <div className="font-mono text-slate-700">
                  • <strong>{valB}</strong> = {primeB.join(' · ') || valB}
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                <strong>💡 Mathematische Probe:</strong> {valA} · {valB} = {valA * valB} = ggT ({curGcd}) · kgV ({curLcm}) = {curGcd * curLcm} ✓
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. GEOMETRIE */}
      {activeTab === 'geometrie' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Figur wählen</h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShape('rect')}
                className={`p-3 rounded-xl border font-semibold text-sm text-left transition-all ${
                  shape === 'rect' ? 'bg-indigo-50 border-indigo-400 text-indigo-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                ⬛ Rechteck / Quadrat
              </button>
              <button
                onClick={() => setShape('triangle')}
                className={`p-3 rounded-xl border font-semibold text-sm text-left transition-all ${
                  shape === 'triangle' ? 'bg-indigo-50 border-indigo-400 text-indigo-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                ▲ Dreieck
              </button>
              <button
                onClick={() => setShape('circle')}
                className={`p-3 rounded-xl border font-semibold text-sm text-left transition-all ${
                  shape === 'circle' ? 'bg-indigo-50 border-indigo-400 text-indigo-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                ⚪ Kreis
              </button>
              <button
                onClick={() => setShape('trapez')}
                className={`p-3 rounded-xl border font-semibold text-sm text-left transition-all ${
                  shape === 'trapez' ? 'bg-indigo-50 border-indigo-400 text-indigo-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                ⏢ Trapez
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {shape === 'rect' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Länge a (cm)</label>
                    <input
                      type="number"
                      value={dimA}
                      onChange={(e) => setDimA(parseFloat(e.target.value) || 0)}
                      className="w-full p-2.5 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Breite b (cm)</label>
                    <input
                      type="number"
                      value={dimB}
                      onChange={(e) => setDimB(parseFloat(e.target.value) || 0)}
                      className="w-full p-2.5 border rounded-lg"
                    />
                  </div>
                </>
              )}

              {shape === 'triangle' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Grundseite g (cm)</label>
                    <input
                      type="number"
                      value={dimA}
                      onChange={(e) => setDimA(parseFloat(e.target.value) || 0)}
                      className="w-full p-2.5 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Höhe h (cm)</label>
                    <input
                      type="number"
                      value={dimH}
                      onChange={(e) => setDimH(parseFloat(e.target.value) || 0)}
                      className="w-full p-2.5 border rounded-lg"
                    />
                  </div>
                </>
              )}

              {shape === 'circle' && (
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Radius r (cm)</label>
                  <input
                    type="number"
                    value={dimA}
                    onChange={(e) => setDimA(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 border rounded-lg"
                  />
                </div>
              )}

              {shape === 'trapez' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Seite a (cm)</label>
                      <input
                        type="number"
                        value={dimA}
                        onChange={(e) => setDimA(parseFloat(e.target.value) || 0)}
                        className="w-full p-2.5 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Seite c (cm)</label>
                      <input
                        type="number"
                        value={dimB}
                        onChange={(e) => setDimB(parseFloat(e.target.value) || 0)}
                        className="w-full p-2.5 border rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Höhe h (cm)</label>
                    <input
                      type="number"
                      value={dimH}
                      onChange={(e) => setDimH(parseFloat(e.target.value) || 0)}
                      className="w-full p-2.5 border rounded-lg"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="font-bold text-slate-800 text-lg">Berechnete Werte</h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-center">
                <div className="text-xs font-bold text-indigo-700 uppercase">Flächeninhalt (A)</div>
                <div className="text-2xl font-extrabold text-indigo-950 mt-1">
                  {shape === 'rect' && `${(dimA * dimB).toFixed(2)} cm²`}
                  {shape === 'triangle' && `${((dimA * dimH) / 2).toFixed(2)} cm²`}
                  {shape === 'circle' && `${(Math.PI * dimA * dimA).toFixed(2)} cm²`}
                  {shape === 'trapez' && `${(((dimA + dimB) * dimH) / 2).toFixed(2)} cm²`}
                </div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <div className="text-xs font-bold text-emerald-700 uppercase">Umfang (U)</div>
                <div className="text-2xl font-extrabold text-emerald-950 mt-1">
                  {shape === 'rect' && `${(2 * (dimA + dimB)).toFixed(2)} cm`}
                  {shape === 'circle' && `${(2 * Math.PI * dimA).toFixed(2)} cm`}
                  {shape === 'triangle' && `U = a + b + c`}
                  {shape === 'trapez' && `U = a + b + c + d`}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border text-sm text-slate-700 space-y-1">
              <div className="font-bold text-slate-800">Verwendete Formel:</div>
              {shape === 'rect' && <div>• Fläche: A = a · b = {dimA} · {dimB} = {dimA * dimB} cm²<br />• Umfang: U = 2·(a + b) = 2·({dimA} + {dimB}) = {2 * (dimA + dimB)} cm</div>}
              {shape === 'triangle' && <div>• Fläche: A = (g · h) / 2 = ({dimA} · {dimH}) / 2 = {((dimA * dimH) / 2).toFixed(2)} cm²</div>}
              {shape === 'circle' && <div>• Fläche: A = π · r² = π · {dimA}² ≈ {(Math.PI * dimA * dimA).toFixed(2)} cm²<br />• Umfang: U = 2 · π · r = 2 · π · {dimA} ≈ {(2 * Math.PI * dimA).toFixed(2)} cm</div>}
              {shape === 'trapez' && <div>• Fläche: A = ((a + c) · h) / 2 = (({dimA} + {dimB}) · {dimH}) / 2 = {(((dimA + dimB) * dimH) / 2).toFixed(2)} cm²</div>}
            </div>
          </div>
        </div>
      )}

      {/* 4. PROZENTRECHNUNG */}
      {activeTab === 'prozent' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-2xl space-y-5">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Dreisatz & Prozentrechner
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Grundwert G (€ oder Stück)</label>
              <input
                type="number"
                value={pGrundwert}
                onChange={(e) => setPGrundwert(parseFloat(e.target.value) || 0)}
                className="w-full p-3 border rounded-xl text-lg font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Prozentsatz p (%)</label>
              <input
                type="number"
                value={pProzentsatz}
                onChange={(e) => setPProzentsatz(parseFloat(e.target.value) || 0)}
                className="w-full p-3 border rounded-xl text-lg font-bold"
              />
            </div>
          </div>

          <div className="p-5 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2">
            <div className="text-xs font-bold text-indigo-800 uppercase">Berechneter Prozentwert (W):</div>
            <div className="text-3xl font-extrabold text-indigo-950">
              {((pGrundwert * pProzentsatz) / 100).toFixed(2)}
            </div>
            <div className="text-xs text-indigo-700">
              Formel: W = (G · p) / 100 = ({pGrundwert} · {pProzentsatz}) / 100
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
