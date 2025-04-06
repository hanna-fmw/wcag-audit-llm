'use client'
import { useState } from 'react'

export default function Home() {
  const [url, setUrl] = useState('')
      interface AuditItem {
    node?: {
      selector?: string
      snippet?: string
    }
    description?: string
  }

  interface LighthouseReport {
    categories?: {
      accessibility?: {
        score?: number
      }
    }
    audits?: {
      [key: string]: {
        score?: number
        details?: {
          items?: AuditItem[]
        }
      }
    }
  }

  const [report, setReport] = useState<LighthouseReport | null>(null)
  const [analysis, setAnalysis] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Run Lighthouse
      const res = await fetch('/api/lighthouse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })
      const reportData = await res.json()
      setReport(reportData)

      // Analyze results
      const analysisRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ report: reportData }),
      })
      const analysisData = await analysisRes.json()
      setAnalysis(analysisData)

    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">WCAG Accessibility Analyzer</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL"
          className="border p-2 mr-2"
          required
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white p-2"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>

      {report && analysis && (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Accessibility Score: {report.categories?.accessibility?.score ? Math.round(report.categories.accessibility.score * 100) : 'N/A'}
            </h2>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Recommendations</h2>
            <div className="whitespace-pre-wrap bg-gray-100 p-4">
              {analysis}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
