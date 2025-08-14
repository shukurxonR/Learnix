import { ILesson } from '@/app.types'
import { formatLessonTime } from '@/lib/utils'
import { Video } from 'lucide-react'

function LessonList(lesson: ILesson) {
	return (
		<div
			className='flex items-center justify-between text-sm text-gray-300 hover:text-white transition cursor-pointer'
			key={lesson._id}
		>
			<div className='flex items-center gap-2'>
				<Video className='size-4 text-gray-500' />
				<p className='truncate'>{lesson.title}</p>
			</div>
			<p className='text-gray-500'>{formatLessonTime(lesson)}</p>
		</div>
	)
}

export default LessonList
