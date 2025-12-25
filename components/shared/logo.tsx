import Image from 'next/image'
import Link from 'next/link'

function Logo() {
	return (
		<Link href={'/'} className='flex items-center '>
			<Image
				src={'/logp.png'}
				alt='logo'
				width={80}
				height={80}
				className='rounded-full'
			/>
			<h1 className=' font-roboto text-3xl font-bold '>Learnix </h1>
		</Link>
	)
}

export default Logo
