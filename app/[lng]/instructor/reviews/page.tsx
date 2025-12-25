import { getReviews } from '@/actions/review-action'
import { searchParamsProps } from '@/app.types'
import InstructorReviewCard from '@/components/cards/instructor-reviews-card'
import Pagination from '@/components/shared/pagination'
import { Separator } from '@/components/ui/separator'
import { auth } from '@clerk/nextjs'
import Header from '../_components/header'

async function Page({ searchParams }: searchParamsProps) {
	const { userId } = auth()

	const { reviews, totalReviews, isNext } = await getReviews({
		clerkId: userId!,
		page: searchParams.page ? +searchParams.page : 1,
		pageSize: 3,
	})

	return (
		<>
			<Header
				title='Reviews'
				description='Here  your can see all the reviews for you courses'
			/>

			<div className='mt-4 rounded-md  bg-background p-4'>
				<h3 className='font-space-grotesk text-lg font-medium'>
					All Review {totalReviews}
				</h3>
				<Separator className='my-3' />
				<div className='flex flex-col gap-4'>
					{reviews.map(review => (
						<InstructorReviewCard
							key={review._id}
							review={JSON.parse(JSON.stringify(review))}
						/>
					))}
				</div>
				<Pagination
					pageNumber={searchParams.page ? +searchParams.page : 1}
					isNext={isNext}
				/>
			</div>
		</>
	)
}

export default Page
