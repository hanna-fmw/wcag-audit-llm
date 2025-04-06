import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'

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
	label: 'Form Labels',
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
	'meta-viewport': 'Viewport Meta Tag',
}

interface ResultsViewProps {
	results: ResultItem[]
	onNewAudit: () => void
}

export const ResultsView = ({ results, onNewAudit }: ResultsViewProps) => {
	const filteredResults = results.map((item) => ({
		...item,
		friendlyTitle:
			AUDIT_TITLE_MAP[item.id] ||
			item.id
				.split('-')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' '),
	}))

	const highPriority = filteredResults.filter((item) => item.severity === 'high')
	const mediumPriority = filteredResults.filter((item) => item.severity === 'medium')
	const lowPriority = filteredResults.filter((item) => item.severity === 'low')

	const totalIssues = results.length
	const score =
		totalIssues === 0
			? 100
			: Math.max(
					0,
					100 - (highPriority.length * 10 + mediumPriority.length * 5 + lowPriority.length * 2)
			  )
	const scoreColor =
		highPriority.length > 0
			? 'bg-red-500'
			: mediumPriority.length > 0
			? 'bg-yellow-500'
			: 'bg-green-500'

	return (
		<div className='min-h-[400px] flex flex-col items-center justify-center p-4 gap-8'>
			<div className='flex flex-col items-center gap-4'>
				<h1 className='text-2xl font-bold text-center'>Accessibility Audit Results</h1>
				<div className={`w-32 h-32 rounded-full ${scoreColor} flex items-center justify-center text-white text-4xl font-bold shadow-lg`}>
					{score}%
				</div>
				<button
					onClick={onNewAudit}
					className='h-10 px-6 flex items-center justify-center gap-2 bg-black hover:bg-neutral-900 dark:bg-black dark:hover:bg-neutral-900 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer shadow-sm hover:shadow-md'>
					Run New Audit
				</button>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl'>
				<Accordion type='single' collapsible className='w-full'>
					<AccordionItem value='high'>
						<AccordionTrigger className='text-red-500 hover:no-underline -mr-2'>
							High Priority ({highPriority.length})
						</AccordionTrigger>
						<AccordionContent>
							<div className='space-y-4'>
								{highPriority.map((item) => (
									<div key={item.id} className='p-4 border rounded-lg'>
										<h3 className='text-sm font-medium'>{item.friendlyTitle}</h3>
										<p className='text-sm text-zinc-500 mt-2'>{item.description}</p>
									</div>
								))}
								{highPriority.length === 0 && (
									<p className='text-sm text-zinc-500'>No high priority issues found</p>
								)}
							</div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>

				<Accordion type='single' collapsible className='w-full'>
					<AccordionItem value='medium'>
						<AccordionTrigger className='text-yellow-500 hover:no-underline -mr-2'>
							Medium Priority ({mediumPriority.length})
						</AccordionTrigger>
						<AccordionContent>
							<div className='space-y-4'>
								{mediumPriority.map((item) => (
									<div key={item.id} className='p-4 border rounded-lg'>
										<h3 className='text-sm font-medium'>{item.friendlyTitle}</h3>
										<p className='text-sm text-zinc-500 mt-2'>{item.description}</p>
									</div>
								))}
								{mediumPriority.length === 0 && (
									<p className='text-sm text-zinc-500'>No medium priority issues found</p>
								)}
							</div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>

				<Accordion type='single' collapsible className='w-full'>
					<AccordionItem value='low'>
						<AccordionTrigger className='text-green-500 hover:no-underline -mr-2'>
							Low Priority ({lowPriority.length})
						</AccordionTrigger>
						<AccordionContent>
							<div className='space-y-4'>
								{lowPriority.map((item) => (
									<div key={item.id} className='p-4 border rounded-lg'>
										<h3 className='text-sm font-medium'>{item.friendlyTitle}</h3>
										<p className='text-sm text-zinc-500 mt-2'>{item.description}</p>
									</div>
								))}
								{lowPriority.length === 0 && (
									<p className='text-sm text-zinc-500'>No low priority issues found</p>
								)}
							</div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</div>
	)
}
