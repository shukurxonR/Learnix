import { getLessonById } from '@/actions/lesson-action'
import { translation } from '@/i18n/server'
import parse from 'html-react-parser'
import MobileCurri from './_components/mobile-curri'
import VideoComponent from './_components/video-component'
// import MobileCurri from './_components/mobile-curri'
interface Props {
	params: { lessonid: string; dashcourseid: string; lng: string }
}

async function page({ params: { lessonid, dashcourseid, lng } }: Props) {
	const { t } = await translation(lng)

	const lessonJSON = await getLessonById(lessonid)
	const lesson = JSON.parse(JSON.stringify(lessonJSON))

	return (
		<>
			<VideoComponent {...lesson} />

			<div className='rounded-md bg-gradient-to-b from-background to-secondary px-4 pb-4 mt-1 md:px-8 '>
				<h1 className='mb-2  font-space-grotesk text-xl font-medium  text-primary'>
					{t('usefullInformation')}
				</h1>
				<div className='prose max-w:none flex-1 dark:prose-invert'>
					{lesson.content && parse(lesson.content)}
				</div>
			</div>
			<div className='block lg:hidden'>
				<MobileCurri courseId={dashcourseid} lng={lng} />
			</div>
		</>
	)
}

export default page
