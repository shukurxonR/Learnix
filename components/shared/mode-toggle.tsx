'use client'

import { Button } from '@/components/ui/button'
import { MoonStar, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ModeToggle() {
	const { setTheme, resolvedTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) return null

	const isDark = resolvedTheme === 'dark'

	return (
		<Button
			variant='ghost'
			size='sm'
			onClick={() => setTheme(isDark ? 'light' : 'dark')}
			className='relative flex items-center justify-between w-16 h-8 rounded-full p-1 
				bg-gradient-to-r from-yellow-400 to-gray-700
				dark:from-gray-600 dark:to-gray-900 
				transition-colors duration-700 ease-in-out shadow-inner'
			aria-label='Toggle Theme'
		>
			{/* Sun icon (chapda) */}
			<Sun className='w-4 h-4 text-yellow-300' />

			{/* MoonStar icon (o‘ngda) */}
			<MoonStar className='w-4 h-4 text-gray-200' />

			{/* Dumaloq tugma */}
			<span
				className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg 
					transform transition-all duration-1000 ease-in-out
					${isDark ? 'translate-x-8' : 'translate-x-0'}
					`}
			/>
		</Button>
	)
}
