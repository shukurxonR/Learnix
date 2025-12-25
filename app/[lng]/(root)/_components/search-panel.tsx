'use client'

import { Button } from '@/components/ui/button'
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils'
import { debounce } from 'lodash'
import { Search } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, useRef } from 'react'
function SearchPanel() {
	const inputRef = useRef<HTMLInputElement | null>(null)

	const handleFocus = () => {
		inputRef.current?.focus()
	}

	const pathname = usePathname()
	const searchParams = useSearchParams()
	const router = useRouter()

	function handleSearch(e: ChangeEvent<HTMLInputElement>) {
		const value = e.target.value
		const isCoursePage = pathname.split('/').includes('courses')
		if (value && value.length > 2) {
			const newUrl = formUrlQuery({
				params: searchParams.toString(),
				key: 'q',
				value: value,
				toCourses: isCoursePage ? false : true,
			})
			router.push(newUrl)
		} else {
			const newUrl = removeKeysFromQuery({
				params: searchParams.toString(),
				keysToRemove: ['q'],
			})
			router.push(newUrl)
		}
	}

	const searchDebounce = debounce(handleSearch, 300)

	return (
		<div className='search-box flex items-center gap-2'>
			<Button
				size={'icon'}
				variant={'ghost'}
				className='btn-search'
				onClick={handleFocus}
			>
				<Search className='!w-5 !h-5' />
			</Button>

			<input
				ref={inputRef}
				type='text'
				className='input-search'
				placeholder='Type to Search...'
				onChange={searchDebounce}
			/>
		</div>
	)
}

export default SearchPanel
