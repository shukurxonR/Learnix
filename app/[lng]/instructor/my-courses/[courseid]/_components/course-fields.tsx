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
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import useToggleEdit from '@/hooks/use-toggle'
import { courseFieldsSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Edit2, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

function CourseFields(course: ICourses) {
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
					<div className='flex flex-col gap-2'>
						<div className='flex items-center gap-2'>
							<span className='font-space-grotesk font-bold text-muted-foreground self-start'>
								Title:
							</span>
							<span className='font-medium'>{course.title}</span>
						</div>
						<div className='flex items-center gap-2'>
							<span className='font-space-grotesk font-bold text-muted-foreground self-start'>
								Slug:
							</span>
							<span className='font-medium'>
								{course.slug ?? 'Not configured'}
							</span>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	)
}

export default CourseFields

interface FormProps {
	course: ICourses
	onToggle: () => void
}

function Forms({ course, onToggle }: FormProps) {
	const pathname = usePathname()

	const [isLoading, setIsLoading] = useState(false)
	const form = useForm<z.infer<typeof courseFieldsSchema>>({
		resolver: zodResolver(courseFieldsSchema),
		defaultValues: {
			title: course.title,
			slug: course.slug,
		},
	})

	const onSubmit = (value: z.infer<typeof courseFieldsSchema>) => {
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
						name='title'
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Title<span className='text-red-500'>*</span>
								</FormLabel>
								<FormControl>
									<Input placeholder='new title' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='slug'
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Slug<span className='text-red-500'>*</span>
								</FormLabel>
								<FormControl>
									<Input disabled={isLoading} {...field} />
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
