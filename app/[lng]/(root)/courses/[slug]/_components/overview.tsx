'use client'

import { getCourseSections } from '@/actions/section-action'
import { ICourses, ISection } from '@/app.types'
import ReviewCard from '@/components/cards/overview-card'
import SectionLoading from '@/components/shared/section-loading'
import { Accordion } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import useTranslate from '@/hooks/use-lng'
import {
	BadgeCheck,
	CalendarRange,
	Dot,
	ListOrdered,
	MonitorPlay,
	Star,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import SectionList from './section-list'

function Overview(course: ICourses) {
	const t = useTranslate()
	const [isLoading, setIsLoading] = useState(true)
	const [sections, setSection] = useState<ISection[]>([])
	const totalHours = course.totalDuration.split('.')[0]
	async function getSections() {
		try {
			const result = await getCourseSections(course._id)
			setSection(result)
			setIsLoading(false)
		} catch (error) {
			throw new Error(`Nimadur hato ${error}`)
		}
	}
	useEffect(() => {
		getSections()
	}, [])

	return (
		<>
			<div className='mt-6 rounded-md bg-gradient-to-t from-background to-secondary p-4 lg:p-6'>
				<h2 className='text-3xl font-space-grotesk font-bold'>
					{t('whatYouWillLearn')}
				</h2>
				<div className='mt-5 grid grid-cols-1 md:grid-cols-2 gap-4'>
					{course.learning.split(', ').map(item => (
						<div className='flex gap-2' key={item}>
							<BadgeCheck className='size-5 text-blue-500' />
							<p className='flex-1'>{item}</p>
						</div>
					))}
				</div>
			</div>

			<div className='mt-6 rounded-md bg-gradient-to-b from-background to-secondary p-4 lg:p-6'>
				<h2 className='text-3xl font-space-grotesk font-bold'>
					{t('courseContent')}
				</h2>
				{/*  */}
				<div className='mt-5 flex flex-row flex-wrap gap-8'>
					{/* Modules Count */}
					<div className='flex flex-col '>
						<ListOrdered className='size-10' />
						<p className='font-space-grotesk text-xl font-bold mt-2'>
							{t('numberOfModules')}
						</p>
						<div className='text-xl font-medium text-blue-300'>
							{course.totalSections}
						</div>
					</div>

					{/* Lessons Count */}
					<div className='flex flex-col'>
						<MonitorPlay className='size-10' />
						<p className='font-space-grotesk text-xl font-bold mt-2'>
							{t('numberOfLessons')}
						</p>
						<div className='text-xl font-medium text-blue-300'>
							{course.totalLessons} {t('pieces')}
						</div>
					</div>

					{/* Course Duration */}
					<div className='flex flex-col'>
						<CalendarRange className='size-10' />
						<p className='font-space-grotesk text-xl font-bold mt-2'>
							{t('courseDuration')}
						</p>
						<div className='text-xl text-blue-300 font-medium'>
							{totalHours === '0' ? null : `${totalHours} ${t('hours')} `}
							{course.totalDuration.split('.')[1]} {t('minutes')}
						</div>
					</div>
				</div>
				<Separator className='my-3' />
				{isLoading ? (
					<div className='mt-4 flex flex-col gap-3'>
						{Array.from({ length: course.totalSections }).map((_, i) => (
							<SectionLoading key={i} />
						))}
					</div>
				) : (
					<Accordion type='single' collapsible>
						{sections.map(section => (
							<SectionList key={section._id} {...section} />
						))}
					</Accordion>
				)}
			</div>

			<div className='mt-8 rounded-md  bg-secondary  p-4 lg:p-6'>
				<h2 className='text-3xl font-space-grotesk font-bold'>
					{t('courseForWhom')}
				</h2>
				<div className='pt-2'>
					{course.requirements.split(', ').map(item => (
						<div className='flex mt-1 items-center' key={item}>
							<Dot />
							<p className='flex-1 text-slate-400'>{item}</p>
						</div>
					))}
				</div>
			</div>
			<div className='mt-8 flex flex-col pb-20'>
				<div className='mt-6 flex items-center gap-1 font-space-grotesk text-xl'>
					<Star className='fill-[#DD6B20] text-[#DD6B20]' />
					<div className='font-medium'>
						{t('reviewCourse')}: <span className='font-bold'>4.5</span>
					</div>
					<Dot />
					<div className='font-medium'>
						<span className='font-bold'>20 </span> {t('review')}
					</div>
				</div>
				<div className='mt-5 grid grid-cols-1 gap-2 lg:grid-cols-2'>
					<ReviewCard />
					<ReviewCard />
					<ReviewCard />
					<ReviewCard />
				</div>
				<Button
					round={'full'}
					size={'lg'}
					className='mx-auto mt-6 flex justify-center hover:bg-blue-400'
				>
					{t('viewAll')}
				</Button>
			</div>
		</>
	)
}
export default Overview
