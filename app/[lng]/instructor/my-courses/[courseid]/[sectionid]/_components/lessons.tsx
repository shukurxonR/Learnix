'use client'
import {
	createLesson,
	editLesson,
	editLessonPosition,
} from '@/actions/lesson-action'
import { ILessonFields } from '@/actions/types'
import { ILesson, ISection } from '@/app.types'
import FillLoading from '@/components/shared/fill-loading'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { editorConfig } from '@/constants/const'
import useToggleEdit from '@/hooks/use-toggle'
import { lessonSchema } from '@/lib/validation'
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import { zodResolver } from '@hookform/resolvers/zod'
import { Editor } from '@tinymce/tinymce-react'
import { BadgePlus, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import LessonList from './lesson-list'

interface Props {
	section: ISection
	lessons: ILesson[]
}

function Lessons({ section, lessons }: Props) {
	const path = usePathname()
	const [isLoading, setIsLoading] = useState(false)

	const [isForm, setIsForm] = useState(false)
	const [lessonId, setLessonId] = useState('')
	const [currentLesson, setCurrentLesson] = useState<ILessonFields | null>(null)
	const { onToggle, isEdit } = useToggleEdit()

	async function onAdd(lesson: ILessonFields) {
		setIsLoading(true)
		const newLesson = await createLesson({ lesson, section: section._id, path })
			.then(() => onToggle())
			.finally(() => setIsLoading(false))
		return newLesson
	}
	const onFinishEdit = () => {
		setIsForm(false)
		setCurrentLesson(null)
		setLessonId('')
	}

	const onStartEdit = (lesson: ILesson) => {
		setIsForm(true)
		setLessonId(lesson._id)
		setCurrentLesson({
			content: lesson.content,
			hours: `${lesson.duration.hours}`,
			minutes: `${lesson.duration.minutes}`,
			seconds: `${lesson.duration.seconds}`,
			title: lesson.title,
			videoUrl: lesson.videoUrl,
			free: lesson.free,
		})
	}

	function onEdit(lesson: ILessonFields) {
		setIsLoading(true)
		const promise = editLesson(lesson, lessonId, path)
			.then(() => onFinishEdit())
			.finally(() => setIsLoading(false))
		return promise
	}

	const onReorder = (updateData: { _id: string; position: number }[]) => {
		setIsLoading(true)
		const promise = editLessonPosition({
			lists: updateData,
			path,
		}).finally(() => setIsLoading(false))

		toast.promise(promise, {
			loading: 'Loading...',
			success: 'Successfully reordered!',
			error: 'Something went wrong!',
		})
	}

	const onDragEnd = (result: DropResult) => {
		if (!result.destination) return null

		const items = Array.from(lessons)
		const [reorderedItem] = items.splice(result.source.index, 1)
		items.splice(result.destination.index, 0, reorderedItem)

		const startIndex = Math.min(result.source.index, result.destination.index)
		const endIndex = Math.max(result.source.index, result.destination.index)

		const updatedLessons = items.slice(startIndex, endIndex + 1)

		const bulkUpdatedData = updatedLessons.map(lesson => ({
			_id: lesson._id,
			position: items.findIndex(item => item._id === lesson._id),
		}))

		onReorder(bulkUpdatedData)
	}
	return (
		<Card>
			<CardContent className='relative p-6'>
				{isLoading && <FillLoading />}
				<div className='flex items-center justify-between'>
					<span className='text-lg font-medium'>
						{isForm ? 'Textbook editing' : 'Manage chapters'}
					</span>
					{!isForm && (
						<Button size={'icon'} variant={'ghost'} onClick={onToggle}>
							{isEdit ? <X /> : <BadgePlus />}
						</Button>
					)}
				</div>
				<Separator className='my-3' />
				{isEdit ? (
					<Forms lesson={{} as ILessonFields} handler={onAdd} />
				) : isForm ? (
					<Forms
						lesson={currentLesson as ILessonFields}
						handler={onEdit}
						isForm
						onCancel={onFinishEdit}
					/>
				) : (
					<>
						{!lessons.length ? (
							<p className='text-muted-foreground'>No lessons</p>
						) : (
							<>
								{!lessons.length ? (
									<p className='text-muted-foreground'>No lessons</p>
								) : (
									<DragDropContext onDragEnd={onDragEnd}>
										<Droppable droppableId='lessons'>
											{provided => (
												<div
													{...provided.droppableProps}
													ref={provided.innerRef}
												>
													{lessons.map((lesson, index) => (
														<LessonList
															key={lesson._id}
															lesson={lesson}
															index={index}
															onStartEdit={() => onStartEdit(lesson)}
														/>
													))}
												</div>
											)}
										</Droppable>
									</DragDropContext>
								)}
							</>
						)}
					</>
				)}
			</CardContent>
		</Card>
	)
}

export default Lessons

interface FormProps {
	lesson: ILessonFields
	handler: (lesson: ILessonFields) => Promise<void>
	isForm?: boolean
	onCancel?: () => void
}
function Forms({ handler, lesson, isForm, onCancel }: FormProps) {
	const { title, content, videoUrl, hours, minutes, seconds, free } = lesson

	const form = useForm<z.infer<typeof lessonSchema>>({
		resolver: zodResolver(lessonSchema),
		defaultValues: {
			title,
			videoUrl,
			hours: `${hours}`,
			minutes: `${minutes}`,
			seconds: `${seconds}`,
			content,
			free,
		},
	})
	const onSubmit = (values: z.infer<typeof lessonSchema>) => {
		const promise = handler(values as ILessonFields).finally(() => form.reset())

		toast.promise(promise, {
			loading: 'Loading...',
			success: 'Successfully!',
			error: 'Something went wrong!',
		})
	}

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
					<FormField
						control={form.control}
						name='title'
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										placeholder='Title'
										className='bg-secondary'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='videoUrl'
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Textarea
										placeholder='Video URL'
										className='bg-secondary'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='content'
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Editor
										apiKey={process.env.NEXT_PUBLIC_TINY_API_KEY}
										init={editorConfig}
										onBlur={field.onBlur}
										initialValue={content}
										onEditorChange={(content: string) =>
											field.onChange(content)
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='grid grid-cols-3 gap-2'>
						<FormField
							control={form.control}
							name='hours'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											placeholder='Hours'
											className='bg-secondary'
											type='number'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='minutes'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											placeholder='Minutes'
											className='bg-secondary'
											type='number'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='seconds'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											placeholder='Seconds'
											className='bg-secondary'
											type='number'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='free'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<div className='flex items-center gap-2 py-1'>
											<Checkbox
												onCheckedChange={field.onChange}
												checked={field.value}
											/>
											<label
												htmlFor='free'
												className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
											>
												Mark as free?
											</label>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className='flex items-center gap-2'>
						<Button type='submit'>{isForm ? 'Edit' : 'Add'}</Button>
						{isForm && (
							<Button variant={'destructive'} type='submit' onClick={onCancel}>
								Cancel
							</Button>
						)}
					</div>
				</form>
			</Form>
		</>
	)
}
