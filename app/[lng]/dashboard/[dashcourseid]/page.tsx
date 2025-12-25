import { getLastLesson } from '@/actions/lesson-action'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

interface Props {
	params: { dashcourseid: string; lng: string }
}

async function Page({ params: { dashcourseid, lng } }: Props) {
	const { userId } = auth()
	const { lessonId, sectionId } = await getLastLesson(userId!, dashcourseid)
	return redirect(
		`/${lng}/dashboard/${dashcourseid}/${lessonId}?s=${sectionId}`
	)
}

export default Page
