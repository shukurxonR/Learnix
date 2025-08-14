'use client'

import { updateCourseById } from '@/actions/course-action'
// import { updateCourse } from '@/actions/course.action'
import { ICourses } from '@/app.types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import useToggleEdit from '@/hooks/use-toggle'
import { UploadButton } from '@/lib/uploadthing'
import { Edit2, X } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

function PreviewImage(course: ICourses) {
	const { isEdit, onToggle } = useToggleEdit()

	return (
		<Card>
			<CardContent className='relative p-6'>
				<div className='flex items-center justify-between'>
					<span className='text-lg font-medium'>Replace image</span>
					<div className=''>
						<Button size={'icon'} variant={'ghost'} onClick={onToggle}>
							{isEdit ? <X /> : <Edit2 className='size-5' />}
						</Button>
					</div>
				</div>
				<Separator className='my-3' />
				{isEdit ? (
					<UploadingImage course={course} onToggle={onToggle} />
				) : (
					<div className='relative h-72 w-full'>
						{course.previewImage ? (
							<div className='relative h-72 w-full'>
								<Image
									src={course.previewImage}
									alt={course.title || 'Course image'}
									fill
									className='rounded-sm object-cover'
								/>
							</div>
						) : (
							<p>No preview image</p>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	)
}

export default PreviewImage

interface FormsProps {
	course: ICourses
	onToggle: () => void
}

function UploadingImage({ course, onToggle }: FormsProps) {
	const pathname = usePathname()
	const [previewImage, setPreviewImage] = useState('')

	function uploadingNewImage() {
		const promise = updateCourseById(
			course._id,
			{ previewImage: previewImage },
			pathname
		).then(() => onToggle())

		toast.promise(promise, {
			loading: 'Loading...',
			success: 'Successfully updated!',
			error: 'Something went wrong!',
		})
	}

	return (
		<div className='flex flex-col items-center gap-4'>
			{/* Drop zone style */}
			<div className='group relative w-full h-60 border-2 border-dashed border-sky-500/40 bg-sky-100/5 rounded-xl flex flex-col items-center justify-center transition hover:bg-sky-500/10 hover:border-sky-500/60 text-sky-300'>
				<UploadButton
					endpoint='imageUploader'
					config={{ appendOnPaste: true, mode: 'auto' }}
					onClientUploadComplete={res => {
						if (res && res[0] && res[0].ufsUrl) {
							setPreviewImage(res[0].ufsUrl)
						} else {
							toast.error('Image upload failed')
						}
					}}
				/>
				<div className=' inset-0 flex flex-col items-center justify-center pointer-events-none px-4 text-center'>
					<p className='mt-2 text-sm text-sky-300'>
						<b>Drop</b> your image here or <b>click to upload</b>
					</p>
					<p className='text-xs text-muted-foreground'>Max file size: 4MB</p>
				</div>
			</div>

			{/* Show upload button only if image selected */}
			{previewImage && (
				<Button
					onClick={uploadingNewImage}
					className='mt-4 flex items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold px-5 py-2 rounded-xl shadow-md transition-all duration-300 hover:brightness-110 hover:scale-[1.02] active:scale-95 focus:ring-2 focus:ring-offset-2 focus:ring-sky-400'
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-5 w-5'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						strokeWidth={2}
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12'
						/>
					</svg>
					Upload Image
				</Button>
			)}
		</div>
	)
}
