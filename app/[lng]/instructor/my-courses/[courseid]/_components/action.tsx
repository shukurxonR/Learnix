'use client'
import { deleteCourseById, updateCourseById } from '@/actions/course-action'
import { ICourses } from '@/app.types'
import ConfirmDeliteModal from '@/components/modals/delete-course'
import { Button } from '@/components/ui/button'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'
// import { toast } from 'sonner'

function Action(course: ICourses) {
	const router = useRouter()
	const pathname = usePathname()
	function onDelete() {
		const path = '/en/instructor/my-courses'
		const promise = deleteCourseById(course._id, path).then(() =>
			router.push('/en/instructor/my-courses')
		)
		toast.promise(promise, {
			loading: 'Loading...',
			success: 'Successfully deleted!',
			error: 'Something went wrong!',
		})
	}

	function onUpdate() {
		let promise
		if (course.published === true) {
			promise = updateCourseById(course._id, { published: false }, pathname)
		} else {
			promise = updateCourseById(course._id, { published: true }, pathname)
		}
		toast.promise(promise, {
			loading: 'Loading...',
			success: 'Successfully updated!',
			error: 'Something went wrong!',
		})
	}
	return (
		<div className='flex gap-2 self-end'>
			<Button size={'lg'} onClick={onUpdate}>
				{course.published ? 'Daraf' : 'Publish'}
			</Button>
			<ConfirmDeliteModal onConfirm={onDelete}>
				<Button variant={'destructive'} size={'lg'}>
					Delete
				</Button>
			</ConfirmDeliteModal>
		</div>
	)
}

export default Action
