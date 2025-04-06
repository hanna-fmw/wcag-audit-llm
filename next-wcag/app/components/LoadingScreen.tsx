'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export const LoadingScreen = () => {
	const availableTexts = [
		'Running accessibility audit...',
		'Checking color contrast...',
		'Verifying keyboard navigation...',
		'Analyzing semantic structure...',
	]
	const [currentTextIndex, setCurrentTextIndex] = useState(0)
	const [progress, setProgress] = useState(0)

	useEffect(() => {
		const interval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 100) {
					return 100
				}
				return prev + 1
			})
		}, 30)

		return () => clearInterval(interval)
	}, [])

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTextIndex((prev) => (prev + 1) % availableTexts.length)
		}, 2000)

		return () => clearInterval(interval)
	}, [])

		return (
		<div className='min-h-[400px] flex items-center justify-center p-4'>
			<Card className='w-full max-w-md shadow-lg'>
				<CardContent className='flex flex-col items-center gap-4 p-6'>
					<div className='relative w-12 h-12'>
						<Loader2 className='w-full h-full animate-spin text-fuchsia-500' />
						<div className='absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-fuchsia-500/10 rounded-full animate-spin-slow' />
					</div>
					<div className='space-y-1 text-center'>
						<p className='text-sm font-medium text-zinc-700 dark:text-zinc-300'>
							{availableTexts[currentTextIndex]}
						</p>
						<p className='text-xs text-zinc-500 dark:text-zinc-400'>
							This usually takes 1-2 minutes
						</p>
					</div>
					<div className='w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden'>
						<div
							className='h-full bg-fuchsia-500 transition-all duration-300 ease-linear'
							style={{ width: `${progress}%` }}
						/>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
