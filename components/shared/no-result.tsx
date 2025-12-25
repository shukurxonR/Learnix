interface Props {
	title: string
	description: string
}

function NoResult({ title, description }: Props) {
	return (
		<div className='w-full mt-10 flex flex-col items-center justify-center'>
			<h2 className='mt-8 font-space-grotesk text-2xl font-bold'>{title}</h2>
			<p className='max-w-md text-center my-3.5'>{description}</p>
		</div>
	)
}

export default NoResult
