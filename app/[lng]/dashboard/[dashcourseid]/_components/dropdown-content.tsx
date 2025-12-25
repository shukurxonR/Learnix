'use client'
import { addArchiveCourse, addFavoriteCourse } from '@/actions/course-action'
import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import useTranslate from '@/hooks/use-lng'
import { useReview } from '@/hooks/use-review'
import { useAuth } from '@clerk/nextjs'
import { FolderArchive, Heart, Share2, Star } from 'lucide-react'
import { useParams, usePathname } from 'next/navigation'
import { toast } from 'sonner'

function DropdownContent() {
	const pathname = usePathname()
	const t = useTranslate()
	const { onOpen } = useReview()
	const { dashcourseid } = useParams()
	const { userId } = useAuth()

	function onCopy() {
		const link = process.env.NEXT_PUBLIC_BASE_URL + pathname
		navigator.clipboard
			.writeText(link)
			.then(() => toast.success('Link copied to clipboard'))
	}

	function onAdd(type: 'favorite' | 'archive') {
		let promise
		if (type === 'archive') {
			promise = addArchiveCourse(userId!, `${dashcourseid}`)
		} else {
			promise = addFavoriteCourse(userId!, `${dashcourseid}`)
		}
		toast.promise(promise, {
			loading: 'Loading...',
			success: 'Successfully added' + ' ' + type + '!',
			error: 'Course Errored' + type + '!',
		})
	}

	return (
		<DropdownMenuContent className='w-[300px]'>
			<DropdownMenuItem
				className='cursor-pointer gap-2'
				onClick={() => onAdd('favorite')}
			>
				<Heart size={20} />
				<span>{t('favouriteCourse')}</span>
			</DropdownMenuItem>
			<DropdownMenuItem
				className='cursor-pointer gap-2'
				onClick={() => onAdd('archive')}
			>
				<FolderArchive size={20} />
				<span>{t('archiveCourse')}</span>
			</DropdownMenuItem>

			<DropdownMenuSeparator />

			<DropdownMenuItem
				className='cursor-pointer gap-2'
				onClick={() => onOpen()}
			>
				<Star size={20} />
				<span>{t('evaluation')}</span>
			</DropdownMenuItem>
			<DropdownMenuItem className='cursor-pointer gap-2' onClick={onCopy}>
				<Share2 size={20} />
				<span>{t('share')}</span>
			</DropdownMenuItem>

			<DropdownMenuSeparator />

			<DropdownMenuItem className='cursor-pointer gap-2 opacity-50'>
				{t('shareCourse')}
			</DropdownMenuItem>
		</DropdownMenuContent>
	)
}

export default DropdownContent
