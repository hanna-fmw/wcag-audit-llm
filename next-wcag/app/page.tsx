'use client'
import { useState } from 'react'
import { FormAudit } from './components/FormAudit'
import { LoadingScreen } from './components/LoadingScreen'
import { ResultsView } from './components/ResultsView'

export default function Home() {
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

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">WCAG Accessibility Analyzer</h1>
      
      {loading ? (
        <LoadingScreen />
      ) : report && analysis ? (
        <ResultsView 
          results={Object.entries(report.audits || {})
            .filter(([, audit]) => audit.score !== 1)
            .map(([id, audit]) => {
              const friendlyTitle = {
                'color-contrast': 'Color Contrast',
                'image-alt': 'Image Alt Text',
                'label': 'Form Labels',
                'link-name': 'Link Descriptions',
                'select-name': 'Select Element Labels',
                'skip-link': 'Skip Links',
                'aria-allowed-attr': 'ARIA Attributes',
                'aria-required-attr': 'Required ARIA',
                'aria-valid-attr-value': 'Valid ARIA Values',
                'aria-valid-attr': 'Valid ARIA Attributes',
                'button-name': 'Button Labels',
                'document-title': 'Page Title',
                'duplicate-id': 'Duplicate IDs',
                'heading-order': 'Heading Hierarchy',
                'html-has-lang': 'Language Attribute',
                'input-image-alt': 'Image Input Alt Text',
                'meta-viewport': 'Viewport Meta Tag'
              }[id] || id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

              return {
                id,
                title: id,
                friendlyTitle,
                description: audit.details?.items?.[0]?.description || '',
                severity: audit.score && audit.score < 0.5 ? 'high' : 
                         audit.score && audit.score < 0.8 ? 'medium' : 'low'
              }
            })}
          onNewAudit={() => {
            setReport(null)
            setAnalysis('')
          }}
        />
      ) : (
        <FormAudit 
          onSubmit={(url) => {
            setLoading(true)
            fetch('/api/lighthouse', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ url }),
            })
            .then(res => res.json())
            .then(data => {
              setReport(data)
              // Chain analysis request
              return fetch('/api/analyze', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ report: data }),
              })
            })
            .then(res => res.json())
            .then(analysisData => {
              setAnalysis(analysisData)
              setLoading(false)
            })
            .catch(err => {
              console.error(err)
              setLoading(false)
            })
          }}
          isLoading={loading} 
        />
      )}

      {/* Keep existing report display as fallback */}
      {report && analysis && !loading && (
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
