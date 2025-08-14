'use client'
import { ICourses } from '@/app.types'
import CoursesCard from '@/components/cards/courses-card'
import Pagination from '@/components/shared/pagination'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { courseLanguage, filterCourses, filterLevels } from '@/constants/const'
import useTranslate from '@/hooks/use-lng'
import { formUrlQuery } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
interface Props {
	result: {
		courses: ICourses[]
		isNext: boolean
		totalCourses: number
	}
}

function AllCourses({ result }: Props) {
	const t = useTranslate()
	const searchParams = useSearchParams()
	const router = useRouter()
	const page = searchParams.get('page')

	const onUpdateParams = (value: string) => {
		const newUrl = formUrlQuery({
			value,
			key: 'filter',
			params: searchParams.toString(),
		})
		router.push(newUrl)
	}

	return (
		<div className='container mx-auto mt-12 max-w-6xl px-4'>
			<div className='flex items-center justify-between max-md:flex-col max-md:items-start max-md:space-y-2'>
				<h2>
					{t('result1')}{' '}
					<span className='font-space-grotesk font-bold'>250</span>{' '}
					{t('result2')}
				</h2>
				<div className='flex items-center gap-2'>
					<span>{t('sortBy')}</span>

					<Select onValueChange={onUpdateParams}>
						<SelectTrigger className='w-[120px] bg-gradient-to-r from-secondary to-background'>
							<SelectValue placeholder={t('filter')} />
						</SelectTrigger>
						<SelectContent>
							{filterCourses.map(item => (
								<SelectItem value={item.name} key={item.name}>
									{t(item.label)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select onValueChange={onUpdateParams}>
						<SelectTrigger className='w-[120px] bg-gradient-to-l from-secondary to-background'>
							<SelectValue placeholder={t('level')} />
						</SelectTrigger>
						<SelectContent>
							{filterLevels.map(item => (
								<SelectItem value={item.name} key={item.name}>
									{t(item.label)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select onValueChange={onUpdateParams}>
						<SelectTrigger className='w-[120px] bg-gradient-to-l from-secondary to-background'>
							<SelectValue placeholder={t('language')} />
						</SelectTrigger>
						<SelectContent>
							{courseLanguage.map(item => (
								<SelectItem value={item} key={item} className='capitalize'>
									{item}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
				{result.courses.map(course => (
					<CoursesCard {...course} key={course.title} />
				))}
			</div>
			<Pagination pageNumber={page ? +page : 1} isNext={result.isNext} />
		</div>
	)
}

export default AllCourses
