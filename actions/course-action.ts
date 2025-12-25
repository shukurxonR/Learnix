'use server'
import { ICourses, ILesson } from '@/app.types'
import Course from '@/database/course-model'
import Lesson from '@/database/lesson-model'
import Purchase from '@/database/purchase-model'
import Section from '@/database/section.model'

import UserProgress from '@/database/user-progress-model'
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
			.skip(skipAmount) // bu yerda otkazib yuboriladigan curslar
			.limit(pageSize) // bu esa nechta olsin

		const totalCourses = await Course.find({
			instructor: user._id,
		}).countDocuments()

		const isNext = totalCourses > skipAmount + courses.length

		const allCourses = await Course.find({ instructor: user._id })
			.select('purchases currentPrice')
			.populate({
				path: 'purchases',
				model: Purchase,
				select: 'course',
				populate: {
					path: 'course',
					model: Course,
					select: 'currentPrice',
				},
			})

		const totalStudents = allCourses
			.map(c => c.purchases.length)
			.reduce((a, b) => a + b, 0)

		const totalEearnings = allCourses
			.map(c => c.purchases)
			.flat()
			.map(p => p.course.currentPrice)
			.reduce((a, b) => a + b, 0)

		return { courses, isNext, totalCourses, totalStudents, totalEearnings }
	} catch (error) {
		throw new Error(`Hato! ${error}`)
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
	} catch (err) {
		console.log('HAtolik', err, '<-')
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
//  /courses
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

		const totalCourses = await Course.find(query).countDocuments()

		const isNext = totalCourses > skipAmount + courses.length

		return { courses, isNext, totalCourses }
	} catch (err) {
		throw new Error(`Hatolik ${err}`)
	}
} /////////////////////////////////////////////

export const purchaseCourse = async (course: string, clerkId: string) => {
	try {
		await connectToDatabase()
		const user = await User.findOne({ clerkId })

		const checkCourse = await Course.findById(course)
			.select('purchases')
			.populate({
				path: 'purchases',
				model: Purchase,
				match: { user: user._id },
			})

		if (checkCourse.purchases.length > 0) {
			return JSON.parse(JSON.stringify({ status: 200 }))
		}

		const purchase = await Purchase.create({ user: user._id, course })
		await Course.findByIdAndUpdate(course, {
			$push: { purchases: purchase._id },
		})

		return JSON.parse(JSON.stringify({ status: 200 }))
	} catch (err) {
		throw new Error(`Hatolik ${err}`)
	}
}

export async function getDashboardCourse(clerkId: string, courseid: string) {
	try {
		await connectToDatabase()
		const course = await Course.findById(courseid).select('title')

		const sections = await Section.find({ course: courseid })
			.select('title')
			.sort({ position: 1 })
			.populate({
				path: 'lessons',
				model: Lesson,
				select: 'title userProgress',
				options: { sort: { position: 1 } },
				populate: {
					path: 'userProgress',
					match: { userId: clerkId },
					model: UserProgress,
					select: 'lessonId',
				},
			})

		const lessons = sections.map(section => section.lessons).flat()
		const lessonIds = lessons.map(lesson => lesson._id)

		const validCompletedLessons = await UserProgress.find({
			userId: clerkId,
			lessonId: { $in: lessonIds },
			isCompleted: true,
		})

		const progressPercentage =
			(validCompletedLessons.length / lessons.length) * 100

		return { course, sections, progressPercentage }
	} catch (err) {
		throw new Error(`Hatolik ${err}`)
	}
}

export async function completeLesson(
	lessonId: string,
	userId: string,
	path: string
) {
	try {
		await connectToDatabase()
		const userProgress = await UserProgress.findOne({ userId, lessonId })
		if (userProgress) {
			userProgress.isCompleted = true
			await userProgress.save()
		} else {
			const newUserProgress = new UserProgress({
				userId,
				lessonId,
				isCompleted: true,
			})

			const lesson = await Lesson.findById(lessonId)
			lesson.userProgress.push(newUserProgress._id)

			await lesson.save()
			await newUserProgress.save()
		}
		revalidatePath(path)
	} catch (err) {
		throw new Error(`Hatolik ${err}`)
	}
}

export async function uncompleteLesson(lessonId: string, path: string) {
	try {
		await connectToDatabase()
		await UserProgress.findOneAndDelete({ lessonId })

		revalidatePath(path)
	} catch (err) {
		throw new Error(`Hatolik ${err}`)
	}
}

export async function addArchiveCourse(clerkId: string, courseId: string) {
	try {
		await connectToDatabase()
		const isArchive = await User.findOne({
			clerkId,
			archiveCourses: courseId,
		})
		if (isArchive) {
			throw new Error('Hatolik')
		}

		const user = await User.findOne({ clerkId })
		await User.findByIdAndUpdate(user._id, {
			$push: { archiveCourses: courseId },
		})
	} catch (err) {
		throw new Error(`Hatolik ${err}`)
	}
}
export async function addFavoriteCourse(clerkId: string, courseId: string) {
	try {
		await connectToDatabase()
		const favorited = await User.findOne({
			clerkId,
			favouriteCourses: courseId,
		})
		if (favorited) {
			throw new Error('eooe archive topilmadi')
		}

		const user = await User.findOne({ clerkId })
		await User.findByIdAndUpdate(user._id, {
			$push: { favouriteCourses: courseId },
		})
	} catch (err) {
		throw new Error(`Hatolik ${err}`)
	}
}
