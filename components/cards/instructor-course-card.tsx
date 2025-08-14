import { ICourses } from '@/app.types'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '../ui/badge'
interface Props {
	course: ICourses
}
function InstructorCourseCard({ course }: Props) {
	return (
		<Link href={`/en/instructor/my-courses/${course._id}`}>
			<div className='flex flex-col rounded-md gap-2 p-2 bg-background'>
				<div className='relative h-48 w-full '>
					<Image
						src={course.previewImage}
						alt={course.title}
						fill
						className='rounded-md object-cover'
					/>
				</div>
				<div className='flex items-center justify-between px-2'>
					<h1 className='font-space-grotesk text-2xl font-bold'>
						{course.title}
					</h1>
					<Badge
						variant={course.published ? 'default' : 'destructive'}
						className='cursor-pointer '
					>
						{course.published ? 'published' : 'Draft'}
					</Badge>
				</div>
			</div>
		</Link>
	)
}

export default InstructorCourseCard
