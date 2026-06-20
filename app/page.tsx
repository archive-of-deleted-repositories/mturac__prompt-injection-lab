"use client";

import { useState } from "react";
import { generateLabReport, SCENARIOS, simulateAttack } from "@/lib/scenarios";

export default function Home() {
  const [active, setActive] = useState(SCENARIOS[0]);
  const [running, setRunning] = useState(false);
  const [trace, setTrace] = useState<string[]>([]);

  const run = () => {
    setRunning(true);
    setTrace([]);
    let i = 0;
    const result = simulateAttack(active);
    const interval = setInterval(() => {
      if (i < result.trace.length) {
        setTrace((t) => [...t, result.trace[i++]]);
      } else {
        clearInterval(interval);
        setRunning(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0d0618] text-slate-200">
      <header className="border-b border-purple-900/50 bg-purple-950/30">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <h1 className="text-2xl font-bold text-purple-200">prompt-injection-lab</h1>
          <p className="text-purple-500/80 text-sm">Live attack demos for agent security training</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => { setActive(s); setTrace([]); }}
              className={`w-full text-left p-4 rounded-xl border transition ${active.id === s.id ? "border-purple-500 bg-purple-500/10" : "border-purple-900/30 hover:border-purple-700"}`}
            >
              <div className="font-medium text-sm">{s.name}</div>
              <div className="text-xs text-purple-600 mt-1">{s.vector}</div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-2xl border border-red-500/30 bg-red-950/20">
            <div className="text-xs text-red-400 uppercase mb-2">Payload</div>
            <pre className="font-mono text-sm text-red-200/90 whitespace-pre-wrap">{active.payload}</pre>
          </div>

          <button onClick={run} disabled={running} className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 font-semibold transition">
            {running ? "Simulating..." : "Run Attack Simulation"}
          </button>

          <div className="p-4 rounded-xl border border-purple-900/40 bg-black/30 font-mono text-sm min-h-[200px]">
            {trace.map((t, i) => (
              <div key={i} className={`py-1 ${t.includes("succeeded") ? "text-red-400" : t.includes("Root") ? "text-amber-400" : "text-slate-400"}`}>
                {">"} {t}
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <ListBox title="Root Causes" items={active.rootCauses} color="red" />
            <ListBox title="Mitigations" items={active.mitigations} color="green" />
          </div>

          <button onClick={() => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([generateLabReport(active)])); a.download = "lab-report.md"; a.click(); }} className="text-sm text-purple-400 hover:underline">
            Export lab report
          </button>
        </div>
      </main>
    </div>
  );
}

function ListBox({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <div className={`p-4 rounded-xl border ${color === "red" ? "border-red-900/40" : "border-green-900/40"}`}>
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      {items.map((i) => <div key={i} className="text-xs py-1 text-slate-400">• {i}</div>)}
    </div>
  );
}