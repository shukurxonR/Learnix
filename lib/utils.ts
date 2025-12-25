import { ILesson } from '@/app.types'
import { enUS, ruRU, trTR } from '@clerk/localizations'
import { type ClassValue, clsx } from 'clsx'
import qs from 'query-string'
import { twMerge } from 'tailwind-merge'
import { uzUZ } from './uz-UZ'
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function localization(lng: string) {
	if (lng === 'en') return enUS
	if (lng === 'ru') return ruRU
	if (lng === 'tr') return trTR
	if (lng === 'uz') return uzUZ
}
export function getCurrentLng(lng: string) {
	if (lng === 'en') return 'English'
	if (lng === 'ru') return 'Русский'
	if (lng === 'tr') return 'Türkçe'
	if (lng === 'uz') return 'Ozbekcha'
}
interface formUrlQueryParams {
	params: string
	key: string
	value: string | null
	toCourses?: boolean
}

export function formUrlQuery({
	params,
	key,
	value,
	toCourses = false,
}: formUrlQueryParams) {
	const currentUrl = qs.parse(params)

	currentUrl[key] = value

	return qs.stringifyUrl(
		{
			url: toCourses
				? `/${window.location.pathname.split('/')[1]}/courses`
				: window.location.pathname,
			query: currentUrl,
		},
		{ skipNull: true }
	)
}

interface RemoveUrlQueryParams {
	params: string
	keysToRemove: string[]
}

export const removeKeysFromQuery = ({
	params,
	keysToRemove,
}: RemoveUrlQueryParams) => {
	const currentUrl = qs.parse(params)

	keysToRemove.forEach(key => {
		delete currentUrl[key]
	})

	return qs.stringifyUrl(
		{
			url: window.location.pathname,
			query: currentUrl,
		},
		{ skipNull: true }
	)
}

export const calculateTotalDuration = (lessons: ILesson[]) => {
	let totalMinutes = 0

	lessons.forEach(lesson => {
		totalMinutes +=
			lesson.duration.hours * 60 +
			lesson.duration.minutes +
			Math.round(lesson.duration.seconds / 60)
	})

	const totalHours = Math.floor(totalMinutes / 60)
	const remainingMinutes = totalMinutes % 60

	const formattedTotalDuration = `${totalHours}.${remainingMinutes
		.toString()
		.padStart(2, '0')}`

	return formattedTotalDuration
}
export const formatLessonTime = (lesson: ILesson) => {
	const duration = lesson.duration

	const totalSeconds =
		duration.hours * 3600 + duration.minutes * 60 + duration.seconds

	const hours = Math.floor(totalSeconds / 3600)
	const minutes = Math.floor((totalSeconds % 3600) / 60)
	const seconds = totalSeconds % 60

	const formattedTime = `${hours > 0 ? hours + ':' : ''}${
		minutes > 0 ? minutes + ':' : ''
	}${seconds.toString().padStart(2, '0')}`

	return formattedTime
}
export const formatAndDivideNumber = (num: number) => {
	if (num >= 1000000) {
		const formattedNum = (num / 1000000).toFixed(1)
		return `${formattedNum}M`
	} else if (num >= 1000) {
		const formattedNum = (num / 1000).toFixed(1)
		return `${formattedNum}K`
	} else {
		return num.toString()
	}
}
