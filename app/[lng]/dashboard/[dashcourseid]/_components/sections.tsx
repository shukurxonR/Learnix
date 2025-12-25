// 'use client'
// import { completeLesson, unCompleteLesson } from '@/actions/course-action'
// import { ILesson, ISection } from '@/app.types'
// import {
// 	Accordion,
// 	AccordionContent,
// 	AccordionItem,
// 	AccordionTrigger,
// } from '@/components/ui/accordion'
// import { Button } from '@/components/ui/button'
// import { Checkbox } from '@/components/ui/checkbox'
// import { cn } from '@/lib/utils'
// import { useAuth } from '@clerk/nextjs'
// import { CheckedState } from '@radix-ui/react-checkbox'
// import { Pause, PlayCircle } from 'lucide-react'
// import Link from 'next/link'
// import {
// 	useParams,
// 	usePathname,
// 	useRouter,
// 	useSearchParams,
// } from 'next/navigation'
// import { useState } from 'react'

// interface Props {
// 	sections: ISection[]
// }

// function Sections({ sections }: Props) {
// 	const searchParams = useSearchParams()
// 	const pathname = usePathname()
// 	const router = useRouter()

// 	const sectionId = searchParams.get('s')

// 	function onSelect(id: string) {
// 		const currentUrl = new URLSearchParams(Array.from(searchParams.entries()))

// 		if (id) {
// 			currentUrl.set('s', id)
// 		} else {
// 			currentUrl.delete('s')
// 		}
// 		const search = currentUrl.toString()
// 		const query = search ? `?${search}` : ''

// 		router.push(`${pathname}${query}`)
// 	}
// 	return (
// 		<div>
// 			<Accordion
// 				type='single'
// 				collapsible
// 				onValueChange={onSelect}
// 				defaultValue={sectionId!}
// 				value={sectionId!}
// 			>
// 				{sections.map(section => (
// 					<SectionList key={section._id} {...section} />
// 				))}
// 			</Accordion>
// 		</div>
// 	)
// }

// export default Sections

// function SectionList(section: ISection) {
// 	const searchParams = useSearchParams()
// 	const sectionid = searchParams.get('s')
// 	return (
// 		<AccordionItem value={section._id} className='mt-1'>
// 			<AccordionTrigger
// 				className={cn(
// 					'text-left hover:no-underline hover:bg-gray-50 hover:dark:bg-slate-700 px-3 bg-gray-100 dark:bg-secondary/80',
// 					sectionid === section._id && 'bg-white dark:bg-slate-600'
// 				)}
// 			>
// 				{section.title}
// 			</AccordionTrigger>
// 			<AccordionContent>
// 				{section.lessons.map(lesson => (
// 					<LessonList
// 						key={lesson._id}
// 						lesson={lesson}
// 						sectionId={section._id}
// 					/>
// 				))}
// 			</AccordionContent>
// 		</AccordionItem>
// 	)
// }

// interface LessonProps {
// 	lesson: ILesson
// 	sectionId: string
// }

// function LessonList({ lesson, sectionId }: LessonProps) {
// 	const { dashcourseid, lessonid } = useParams()
// 	const [isLoading, setIsLoading] = useState(false)

// 	const pathname = usePathname()
// 	const { userId } = useAuth()

// 	function onCheck(checked: CheckedState) {
// 		setIsLoading(true)
// 		let promise
// 		if (checked) {
// 			promise = completeLesson(userId!, lesson._id, pathname)
// 		} else {
// 			promise = unCompleteLesson(lesson._id, pathname)
// 		}

// 		promise.finally(() => setIsLoading(false))
// 	}
// 	const isCompleted = lesson.userProgress
// 		.map(progress => progress.lessonId)
// 		.includes(lesson._id)

// 	return (
// 		<Button
// 			className={cn(
// 				'group relative mx-auto mt-2 flex h-12 w-[calc(100%-12px)] items-center justify-between  border  border-secondary	 px-3 text-sm transition-all duration-200 ease-in-out hover:border-s-secondary-foreground   hover:shadow-sm active:scale-[0.98]',
// 				lessonid === lesson._id &&
// 					'bg-cyan-950 hover:bg-cyan-950 border-s-secondary-foreground '
// 			)}
// 			variant={'ghost'}
// 		>
// 			<Link
// 				href={`/dashboard/${dashcourseid}/${lesson._id}?s=${sectionId}`}
// 				className='flex w-full items-center gap-x-2'
// 			>
// 				{lessonid === lesson._id ? (
// 					<Pause size={18} className='text-primary' />
// 				) : (
// 					<PlayCircle
// 						size={18}
// 						className='text-muted-foreground transition-colors group-hover:text-primary'
// 					/>
// 				)}

// 				{/* Title */}
// 				<span className='line-clamp-1 flex-1 text-left'>
// 					{lesson.title.length > 30
// 						? `${lesson.title.slice(0, 30)}...`
// 						: lesson.title}
// 				</span>
// 			</Link>

// 			<Checkbox
// 				onCheckedChange={onCheck}
// 				defaultChecked={isCompleted}
// 				checked={isCompleted}
// 				disabled={isLoading}
// 			/>
// 		</Button>
// 	)
// }
'use client'
import { completeLesson, uncompleteLesson } from '@/actions/course-action'
import { ILesson, ISection } from '@/app.types'
import SectionLoading from '@/components/shared/section-loading'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { useAuth } from '@clerk/nextjs'
import { CheckedState } from '@radix-ui/react-checkbox'
import { Pause, PlayCircle } from 'lucide-react'
import Link from 'next/link'
import {
	useParams,
	usePathname,
	useRouter,
	useSearchParams,
} from 'next/navigation'
import { useEffect, useState } from 'react'

interface PropsSection {
	sections: ISection[]
}

function Sections({ sections }: PropsSection) {
	const [mount, setMount] = useState(false)

	const searchParams = useSearchParams()
	const sectionId = searchParams.get('s')
	const pathname = usePathname()
	const router = useRouter()

	useEffect(() => {
		if (sectionId) {
			setMount(true)
		}
	}, [sectionId])

	function onSelect(id: string) {
		const currentUrl = new URLSearchParams(Array.from(searchParams.entries()))

		if (id) {
			currentUrl.set('s', id)
		} else {
			currentUrl.delete('s')
		}
		const search = currentUrl.toString()
		const query = search ? `?${search}` : ''

		router.push(`${pathname}${query}`)
	}

	return mount ? (
		<div>
			<Accordion
				type='single'
				collapsible
				className='mt-1'
				defaultValue={sectionId!}
				value={sectionId!}
				onValueChange={onSelect}
			>
				{sections.map(section => (
					<SectionList key={section._id} {...section} />
				))}
			</Accordion>
		</div>
	) : (
		<div className='mt-4 flex flex-col space-y-2'>
			{Array.from({ length: sections.length }).map((_, i) => (
				<SectionLoading key={i} />
			))}
		</div>
	)
}

export default Sections

function SectionList(section: ISection) {
	const searchParams = useSearchParams()
	const sectionId = searchParams.get('s')

	return (
		<AccordionItem value={section._id} className='mt-1'>
			<AccordionTrigger
				className={cn(
					'text-left hover:no-underline hover:bg-gray-50 hover:dark:bg-gray-800 px-3 bg-gray-100 dark:bg-black/20',
					sectionId === section._id && 'bg-white dark:bg-gray-800'
				)}
			>
				{section.title}
			</AccordionTrigger>

			<AccordionContent>
				{section.lessons.map(lesson => (
					<LessonList
						key={lesson._id}
						lesson={lesson}
						sectionId={section._id}
					/>
				))}
			</AccordionContent>
		</AccordionItem>
	)
}
interface LessonProps {
	lesson: ILesson
	sectionId: string
}

function LessonList({ lesson, sectionId }: LessonProps) {
	const { dashcourseid, lessonid } = useParams()

	const [isLoading, setIsLoading] = useState(false)

	const [mount, setMount] = useState(false)
	const { userId } = useAuth()
	const pathname = usePathname()

	useEffect(() => setMount(true), [])

	function onCheck(checked: CheckedState) {
		setIsLoading(true)
		let promise

		if (checked) {
			promise = completeLesson(lesson._id, userId!, pathname)
		} else {
			promise = uncompleteLesson(lesson._id, pathname)
		}
		promise.finally(() => setIsLoading(false))
	}

	const isCompleted = lesson.userProgress
		.map(itm => itm.lessonId)
		.includes(lesson._id)

	return (
		<Button
			className={cn(
				'group relative mx-auto mt-2 flex h-12 w-[calc(100%-12px)] items-center justify-between  border  border-secondary	 px-3 text-sm transition-all duration-200 ease-in-out hover:border-s-secondary-foreground   hover:shadow-sm active:scale-[0.98]',
				lessonid === lesson._id &&
					'bg-cyan-950 hover:bg-cyan-950 border-s-secondary-foreground '
			)}
			variant={'ghost'}
		>
			<Link
				href={`/dashboard/${dashcourseid}/${lesson._id}?s=${sectionId}`}
				className='flex w-full items-center gap-x-2'
			>
				{lessonid === lesson._id ? (
					<Pause size={18} className='text-primary' />
				) : (
					<PlayCircle
						size={18}
						className='text-muted-foreground transition-colors group-hover:text-primary'
					/>
				)}

				{/* Title */}
				<span className='line-clamp-1 flex-1 text-left'>
					{lesson.title.length > 30
						? `${lesson.title.slice(0, 30)}...`
						: lesson.title}
				</span>
			</Link>

			{/* Checkbox */}
			<div className='flex items-center justify-center'>
				{mount && (
					<Checkbox
						defaultChecked={isCompleted}
						checked={isCompleted}
						className={cn(
							'scale-90 group-hover:scale-100 transition-transform',
							isLoading && 'opacity-40 cursor-not-allowed'
						)}
						onCheckedChange={onCheck}
						disabled={isLoading}
					/>
				)}
			</div>
		</Button>
	)
}
