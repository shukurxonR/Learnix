'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'

export default function SiteAccessGate({
	children,
}: {
	children: React.ReactNode
}) {
	const [hasAccess, setHasAccess] = useState(false)
	const [open, setOpen] = useState(true)
	const [code, setCode] = useState('')
	const [error, setError] = useState('')

	const CORRECT_CODE = '12345678'

	useEffect(() => {
		const saved = localStorage.getItem('siteAccess')
		if (saved === 'true') {
			setHasAccess(true)
			setOpen(false)
		}
	}, [])

	const handleSubmit = () => {
		if (code === CORRECT_CODE) {
			localStorage.setItem('siteAccess', 'true')
			setHasAccess(true)
			setOpen(false)
			setError('')
		} else {
			setError('❌ Kod noto‘g‘ri!')
		}
	}

	// Kod tekshirilmaguncha hech narsani ko‘rsatmaymiz
	if (!hasAccess && !open) return null

	return (
		<>
			{hasAccess && children}
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Saytga kirish uchun kodni kiriting</DialogTitle>
					</DialogHeader>
					<div className='flex flex-col gap-3'>
						<Input
							placeholder='Kodni kiriting'
							value={code}
							onChange={e => setCode(e.target.value)}
						/>
						{error && <p className='text-red-500 text-sm'>{error}</p>}
						<Button onClick={handleSubmit}>Tasdiqlash</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
}
