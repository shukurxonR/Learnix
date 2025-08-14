'use client'
import { sectionOnDalite } from '@/actions/section-action'
import { ISection } from '@/app.types'
import ConfirmDeliteModal from '@/components/modals/delete-course'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

function Action(section: ISection) {
	const router = useRouter()
	const onDalite = () => {
		const path = `/en/instructor/my-courses/${section.course}`
		const promise = sectionOnDalite(section._id, path).then(() =>
			router.push(path)
		)
		toast.promise(promise, {
			loading: 'Loading...',
			success: 'Successfully dalited!',
			error: 'Something went wrong!',
		})
	}
	return (
		<ConfirmDeliteModal onConfirm={onDalite}>
			<Button className='self-end' variant={'destructive'}>
				Dalite
			</Button>
		</ConfirmDeliteModal>
	)
}

export default Action
