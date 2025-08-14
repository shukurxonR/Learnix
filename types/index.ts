import React from 'react'

export interface ChildProp {
	children: React.ReactNode
}
export interface ICourse {
	title: string
	previewImage?: string
	level: string
	author: {
		image: string
		name: string
	}
	oldPrice: number
	currentPrice: number
}
export interface IInstructor {
	name: string
	job: string
	image: string
}
// Blogs
export type IBlog = {
	title: string
	description: string
	createdAt: string
	slug: string
	image: { url: string }
	content: { html: string }
	//
	author: IAuthor
	category: ICategory
	tag: ITag
}
export interface IAuthor {
	name: string
	bio: string
	slug: string
	image: { url: string }
}
export interface ICategory {
	name: string
	slug: string
	image: { url: string }
}
export interface ITag {
	name: string
	slug: string
} //

export interface LngParams {
	params: { lng: string; slug: string }
}
