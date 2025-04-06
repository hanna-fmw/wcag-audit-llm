import { MessageCircle, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface FormProps {
	onSubmit: (url: string) => void
	isLoading: boolean
}

export const FormAudit = ({ onSubmit, isLoading }: FormProps) => {
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		const formData = new FormData(e.currentTarget as HTMLFormElement)
		const url = formData.get('url') as string
		onSubmit(url)
	}

	return (
		<main className='mx-auto flex items-center justify-center p-4 mt-20'>
			<Card className='w-full max-w-md shadow-lg min-h-[40vh] flex flex-col justify-between'>
				<CardHeader>
					<CardTitle className='text-2xl font-bold text-center'>WCAG Accessibility Audit</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
						<div className='space-y-2'>
							<div className='flex items-center gap-2'>
								<MessageCircle className='w-5 h-5 text-zinc-500 dark:text-zinc-400' />
								<span className='text-sm text-zinc-500 dark:text-zinc-400'>Website URL</span>
							</div>
							<Input
								name='url'
								type='url'
								size={16}
								placeholder='Example: https://www.example.com'
								className='w-full bg-zinc-50 dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 rounded-lg border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent'
							/>
						</div>

						<button
							type='submit'
							disabled={isLoading}
							className='w-full h-10 flex items-center justify-center gap-2 bg-black hover:bg-neutral-900 dark:bg-black dark:hover:bg-neutral-900 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer shadow-sm hover:shadow-md mt-4'>
							<Sparkles className='w-4 h-4' />
							{isLoading ? 'Auditing...' : 'Run Accessibility Audit'}
						</button>
					</form>
				</CardContent>
			</Card>
		</main>
	)
}
