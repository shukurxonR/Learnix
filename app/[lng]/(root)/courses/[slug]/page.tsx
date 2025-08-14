import { getDetailedCourse, getFeaturedCourses } from '@/actions/course-action'
import { ICourses } from '@/app.types'
import CoursesCard from '@/components/cards/courses-card'
import TopBar from '@/components/shared/top-bar'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel'
import { Separator } from '@/components/ui/separator'
import { translation } from '@/i18n/server'
import { LngParams } from '@/types'
import Description from './_components/description'
import Hero from './_components/hero'
import Overview from './_components/overview'

async function CoursesSlug({ params: { lng, slug } }: LngParams) {
	const courseJSON = await getDetailedCourse(slug)
	const course = JSON.parse(JSON.stringify(courseJSON))

	const coursesJSON = await getFeaturedCourses()
	const courses = JSON.parse(JSON.stringify(coursesJSON))
	const { t } = await translation(lng)

	return (
		<div>
			<TopBar label='allCourses ' extra='Full Courses Reactjs' />
			<div className='container mx-auto max-w-6xl px-4'>
				<div className='grid grid-cols-3 gap-4 pt-12'>
					<div className='col-span-2 max-lg:col-span-3'>
						<Hero {...course} />
						<Overview {...course} />
					</div>
					<div className='col-span-1 max-lg:col-span-3'>
						<Description {...course} />
					</div>
				</div>
				<Separator className='my-12' />
				<h1 className='font-bold text-3xl font-space-grotesk'>
					{t('youMayLike')}
				</h1>
				<div className='md:hidden flex flex-col gap-4 mt-4'>
					{courses.map((course: ICourses) => (
						<CoursesCard {...course} key={course.title} />
					))}
				</div>
				<Carousel
					opts={{ align: 'start', loop: true }}
					className='mt-6 hidden md:flex w-full'
				>
					<CarouselContent>
						{courses.map((course: ICourses) => (
							<CarouselItem
								key={course.title}
								className='md:basis-1/2 lg:basis-1/3'
							>
								<CoursesCard {...course} />
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			</div>
		</div>
	)
}

export default CoursesSlug
