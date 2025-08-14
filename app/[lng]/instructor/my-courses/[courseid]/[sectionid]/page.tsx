import { getLessons } from '@/actions/lesson-action'
import { getSectionById } from '@/actions/section-action'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Settings, Settings2 } from 'lucide-react'
import Link from 'next/link'
import Header from '../../../_components/header'
import Action from './_components/action'
import Lessons from './_components/lessons'
import SectionField from './_components/section-field'

interface Props {
	params: { sectionid: string; courseid: string }
}
async function page({ params }: Props) {
	const SectionJSON = await getSectionById(params.sectionid)
	const lessonsJSON = await getLessons(params.sectionid)

	const section = JSON.parse(JSON.stringify(SectionJSON))
	const lessons = JSON.parse(JSON.stringify(lessonsJSON))

	return (
		<>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<Link href={`/en/instructor/my-courses/${params.courseid}`}>
						<Button size={'icon'} variant={'link'}>
							<ArrowLeft className='!size-7' />
						</Button>
					</Link>

					<Header
						title={section.title}
						description='Manage your section and see how it is performing.'
					/>
				</div>
				<Action {...section} />
			</div>
			<Separator className='my-3 bg-muted-foreground' />
			<div className='grid grid-cols-2 gap-4'>
				<div className='flex flex-col space-y-2'>
					<div className='flex items-center gap-2'>
						<span className='font-space-grotesk text-3xl font-medium'>
							Lessons
						</span>{' '}
						<Settings2 />
					</div>
					<Lessons section={section} lessons={lessons} />
				</div>
				<div className='flex flex-col space-y-2'>
					<div className='flex items-center gap-2'>
						<span className='font-space-grotesk text-3xl font-medium'>
							Section field
						</span>{' '}
						<Settings />
					</div>
					<SectionField {...section} />
				</div>
			</div>
		</>
	)
}

export default page
