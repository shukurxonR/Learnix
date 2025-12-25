import { ISection } from '@/app.types'
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { calculateTotalDuration } from '@/lib/utils'
import { ChevronsUpDown, Dot } from 'lucide-react'
import LessonList from './lesson-list'

function SectionList(section: ISection) {
	return (
		<AccordionItem
			value={section.title}
			className='rounded-lg border border-border bg-primary/10 mb-3 overflow-hidden'
		>
			<AccordionTrigger className='flex w-full items-center justify-between px-4 py-4 text-left hover:bg-primary/20 bg-primary/10 transition'>
				<div className='flex items-center gap-3'>
					<ChevronsUpDown
						className='size-4 text-muted-foreground'
						strokeWidth={1.75}
					/>
					<span className='text-sm font-semibold text-white'>
						{section.title}
					</span>
				</div>
				<div className='hidden items-center gap-1 text-xs text-muted-foreground md:flex'>
					<span>{section.lessons.length} ta darslik</span>
					<Dot className='size-4' />
					<span>{calculateTotalDuration(section.lessons)} soat</span>
				</div>
			</AccordionTrigger>
			<AccordionContent className=' px-5 pb-4'>
				<div className='ml-2 mt-3 border-l border-muted pl-4 space-y-2'>
					{section.lessons.map(lesson => (
						<LessonList key={lesson._id} {...lesson} />
					))}
				</div>
			</AccordionContent>
		</AccordionItem>
	)
}

export default SectionList
