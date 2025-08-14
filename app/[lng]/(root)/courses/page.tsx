import { getAllCourses } from '@/actions/course-action'
import { searchParamsProps } from '@/app.types'
import TopBar from '@/components/shared/top-bar'
import AllCourses from './_components/all-courses'

async function Courses({ searchParams }: searchParamsProps) {
	const resJSON = await getAllCourses({
		page: searchParams.page ? +searchParams.page : 1,
		filter: searchParams.filter,
		searchQuery: searchParams.q,
	})
	const result = JSON.parse(JSON.stringify(resJSON))
	return (
		<>
			<TopBar label='allCourses' description='allCourseDescription' />
			<AllCourses result={result} />
		</>
	)
}

export default Courses
