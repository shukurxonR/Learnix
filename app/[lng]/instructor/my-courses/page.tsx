// import InstructorCourseCard from '@/components/cards/instructor-course-card'
import InstructorCourseCard from '@/components/cards/instructor-course-card'

import { getCourses } from '@/actions/course-action'
import { searchParamsProps } from '@/app.types'
import Pagination from '@/components/shared/pagination'
import { auth } from '@clerk/nextjs'
import Header from '../_components/header'

async function Page({ searchParams }: searchParamsProps) {
	const { userId } = auth()

	const page = searchParams.page ? +searchParams.page : 1

	const result = await getCourses({ clerkId: userId!, page })

	return (
		<>
			<Header title='My courses' description='Here are your latest courses' />
			<div className='mt-4 grid grid-cols-3 gap-4'>
				{result.courses.map(item => (
					<InstructorCourseCard
						key={item._id}
						course={JSON.parse(JSON.stringify(item))}
					/>
				))}
			</div>
			<Pagination pageNumber={page} isNext={result.isNext} />
		</>
	)
}

export default Page
