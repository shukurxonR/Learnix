'use client'
import { updateCourseById } from '@/actions/course-action'
import { ICourses } from '@/app.types'
import FillLoading from '@/components/shared/fill-loading'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import useToggleEdit from '@/hooks/use-toggle'
import { descriptionSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Edit2, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

function Description(course: ICourses) {
	const { isEdit, onToggle } = useToggleEdit()
	return (
		<Card>
			<CardContent className='relative p-6'>
				<div className='flex justify-between items-center '>
					<span className='text-lg font-medium'>Course Fields</span>
					<Button size={'icon'} variant={'ghost'} onClick={onToggle}>
						{isEdit ? <X /> : <Edit2 />}
					</Button>
				</div>
				<Separator className='my-3' />
				{isEdit ? (
					<Forms course={course} onToggle={onToggle} />
				) : (
					<div className='flex items-center gap-2'>
						<span className='font-space-grotesk font-bold text-muted-foreground self-start'>
							Description:
						</span>
						<span className='font-medium'>{course.description}</span>
					</div>
				)}
			</CardContent>
		</Card>
	)
}

export default Description

interface FormProps {
	onToggle: () => void
	course: ICourses
}

function Forms({ course, onToggle }: FormProps) {
	const pathname = usePathname()

	const [isLoading, setIsLoading] = useState(false)

	const form = useForm<z.infer<typeof descriptionSchema>>({
		resolver: zodResolver(descriptionSchema),
		defaultValues: {
			description: course.description,
		},
	})

	const onSubmit = (value: z.infer<typeof descriptionSchema>) => {
		setIsLoading(true)
		const promise = updateCourseById(course._id, value, pathname)
			.then(() => {
				onToggle()
			})
			.finally(() => setIsLoading(false))
		toast.promise(promise, {
			loading: 'Loading...',
			success: 'Successfully updated!',
			error: 'Something went wrong!',
		})
	}
	return (
		<>
			{isLoading && <FillLoading />}
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
					<FormField
						control={form.control}
						name='description'
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Textarea disabled={isLoading} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type='submit'>Submit</Button>
				</form>
			</Form>
		</>
	)
}
