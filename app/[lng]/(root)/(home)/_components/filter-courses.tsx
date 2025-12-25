'use client'

import { ICourses } from '@/app.types'
import CoursesCard from '@/components/cards/courses-card'
import { Button } from '@/components/ui/button'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel'
import { filterCourses } from '@/constants/const'

import useTranslate from '@/hooks/use-lng'
import { formUrlQuery } from '@/lib/utils'
import Autoplay from 'embla-carousel-autoplay'
import { useRouter, useSearchParams } from 'next/navigation'

interface Props {
	courses: ICourses[]
}

function FilteredCourses({ courses }: Props) {
	const t = useTranslate()

	const searchParams = useSearchParams()
	const router = useRouter()

	const onUpdateParams = (value: string) => {
		const newUrl = formUrlQuery({
			params: searchParams.toString(),
			key: 'filter',
			value,
			toCourses: true,
		})
		router.push(newUrl)
	}
	return (
		<div className='container max-w-6xl mx-auto py-12 px-4 '>
			<div className='flex items-center justify-between max-md:flex-col max-md:items-start'>
				<div className='flex flex-col gap-1'>
					<h1 className='text-3xl font-space-grotesk font-bold'>
						{t('exploreCourses')}
					</h1>
					<p className='text-sm text-muted-foreground font-space-grotesk'>
						{t('exploreCoursesDescription')}
					</p>
				</div>
				<div className='flex items-center gap-1 self-end max-md:mt-4 max-md:w-full max-md:rounded-full max-md:p-2 max-md:bg-primary/70 max-md:flex-wrap'>
					{filterCourses.map(categor => (
						<Button
							key={categor.label}
							round={'full'}
							variant={'all' === categor.name ? 'secondary' : 'ghost'}
							onClick={() => onUpdateParams(categor.name)}
							className='max-md:w-auto max-md:flex-1 max-md:text-sm  max-md:px-2  md:h-9 md:rounded-full md:px-6' // Tugmalarga kichik ekranlarda moslashish uchun sinflar
						>
							{t(categor.label)}
						</Button>
					))}
				</div>
			</div>

			<div className='md:hidden flex flex-col gap-4 mt-4'>
				{courses.map(itm => (
					<CoursesCard {...itm} key={itm.title} />
				))}
			</div>
			<Carousel
				opts={{ align: 'start', loop: true }}
				plugins={[
					Autoplay({
						delay: 3000,
					}),
				]}
				className='mt-6 hidden md:flex w-full'
			>
				<CarouselContent>
					{courses.map(itm => (
						<CarouselItem key={itm.title} className='md:basis-1/2 lg:basis-1/3'>
							<CoursesCard {...itm} />
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
		</div>
	)
}

export default FilteredCourses
