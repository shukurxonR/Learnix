'use server'

import { ILesson } from '@/app.types'
import Lesson from '@/database/lesson-model'
import Section from '@/database/section.model'
import UserProgress from '@/database/user-progress-model'
import { connectToDatabase } from '@/lib/mongoose'
import { revalidatePath } from 'next/cache'
import { ICreateLesson, ILessonFields, IUpdatePosition } from './types'

export const createLesson = async ({
	lesson,
	section,
	path,
}: ICreateLesson) => {
	try {
		await connectToDatabase()
		const duration = {
			hours: Number(lesson.hours),
			minutes: Number(lesson.minutes),
			seconds: Number(lesson.seconds),
		}
		const existSection = await Section.findById(section)
		const position = existSection.lessons.length
		const newLesson = await Lesson.create({
			...lesson,
			position,
			duration,
			section,
		})
		existSection.lessons.push(newLesson._id)
		existSection.save()
		revalidatePath(path)
	} catch (error) {
		throw new Error(`Something went wrong! ${error}`)
	}
}
export async function editLesson(
	lesson: ILessonFields,
	lessonId: string,
	path: string
) {
	try {
		await connectToDatabase()
		const duration = {
			hours: Number(lesson.hours),
			minutes: Number(lesson.minutes),
			seconds: Number(lesson.seconds),
		}
		await Lesson.findByIdAndUpdate(lessonId, { ...lesson, duration })
		revalidatePath(path)
	} catch (error) {
		throw new Error(`Something went wrong! ${error}`)
	}
}
export const getLessons = async (section: string) => {
	try {
		await connectToDatabase()
		const lesson = await Lesson.find({ section }).sort({ position: 1 })
		return lesson
	} catch (err) {
		throw new Error(`xmmmxmx ${err}`)
	}
}
export async function deleteLessonById(id: string, path: string) {
	try {
		await connectToDatabase()
		await Lesson.findByIdAndDelete(id)
		revalidatePath(path)
	} catch (error) {
		throw new Error(`Something went wrong! ${error}`)
	}
}
export const editLessonPosition = async (params: IUpdatePosition) => {
	try {
		await connectToDatabase()
		const { lists, path } = params
		for (const item of lists) {
			await Lesson.findByIdAndUpdate(item._id, { position: item.position })
		}

		revalidatePath(path)
	} catch (error) {
		throw new Error(`Something went wrong! ${error}`)
	}
}

export async function getLessonById(lessonid: string) {
	try {
		await connectToDatabase()
		return await Lesson.findById(lessonid).select('title content videoUrl')
	} catch (error) {
		throw new Error(`Something went wrong! ${error}`)
	}
}

export async function getNextLesson(lessonid: string, courseid: string) {
	try {
		await connectToDatabase()
		const sections = await Section.find({ course: courseid }).populate({
			path: 'lessons',
			options: { sort: { position: 1 } },
			model: Lesson,
		})

		const lessons: ILesson[] = sections.map(section => section.lessons).flat()
		const lessonIndex = lessons.findIndex(
			item => item._id.toString() === lessonid
		)
		if (lessonIndex === lessons.length - 1) {
			return null
		}

		const nextLesson = lessons[lessonIndex + 1]

		const section = await Section.findOne({ lessons: nextLesson._id })

		return {
			lessonId: nextLesson._id.toString(),
			sectionId: section._id.toString(),
		}
	} catch (error) {
		throw new Error(`Something went wrong! ${error}`)
	}
}

export const getLastLesson = async (clerkId: string, courseId: string) => {
	try {
		await connectToDatabase()

		const sections = await Section.find({ course: courseId })
			.select('lessons')
			.sort({ position: 1 })
			.populate({
				path: 'lessons',
				model: Lesson,
				select: 'userProgress',
				options: { sort: { position: 1 } },
			})

		const lessons: ILesson[] = sections.map(section => section.lessons).flat()

		const userProgress = await UserProgress.find({
			userId: clerkId,
			lessonId: { $in: lessons.map(lesson => lesson._id) },
			isCompleted: true,
		}).sort({ createdAt: -1 })

		const lastLesson = userProgress[userProgress.length - 1]

		if (!lastLesson) {
			return {
				sectionId: sections[0]._id.toString(),
				lessonId: sections[0].lessons[0]._id.toString(),
			}
		}

		const section = await Section.findOne({ lessons: lastLesson.lessonId })

		return {
			lessonId: lastLesson.lessonId.toString(),
			sectionId: section._id.toString(),
		}
	} catch (error) {
		throw new Error(`Something went wrong! ${error}`)
	}
}
