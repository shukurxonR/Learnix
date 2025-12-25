'use server'

import { IReview } from '@/app.types'
import Course from '@/database/course-model'
import Review from '@/database/review-model'
import User from '@/database/user.model'
import { connectToDatabase } from '@/lib/mongoose'
import { revalidatePath } from 'next/cache'
import { getReviewParams } from './types'

export async function createReview(
	clerkId: string,
	course: string,
	data: Partial<IReview>
) {
	try {
		await connectToDatabase()
		const user = await User.findOne({ clerkId })
		await Review.create({ user: user._id, course, ...data })
	} catch (err) {
		throw new Error(`${err}`)
	}
}

export async function getReview(clerkId: string, course: string) {
	try {
		await connectToDatabase()
		const user = await User.findOne({ clerkId })

		const review = await Review.findOne({ user: user._id, course })
		return JSON.parse(JSON.stringify(review))
	} catch (err) {
		throw new Error(`${err}`)
	}
}

export async function updateReview(_id: string, data: Partial<IReview>) {
	try {
		await connectToDatabase()
		await Review.findByIdAndUpdate(_id, { ...data })
	} catch (err) {
		throw new Error(`${err}`)
	}
}

export async function getReviews(params: getReviewParams) {
	try {
		await connectToDatabase()
		const { page = 1, pageSize = 3, clerkId } = params

		const skipAmount = (page - 1) * pageSize

		const user = await User.findOne({ clerkId })
		const courses = await Course.find({ instructor: user._id })

		const reviews = await Review.find({ course: { $in: courses } })
			.sort({
				createdAt: -1,
			})
			.populate({ path: 'user', model: User, select: 'fullName picture' })
			.populate({ path: 'course', model: Course, select: 'title' })
			.skip(skipAmount)
			.limit(pageSize)

		const totalReviews = await Review.find({
			course: { $in: courses },
		}).countDocuments()

		const isNext = totalReviews > skipAmount + reviews.length

		return { reviews, isNext, totalReviews }
	} catch (error) {
		throw new Error(`error ${error}`)
	}
}

export async function setFlag(_id: string, isFlag: boolean, path: string) {
	try {
		await connectToDatabase()
		await Review.findByIdAndUpdate(_id, { isFlag })
		revalidatePath(path)
	} catch (err) {
		throw new Error(`${err}`)
	}
}
