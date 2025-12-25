// 'use client'
// import { IReview } from '@/app.types'
// import { formatDistanceStrict } from 'date-fns'
// import ReactStars from 'react-rating-stars-component'
// import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

// interface Props {
// 	review: IReview
// }
// function ReviewCard({ review }: Props) {
// 	return (
// 		<div className='mt-6 border-t border-t-secondary'>
// 			<div className='mt-8 flex gap-2'>
// 				<Avatar>
// 					<AvatarImage src={review.user.picture} />
// 					<AvatarFallback className='uppercase'>SB</AvatarFallback>
// 				</Avatar>

// 				<div className='flex flex-col'>
// 					<div>{review.user.fullName}</div>
// 					<div className='flex items-center gap-1'>
// 						<ReactStars
// 							count={5}
// 							value={review.rating}
// 							isHalf={true}
// 							edit={false}
// 							size={24}
// 							activeColor='#facc15'
// 						/>
// 						<p className='text-sm opacity-50'>
// 							{formatDistanceStrict(new Date(review.createdAt), new Date()) +
// 								' ago'}
// 						</p>
// 					</div>
// 				</div>
// 			</div>

// 			<div className='mt-2'>{review.data}</div>
// 		</div>
// 	)
// }

// export default ReviewCard
'use client'
import { IReview } from '@/app.types'
import { formatDistanceStrict } from 'date-fns'
import ReactStars from 'react-rating-stars-component'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

interface Props {
	review: IReview
}

function ReviewCard({ review }: Props) {
	return (
		<div className='w-full max-w-sm bg-[#0f172a] border border-gray-700 p-4 rounded-xl shadow-sm'>
			{/* User info */}
			<div className='flex items-center gap-3'>
				<Avatar className='h-10 w-10'>
					<AvatarImage src={review.user.picture} />
					<AvatarFallback className='uppercase font-bold'>
						{review.user.fullName[0]}
					</AvatarFallback>
				</Avatar>
				<div>
					<p className='font-medium text-white'>{review.user.fullName}</p>
					<p className='text-xs text-gray-400'>
						{formatDistanceStrict(new Date(review.createdAt), new Date())} ago
					</p>
				</div>
			</div>

			{/* Rating */}
			<div className='mt-3'>
				<ReactStars
					count={5}
					value={review.rating}
					isHalf={true}
					edit={false}
					size={20}
					activeColor='#facc15'
				/>
			</div>

			{/* Review text */}
			<p className='mt-3 font-space-grotesk  text-blue-100 '>“{review.data}”</p>
		</div>
	)
}

export default ReviewCard
