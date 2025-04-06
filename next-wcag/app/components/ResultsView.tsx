interface ResultItem {
  id: string
  title: string
  friendlyTitle: string
  description: string
  severity: 'low' | 'medium' | 'high'
}

const AUDIT_TITLE_MAP: Record<string, string> = {
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
}

interface ResultsViewProps {
  results: ResultItem[]
  onNewAudit: () => void
}

export const ResultsView = ({ results, onNewAudit }: ResultsViewProps) => {
  // Filter to only show accessibility audits and map to friendly titles
  const filteredResults = results.map(item => ({
    ...item,
    friendlyTitle: AUDIT_TITLE_MAP[item.id] || item.id
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }))
  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-xl font-semibold">Accessibility Audit Results</h2>
      
      <div className="space-y-4">
        {filteredResults.map((item) => (
          <div key={item.id} className="p-4 border rounded-lg">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${
                item.severity === 'high' ? 'text-red-500' : 
                item.severity === 'medium' ? 'text-yellow-500' : 'text-green-500'
              }`}>
                {item.severity.toUpperCase()}
              </span>
              <h3 className="text-sm font-medium">{item.friendlyTitle}</h3>
            </div>
            <p className="text-sm text-zinc-500 mt-2">{item.description}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onNewAudit}
        className="w-full h-9 flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-white text-sm font-medium rounded-xl transition-colors mt-4"
      >
        Run New Audit
      </button>
    </div>
  )
}
