import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, Clock, Calendar, ArrowLeft, Filter, User, Bot } from 'lucide-react'

const workLog = {
  // February 2026
  "Feb 25, 2026": [
    {
      task: "Added password protection to Goals Dashboard",
      project: "Goals Dashboard",
      time: "45 min",
      who: "AI",
      type: "feature",
      details: "Login screen with session storage, logout button"
    },
    {
      task: "Created Work Log page",
      project: "CineWorkflo",
      time: "30 min", 
      who: "AI",
      type: "feature",
      details: "Full task history page with filters"
    },
    {
      task: "Added Work Preview to homepage",
      project: "CineWorkflo",
      time: "20 min",
      who: "AI", 
      type: "feature",
      details: "Recent work glimpse section"
    }
  ],
  "Feb 24, 2026": [
    {
      task: "Built CineWorkflow MVP",
      project: "CineWorkflo",
      time: "6 hours",
      who: "AI",
      type: "build",
      details: "React + Vite + Tailwind, 6 components, Stripe integration"
    },
    {
      task: "Created 90 AI video prompts",
      project: "CineWorkflo",
      time: "2 hours",
      who: "AI",
      type: "content",
      details: "6 categories, 15 prompts each, multi-tool support"
    },
    {
      task: "Deployed to Netlify with custom domain",
      project: "CineWorkflo",
      time: "1 hour",
      who: "AI",
      type: "deploy",
      details: "cineworkflo.com live, DNS configured"
    },
    {
      task: "Set up GitHub repository",
      project: "CineWorkflo",
      time: "30 min",
      who: "AI",
      type: "setup",
      details: "Repo created, code pushed, auto-deploy configured"
    },
    {
      task: "Added Shot-to-Prompt feature",
      project: "CineWorkflo",
      time: "1 hour",
      who: "AI",
      type: "feature",
      details: "AI image analysis, prompt generation modal"
    },
    {
      task: "Created prompt modal viewer",
      project: "CineWorkflo",
      time: "45 min",
      who: "AI",
      type: "feature",
      details: "Click to view full prompt, copy functionality"
    },
    {
      task: "Fixed branding consistency",
      project: "CineWorkflo",
      time: "30 min",
      who: "AI",
      type: "fix",
      details: "CineWorkflow → CineWorkflo across all files"
    },
    {
      task: "Researched Higgsfield/CinemaStudio 2.0",
      project: "Research",
      time: "1 hour",
      who: "AI",
      type: "research",
      details: "Analyzed workflow, identified opportunities"
    },
    {
      task: "Updated MEMORY.md with history",
      project: "Documentation",
      time: "45 min",
      who: "AI",
      type: "docs",
      details: "Added 11 days of history, patterns, lessons"
    },
    {
      task: "Daily job emails",
      project: "Automation",
      time: "Auto",
      who: "AI",
      type: "cron",
      details: "London Creative Jobs + AI Video Jobs sent"
    }
  ],
  "Feb 23, 2026": [
    {
      task: "Fixed AgentMail 403 errors",
      project: "Automation",
      time: "30 min",
      who: "AI",
      type: "fix",
      details: "Endpoint correction, retry logic"
    },
    {
      task: "Re-enabled job search cron jobs",
      project: "Automation",
      time: "15 min",
      who: "AI",
      type: "setup",
      details: "Daily London + AI Video jobs scheduled"
    },
    {
      task: "Configured WordPress access",
      project: "Whitelabl",
      time: "20 min",
      who: "AI",
      type: "setup",
      details: "openclaw account created, credentials saved"
    }
  ],
  "Feb 21, 2026": [
    {
      task: "Documented AgentMail configuration",
      project: "Documentation",
      time: "20 min",
      who: "AI",
      type: "docs",
      details: "Correct endpoint, Python pattern, troubleshooting"
    }
  ]
}

const projectColors = {
  "CineWorkflo": "bg-blue-50 text-blue-700",
  "Goals Dashboard": "bg-purple-50 text-purple-700",
  "Whitelabl": "bg-green-50 text-green-700",
  "Automation": "bg-orange-50 text-orange-700",
  "Research": "bg-pink-50 text-pink-700",
  "Documentation": "bg-gray-50 text-gray-700"
}

const typeIcons = {
  build: "🚀",
  feature: "✨",
  fix: "🔧",
  content: "📝",
  deploy: "🌐",
  setup: "⚙️",
  research: "🔍",
  docs: "📚",
  cron: "⏰"
}

export default function WorkLog() {
  const [filter, setFilter] = useState('all')
  
  const dates = Object.keys(workLog).sort((a, b) => new Date(b) - new Date(a))
  
  const filteredLog = dates.reduce((acc, date) => {
    const tasks = workLog[date].filter(task => 
      filter === 'all' || task.who.toLowerCase() === filter
    )
    if (tasks.length > 0) {
      acc[date] = tasks
    }
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back</span>
              </Link>
              <h1 className="font-display text-2xl font-bold text-gray-900">
                Work Log
              </h1>
            </div>
            
            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="text-sm border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="all">All work</option>
                <option value="ai">By AI (me)</option>
                <option value="you">By you</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {Object.keys(filteredLog).length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No tasks match this filter
          </div>
        ) : (
          Object.entries(filteredLog).map(([date, tasks]) => (
            <div key={date} className="mb-8">
              {/* Date Header */}
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="h-5 w-5 text-gray-400" />
                <h2 className="font-semibold text-gray-900">{date}</h2>
                <span className="text-sm text-gray-500">
                  ({tasks.length} tasks)
                </span>
              </div>

              {/* Tasks */}
              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-xl p-5 border border-gray-200 hover:border-brand-200 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {task.task}
                            </h3>
                            {task.details && (
                              <p className="text-sm text-gray-600 mb-2">
                                {task.details}
                              </p>
                            )}
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                              <span className="inline-flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {task.time}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                {task.who === 'AI' ? (
                                  <Bot className="h-3.5 w-3.5" />
                                ) : (
                                  <User className="h-3.5 w-3.5" />
                                )}
                                {task.who}
                              </span>
                            </div>
                          </div>
                          
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${projectColors[task.project] || 'bg-gray-50 text-gray-700'}`}>
                            {task.project}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        {/* Load More / End */}
        <div className="text-center py-8 text-gray-500 border-t border-gray-200">
          <p>Showing work from last 7 days</p>
          <p className="text-sm mt-2">Older tasks available in daily notes</p>
        </div>
      </main>
    </div>
  )
}