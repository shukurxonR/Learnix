'use client'

import { setFlag } from '@/actions/review-action'
import { IReview } from '@/app.types'
import { cn } from '@/lib/utils'
import { formatDistanceStrict } from 'date-fns'
import { Flag } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import ReactStars from 'react-rating-stars-component'
import { toast } from 'sonner'
import FillLoading from '../shared/fill-loading'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'

function InstructorReviewCard({ review }: { review: IReview }) {
	const [isLoading, setIsLoading] = useState(false)
	const pathname = usePathname()

	function toggleFlag() {
		setIsLoading(true)
		const promise = setFlag(review._id, !review.isFlag, pathname).finally(() =>
			setIsLoading(false)
		)
		toast.promise(promise, {
			loading: 'Loading...',
			success: 'Successfully!',
			error: 'Something went wrong!',
		})
	}
	return (
		<div className='flex gap-4 border-b pb-4'>
			{isLoading && <FillLoading />}
			<div className='flex-1'>
				<div className='flex gap-3'>
					<Avatar>
						<AvatarImage src={review.user.picture} />
						<AvatarFallback className='uppercase'>
							{review.user.fullName[0]}
						</AvatarFallback>
					</Avatar>

					<div className='flex flex-col'>
						<div className='font-space-grotesk text-sm'>
							{review.user.fullName}
							<span className='text-xs text-muted-foreground'>
								{formatDistanceStrict(new Date(review.createdAt), new Date())}{' '}
								ago
							</span>
						</div>
						<ReactStars value={4.5} edit={false} />
						<div className='font-space-grotesk font-bold'>
							{review.course.title}
						</div>
						<p className='font-mono text-muted-foreground'>{review.data}</p>
					</div>
				</div>
			</div>
			<Button
				size={'icon'}
				variant={'ghost'}
				className='self-start'
				onClick={toggleFlag}
			>
				<Flag
					className={cn(
						'text-muted-foreground !size-5',
						review.isFlag && 'fill-white'
					)}
				/>
			</Button>
		</div>
	)
}

export default InstructorReviewCard
