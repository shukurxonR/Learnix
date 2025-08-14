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
import { informationSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Edit2, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

function Information(course: ICourses) {
	const { isEdit, onToggle } = useToggleEdit()
	return (
		<Card>
			<CardContent className='relative p-6'>
				<div className='flex items-center justify-between'>
					<span className='text-lg font-medium'>Information</span>
					<Button size={'icon'} variant={'ghost'} onClick={onToggle}>
						{isEdit ? <X /> : <Edit2 />}
					</Button>
				</div>
				<Separator className='my-3' />

				{isEdit ? (
					<Forms course={course} onToggle={onToggle} />
				) : (
					<div className='flex flex-col space-y-2'>
						<div className='grid grid-cols-3 gap-2'>
							<div className='col-span-1 font-space-grotesk font-bold text-muted-foreground'>
								Requirements:
							</div>
							<div className='col-span-2 line-clamp-3'>
								{course.requirements}
							</div>
						</div>
						<div className='grid grid-cols-3 gap-2'>
							<div className='col-span-1 font-space-grotesk font-bold text-muted-foreground'>
								Learning:
							</div>
							<div className='col-span-2 line-clamp-3'>{course.learning}</div>
						</div>
						<div className='grid grid-cols-3 gap-2'>
							<div className='col-span-1 font-space-grotesk font-bold text-muted-foreground'>
								Tags:
							</div>
							<div className='col-span-2 line-clamp-3'>{course.tags}</div>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	)
}

export default Information

interface FormProps {
	course: ICourses
	onToggle: () => void
}
function Forms({ course, onToggle }: FormProps) {
	const pathname = usePathname()
	const [isLoading, setLoading] = useState(false)

	const form = useForm<z.infer<typeof informationSchema>>({
		resolver: zodResolver(informationSchema),
		defaultValues: {
			learning: course.learning,
			requirements: course.requirements,
			tags: course.tags,
		},
	})
	function onSubmit(values: z.infer<typeof informationSchema>) {
		setLoading(true)
		const promise = updateCourseById(course._id, values, pathname)
			.then(() => onToggle())
			.finally(() => setLoading(false))

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
						name='requirements'
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Requirements<span className='text-red-500'>*</span>
								</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='learning'
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Learning<span className='text-red-500'>*</span>
								</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='tags'
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Tags<span className='text-red-500'>*</span>
								</FormLabel>
								<FormControl>
									<Input {...field} />
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
