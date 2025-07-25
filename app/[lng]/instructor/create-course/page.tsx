import CourseFieldsForm from '@/components/forms/course-fields-form'
import { Separator } from '@/components/ui/separator'
import Header from '../_components/header'

function Page() {
	return (
		<>
			<Header
				title='Create a course'
				description='Fill in the details below to create a new course'
			/>

			<div className='mt-4 rounded-md bg-background p-4'>
				<h3 className='font-space-grotesk text-lg font-medium'>
					Basic information
				</h3>
				<Separator className='my-3' />
				<CourseFieldsForm />
			</div>
		</>
	)
}

export default Page
