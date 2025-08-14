import { authMiddleware } from '@clerk/nextjs'
import createMiddleware from 'next-intl/middleware'

const intlMiddleware = createMiddleware({
	locales: ['en', 'ru', 'uz', 'tr'],
	defaultLocale: 'en',
})

export default authMiddleware({
	beforeAuth: req => intlMiddleware(req),
	publicRoutes: [
		'/:lng',
		'/:lng/courses',
		'/:lng/courses:slug',
		'/:lng/blogs',
		'/:lng/blogs/:slug',
		'/:lng/instructor/create-course',
		'/:lng/instructor/my-course',
		'/:lng/instructor/my-course/:courseid',
		'/:lng/instructor/dashboard',
		'/:lng/instructor/reviews',
		'/:lng/instructor/settings',
		'/:lng/instructor',
		'/:lng/api/uploadthing',
	],
	ignoredRoutes: ['/en/api/webhook'],
})

export const config = {
	matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
