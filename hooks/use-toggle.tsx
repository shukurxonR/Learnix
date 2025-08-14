'use client'
import { useState } from 'react'

function useToggleEdit() {
	const [isEdit, setIsEdit] = useState(false)

	const onToggle = () => setIsEdit(prev => !prev)
	return { isEdit, onToggle }
}

export default useToggleEdit
