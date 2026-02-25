import { useState } from 'react'
import { CheckCircle, Clock, Calendar, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const recentWork = [
  {
    id: 1,
    task: "Built CineWorkflow MVP",
    project: "CineWorkflo",
    time: "6 hours",
    date: "Feb 24",
    type: "build",
    status: "completed"
  },
  {
    id: 2,
    task: "Created 90 AI video prompts",
    project: "CineWorkflo", 
    time: "2 hours",
    date: "Feb 24",
    type: "content",
    status: "completed"
  },
  {
    id: 3,
    task: "Deployed to Netlify + custom domain",
    project: "CineWorkflo",
    time: "1 hour",
    date: "Feb 24",
    type: "deploy",
    status: "completed"
  },
  {
    id: 4,
    task: "Added password-protected dashboard",
    project: "Goals Dashboard",
    time: "45 min",
    date: "Feb 25",
    type: "feature",
    status: "completed"
  },
  {
    id: 5,
    task: "Research Higgsfield/CinemaStudio",
    project: "Research",
    time: "1 hour",
    date: "Feb 24",
    type: "research",
    status: "completed"
  }
]

export default function WorkPreview() {
  const [showAll, setShowAll] = useState(false)
  const displayedWork = showAll ? recentWork : recentWork.slice(0, 3)

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">
              Recent Work
            </h2>
            <p className="text-gray-600">
              What I've been building for you
            </p>
          </div>
          <Link 
            to="/work-log"
            className="hidden sm:flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium"
          >
            View full log
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Work Cards */}
        <div className="space-y-4">
          {displayedWork.map((item) => (
            <div 
              key={item.id}
              className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-brand-200 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.task}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {item.time}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {item.date}
                        </span>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-700">
                      {item.project}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Link */}
        <div className="mt-6 sm:hidden">
          <Link 
            to="/work-log"
            className="flex items-center justify-center gap-2 w-full py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
          >
            View full work log
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}