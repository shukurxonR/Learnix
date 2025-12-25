// import { ChildProps } from '@/types'
import { ChildProp } from '@/types'
import Navbar from './_components/navbar'

import ReviewModal from '@/components/modals/review-modal'
import Sidebar from './_components/sitebar'

interface Props extends ChildProp {
	params: { lng: string; dashcourseid: string }
}
function Layout({ params: { dashcourseid, lng }, children }: Props) {
	return (
		<div className='relative'>
			<Navbar />
			<div className='flex'>
				<Sidebar dashcourseid={dashcourseid} lng={lng} />
				<section className='flex min-h-screen flex-1 flex-col px-4 pb-6 pt-24 max-md:pb-14 sm:px-14'>
					<div className='mx-auto w-full max-w-5xl'>{children}</div>
				</section>
			</div>
			<ReviewModal />
		</div>
	)
}

export default Layout
