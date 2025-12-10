import React from 'react'

export default function StatDonutCard({ label, value, accent = 'text-primary-400', ring = 'stroke-primary-500' }) {
  const radius = 38
  const circumference = 2 * Math.PI * radius
  // Decorative 75% arc for a pleasant donut look
  const progress = 0.75
  const offset = circumference * (1 - progress)

  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/70 p-4">
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle
          cx="40"
          cy="40"
          r="30"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-slate-200 dark:text-slate-800"
        />
        <circle
          cx="40"
          cy="40"
          r="30"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary-600 dark:text-primary-500"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
        <text
          x="40"
          y="40"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-slate-900 dark:fill-slate-100 text-xl font-bold"
        >
          {value}
        </text>
      </svg>
      <div>
        <div className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-400">{label}</div>
      </div>
    </div>
  )
}
