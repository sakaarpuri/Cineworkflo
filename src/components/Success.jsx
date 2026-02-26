import { useEffect } from 'react'
import { CheckCircle, Download, Mail, Sparkles } from 'lucide-react'
import { useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Success() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const plan = searchParams.get('plan') || 'yearly'
  const { user } = useAuth()

  useEffect(() => {
    // Update local storage to unlock Pro
    const usageData = JSON.parse(localStorage.getItem('promptEnhancerUsage') || '{}')
    usageData.isPro = true
    usageData.proType = plan
    const expiry = new Date()
    if (plan === 'monthly') {
      // Set expiry 30 days from now for monthly
      expiry.setMonth(expiry.getMonth() + 1)
      usageData.proExpiresAt = expiry.toISOString()
    } else if (plan === 'yearly') {
      // Set expiry 1 year from now for yearly
      expiry.setFullYear(expiry.getFullYear() + 1)
      usageData.proExpiresAt = expiry.toISOString()
    }
    localStorage.setItem('promptEnhancerUsage', JSON.stringify(usageData))

    console.log('Payment successful:', sessionId, plan)
  }, [sessionId, plan])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4 bg-purple-100 text-purple-700">
          <Sparkles className="h-4 w-4" />
          {plan === 'monthly' ? 'Pro Monthly Activated' : 'Pro Yearly Activated'}
        </div>
        <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">
          Welcome to Pro!
        </h1>
        <p className="text-gray-600 mb-8">
          {plan === 'monthly'
            ? 'Your subscription is active. You now have unlimited AI generations and access to all Pro features.'
            : 'Your payment was successful. You now have 1 year access to all 150+ prompts and the Shot-to-Prompt tool.'}
        </p>

        <div className="space-y-4">
          <a 
            href="/prompts"
            className="flex items-center justify-center gap-2 w-full bg-brand-600 text-white py-3 rounded-lg font-medium hover:bg-brand-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            Browse All Prompts
          </a>
          
          <a 
            href="/shot-to-prompt"
            className="flex items-center justify-center gap-2 w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Try Shot to Prompt
          </a>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Check your email for your receipt and access details.
          </p>
          <a 
            href="mailto:support@cineworkflo.com"
            className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 text-sm"
          >
            <Mail className="h-4 w-4" />
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}