import React from 'react'

export default function StatDonutCard({ label, value, accent = 'text-primary-400', ring = 'stroke-primary-500' }) {
  const radius = 38
  const circumference = 2 * Math.PI * radius
  // Decorative 75% arc for a pleasant donut look
  const progress = 0.75
  const offset = circumference * (1 - progress)

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-sm shadow-slate-900/40">
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 flex-shrink-0">
          <svg viewBox="0 0 96 96" className="h-full w-full">
            <circle
              cx="48"
              cy="48"
              r={radius}
              className="stroke-slate-800"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              className={`${ring} transition-all duration-500`}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className={`text-3xl font-semibold ${accent}`}>{value}</span>
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
        </div>
      </div>
    </div>
  )
}
