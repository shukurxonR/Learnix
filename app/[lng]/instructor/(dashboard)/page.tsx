import ReviewCard from '@/components/cards/overview-card'
import StatisticsCard from '@/components/cards/statistics-card'
import { MonitorPlay } from 'lucide-react'
import { GrMoney } from 'react-icons/gr'
import { PiStudent } from 'react-icons/pi'
import Header from '../_components/header'

function Page() {
	return (
		<>
			<Header title='Dashboard' description='Welcome to your dashboard' />

			<div className='mt-4 grid grid-cols-3 gap-4'>
				<StatisticsCard label='Total courses' value='4' Icon={MonitorPlay} />
				<StatisticsCard
					label='Total students'
					value='11.000'
					Icon={PiStudent}
				/>
				<StatisticsCard label='Total Sales' value='$190.00' Icon={GrMoney} />
			</div>

			<Header
				title='Latest courses'
				description='Here are your latest courses'
			/>

			{/* <div className='mt-4 grid grid-cols-3 gap-4'>
				{courses
					.map(course => (
						<InstructorCourseCard key={course.title} {...course} />
					))
					.slice(0, 3)}
			</div> */}
			<Header title='Reviews' description='Here are your latest reviews' />
			<div className='mt-4 grid grid-cols-3 gap-4'>
				<div className='rounded-md bg-background px-4 pb-4'>
					<ReviewCard />
				</div>
				<div className='rounded-md bg-background px-4 pb-4'>
					<ReviewCard />
				</div>
				<div className='rounded-md bg-background px-4 pb-4'>
					<ReviewCard />
				</div>
			</div>
		</>
	)
}

export default Page
