'use server'
import { ICourses, ILesson } from '@/app.types'
import Course from '@/database/course-model'
import Lesson from '@/database/lesson-model'
import Section from '@/database/section.model'
import User from '@/database/user.model'
import { connectToDatabase } from '@/lib/mongoose'
import { calculateTotalDuration } from '@/lib/utils'
import { FilterQuery } from 'mongoose'
import { revalidatePath } from 'next/cache'
import { cache } from 'react'
import { GetAllCoursesParams, GetCoursesParams, ICreateCourse } from './types'

export const createCourse = async (data: ICreateCourse, clerkId: string) => {
	try {
		await connectToDatabase()
		const user = await User.findOne({ clerkId })
		await Course.create({ ...data, instructor: user._id })
		revalidatePath('/en/instructor/my-courses')
	} catch (e) {
		throw new Error(`Something went wrong while creating course! ${e}`)
	}
}

export const getCourses = async (params: GetCoursesParams) => {
	try {
		await connectToDatabase()
		const { clerkId, page = 1, pageSize = 3 } = params

		const skipAmount = (page - 1) * pageSize

		const user = await User.findOne({ clerkId })

		const courses = await Course.find({ instructor: user._id })
			.skip(skipAmount)
			.limit(pageSize)

		const totalCourses = await Course.find({
			instructor: user._id,
		}).countDocuments()

		const isNext = totalCourses > skipAmount + courses.length

		return { courses, isNext, totalCourses }
	} catch {
		throw new Error('HAtooooooooooo!')
	}
}

export const getCourseById = async (id: string) => {
	try {
		await connectToDatabase()
		const course = await Course.findById(id)
		return course as ICourses
	} catch {
		throw new Error('HAtooooooooooo!')
	}
}
export const deleteCourseById = async (id: string, path: string) => {
	try {
		await connectToDatabase()
		await Course.findByIdAndDelete(id)
		revalidatePath(path)
	} catch {
		throw new Error('HAtooooooooooo!')
	}
}
export const updateCourseById = async (
	id: string,
	updateData: Partial<ICourses>,
	path: string
) => {
	try {
		await connectToDatabase()
		await Course.findByIdAndUpdate(id, updateData)
		revalidatePath(path)
	} catch {
		throw new Error('HAtooooooooooo!')
	}
}

export const getFeaturedCourses = async () => {
	try {
		await connectToDatabase()
		const publishedCourses = await Course.find({ published: true })
			.limit(6)
			.sort({ createdAt: -1 })
			.select('previewImage title slug oldPrice currentPrice instructor')
			.populate({ path: 'instructor', select: 'fullName picture', model: User })

		return publishedCourses
	} catch {
		throw new Error('HAtooooooooooo!')
	}
}

export const getDetailedCourse = cache(async (id: string) => {
	try {
		await connectToDatabase()

		const course = await Course.findById(id)
			.select(
				'title description instructor previewImage oldPrice currentPrice learning requirements tags updatedAt level category language'
			)
			.populate({
				path: 'instructor',
				select: 'fullName picture',
				model: User,
			})

		const sections = await Section.find({ course: id }).populate({
			path: 'lessons',
			model: Lesson,
		})

		const totalLessons: ILesson[] = sections
			.map(section => section.lessons)
			.flat()

		const data = {
			...course._doc,
			totalLessons: totalLessons.length,
			totalSections: sections.length,
			totalDuration: calculateTotalDuration(totalLessons),
		}

		return data
	} catch (error) {
		throw new Error(
			`Something went wrong while getting detailed course -> ${error}`
		)
	}
})

export const getAllCourses = async (params: GetAllCoursesParams) => {
	try {
		await connectToDatabase()
		const { page = 1, pageSize = 3, filter, searchQuery } = params

		const skipAmount = (page - 1) * pageSize

		let sortOptions = {}

		const query: FilterQuery<typeof Course> = {}

		if (searchQuery) {
			query.$or = [{ title: { $regex: new RegExp(searchQuery, 'i') } }]
		}

		switch (filter) {
			case 'newest':
				sortOptions = { createdAt: -1 }
				break
			case 'poular':
				sortOptions = { students: -1 }
				break
			case 'lowest-price':
				sortOptions = { currentPrice: 1 }
				break
			case 'highest-price':
				sortOptions = { currentPrice: -1 }
				break
			case 'english':
				query.language = 'english'
				break
			case 'uzbek':
				query.language = 'uzbek'
				break
			case 'turkish':
				query.language = 'turkish'
				break
			case 'russian':
				query.language = 'russian'
				break
			case 'beginner':
				query.level = 'beginner'
				break
			case 'intermediate':
				query.level = 'intermediate'
				break
			case 'advanced':
				query.level = 'advanced'
				break
			default:
				break
		}

		const courses = await Course.find(query)
			.select('title previewImage slug _id oldPrice currentPrice instructor ')
			.populate({
				path: 'instructor',
				select: 'fullName picture',
				model: User,
			})
			.skip(skipAmount)
			.limit(pageSize)
			.sort(sortOptions)

		const totalCourses = await Course.find({ published: true }).countDocuments()
		const allCourses = await Course.countDocuments(query)
		const isNext = allCourses > skipAmount + courses.length

		return { courses, isNext, totalCourses }
	} catch (err) {
		throw new Error(`Hatolik ${err}`)
	}
}
