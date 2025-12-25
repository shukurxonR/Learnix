import { getCourses } from '@/actions/course-action'
import { getReviews } from '@/actions/review-action'
import InstructorCourseCard from '@/components/cards/instructor-course-card'
import ReviewCard from '@/components/cards/overview-card'
import StatisticsCard from '@/components/cards/statistics-card'
import { formatAndDivideNumber } from '@/lib/utils'
import { auth } from '@clerk/nextjs'
import { Mails, MonitorPlay } from 'lucide-react'
import { GrMoney } from 'react-icons/gr'
import { PiStudent } from 'react-icons/pi'
import Header from '../_components/header'

async function Page() {
	const { userId } = auth()

	const result = await getCourses({ clerkId: userId! })
	const { reviews, totalReviews } = await getReviews({ clerkId: userId! })

	return (
		<>
			<Header title='Dashboard' description='Welcome to your dashboard' />

			<div className='mt-4 grid grid-cols-4 gap-4'>
				<StatisticsCard
					label='Total courses'
					value={result.totalCourses.toString()}
					Icon={MonitorPlay}
				/>
				<StatisticsCard
					label='Total students'
					value={formatAndDivideNumber(result.totalStudents)}
					Icon={PiStudent}
				/>
				<StatisticsCard
					label='Reviews'
					value={formatAndDivideNumber(totalReviews)}
					Icon={Mails}
				/>
				<StatisticsCard
					label='Total Sales'
					value={result.totalEearnings.toLocaleString('en-US', {
						style: 'currency',
						currency: 'USD',
					})}
					Icon={GrMoney}
				/>
			</div>

			<Header
				title='Latest courses'
				description='Here are your latest courses'
			/>

			<div className='mt-4 grid grid-cols-3 gap-4'>
				{result.courses
					.map(course => (
						<InstructorCourseCard key={course.title} course={course} />
					))
					.slice(0, 3)}
			</div>
			<Header title='Reviews' description='Here are your latest reviews' />
			<div className='mt-4 grid grid-cols-3 gap-4'>
				{reviews.map(review => (
					// <div className='rounded-md bg-background px-4 pb-4' key={review._id}>
					<ReviewCard
						review={JSON.parse(JSON.stringify(review))}
						key={review._id}
					/>
					// </div>
				))}
			</div>
		</>
	)
}

export default Page
