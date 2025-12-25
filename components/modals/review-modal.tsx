'use client'
import { createReview, getReview, updateReview } from '@/actions/review-action'
import { IReview } from '@/app.types'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useReview } from '@/hooks/use-review'
import { reviewSchema } from '@/lib/validation'
import { useAuth } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import ReactStars from 'react-rating-stars-component'
import { toast } from 'sonner'
import z from 'zod'
import FillLoading from '../shared/fill-loading'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Textarea } from '../ui/textarea'

function ReviewModal() {
	const { isOpen, onClose, isLoading, startLoading, endLoading } = useReview()
	const [rating, setRating] = useState(0)
	const { userId } = useAuth()
	const { dashcourseid } = useParams()
	const [review, setReview] = useState<IReview | null>(null)

	async function fetchReview() {
		startLoading()
		const res = await getReview(userId!, `${dashcourseid}`).catch(ee =>
			console.log(ee)
		)
		if (res) {
			setReview(res)
			setRating(res.rating)
			form.setValue('data', res.data)
		}
		endLoading()
	}
	useEffect(() => {
		fetchReview()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen])

	const form = useForm<z.infer<typeof reviewSchema>>({
		resolver: zodResolver(reviewSchema),
		defaultValues: {
			data: '',
		},
	})

	function onSubmit(values: z.infer<typeof reviewSchema>) {
		const data = { ...values, rating }
		startLoading()
		let promise
		if (review) {
			promise = updateReview(review._id, data)
		} else {
			promise = createReview(userId!, `${dashcourseid}`, data)
		}
		promise.then(() => onClose()).finally(() => endLoading())

		toast.promise(promise, {
			loading: 'Loading...',
			success: 'Successfully !',
			error: 'Something went wrong!',
		})
	}

	return (
		<>
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent>
					<div className='flex flex-col items-center justify-center '>
						{isLoading && <FillLoading />}

						<div className='mt-4 font-space-grotesk text-xl font-medium'>
							{review
								? "Fikringizni o'zgartirishingiz mumkin"
								: rating
								? 'Nega bunday baho berdingiz?'
								: 'Ushbu kursni qanday baholaysiz?'}
						</div>

						<ReactStars
							value={rating}
							size={50}
							onChange={val => setRating(val)}
							activeColor='#E59819'
						/>
						{rating ? (
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className='flex w-full flex-col gap-4'
								>
									<FormField
										control={form.control}
										name='data'
										render={({ field }) => (
											<FormItem className='flex w-full flex-col'>
												<FormControl>
													<Textarea
														disabled={isLoading}
														className='h-24 resize-none border-none bg-secondary font-medium'
														placeholder='Ushbu kurs haqida qanday fikrda ekanligingizni bizga ayting. U sizga mos keldimi?'
														{...field}
													/>
												</FormControl>
												<FormMessage className='text-red-500' />
											</FormItem>
										)}
									></FormField>

									<div className='flex justify-end'>
										<Button
											type='submit'
											disabled={isLoading}
											className='font-space-grotesk font-bold'
										>
											{review ? "O'zgartirish" : 'Tasdiqlash'}
										</Button>
									</div>
								</form>
							</Form>
						) : null}
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
}

export default ReviewModal
