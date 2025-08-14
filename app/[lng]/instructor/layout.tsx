import { ChildProp } from '@/types'
// import Navbar from './_components/Navbar'
import Navbar from './_components/navbar'
import Sidebar from './_components/sidebar'

function layout({ children }: ChildProp) {
	return (
		<div>
			<Navbar />
			<Sidebar />
			<main className='w-full pt-[12vh] pl-[320px] p-4'>
				<div className='size-full rounded-md bg-secondary px-4 pb-4'>
					{children}
				</div>
			</main>
		</div>
	)
}

export default layout
