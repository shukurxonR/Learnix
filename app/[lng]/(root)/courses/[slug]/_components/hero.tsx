'use client'
import { ICourses } from '@/app.types'
import useTranslate from '@/hooks/use-lng'
import { format } from 'date-fns'

import { Clock3 } from 'lucide-react'
import Image from 'next/image'
import { PiStudentBold } from 'react-icons/pi'
import ReactStars from 'react-rating-stars-component'
function Hero(course: ICourses) {
	const t = useTranslate()
	return (
		<div>
			<h1 className='font-space-grotesk text-4xl font-bold'>{course.title}</h1>
			<p className='mt-4 text-muted-foreground'>{course.description}</p>
			<div className='flex flex-wrap mt-4 items-center gap-6'>
				<div className='flex items-center gap-2'>
					<Image
						src={course.instructor.picture}
						width={50}
						height={50}
						alt={course.instructor.fullName}
						className='rounded-full'
					/>
					<p className='font-space-grotesk font-bold'>
						{course.instructor.fullName}
					</p>
				</div>
				<div className='flex items-center gap-2 font-space-grotesk'>
					<p className='font-bold  text-yellow-500'>4.2</p>
					<ReactStars
						count={5}
						value={4.2}
						isHalf={true}
						edit={false}
						size={24}
						activeColor='#facc15'
					/>
					<p className='font-bold'>(199)</p>
				</div>
				<div className='flex items-center gap-2 font-space-grotesk'>
					<PiStudentBold className='!w-6 !h-6' />
					<p className='font-space-grotesk font-bold'>{t('students')}</p>
				</div>
				<div className='flex items-center gap-2 font-space-grotesk'>
					<Clock3 className='!w-6 !h-6' />
					<p className='font-space-grotesk font-bold'>
						{t('lastUpdated')}
						{format(new Date(course.updatedAt), 'MM/yyyy')}
					</p>
				</div>
			</div>
			<Image
				src={course.previewImage}
				width={1920}
				height={1080}
				alt='course'
				className='mt-4 rounded-md object-cover'
			/>
		</div>
	)
}

export default Hero
