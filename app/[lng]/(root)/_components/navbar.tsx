'use client'
import LanguageMenu from '@/components/shared/lng-menu'
import Logo from '@/components/shared/logo'
import UserBox from '@/components/shared/user-box'
import { Button } from '@/components/ui/button'
// import { navLinks } from '@/constants/const'
import useTranslate from '@/hooks/use-lng'
import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs'

import ModeToggle from '@/components/shared/mode-toggle'
import { navLinks } from '@/constants/const'
import { cn } from '@/lib/utils'
import { LogIn, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import MobileMenu from './mobile'
import SearchPanel from './search-panel'

function NavBar() {
	const t = useTranslate()
	const { lng } = useParams()
	const pathname = usePathname()

	return (
		<div className='fixed inset-0 z-40 h-20 bg-background/70 backdrop-blur-xl'>
			<div className='container mx-auto flex h-full max-w-7xl items-center justify-between border-b  px-4'>
				<div className='flex items-center gap-6'>
					<Logo />
					<div className='md:flex items-center gap-3 border-l-2 hidden pl-2'>
						{navLinks.map(page => (
							<Link href={`/${page.route}`} key={page.route} className='br-2'>
								<span
									className={cn(
										'font-space-grotesk font-bold hover:underline hover:text-blue-400',
										pathname === `/${lng}/${page.route}` && `text-blue-500`
									)}
								>
									{t(page.name)}
								</span>
							</Link>
						))}
					</div>
				</div>
				<div className='flex items-center lg:gap-4'>
					<div className='hidden lg:flex  items-center lg:border-r-2 lg:pr-2'>
						<SearchPanel />
						<Button
							variant={'ghost'}
							className='md:h-11 md:w-11 py-2 rounded-sm px-3 text-xs '
						>
							<ShoppingCart className='!w-5 !h-5' />
						</Button>
						<LanguageMenu />
						<div className='mx-4'>
							<ModeToggle />
						</div>
					</div>

					<div className='flex lg:hidden items-center pr-2'>
						<MobileMenu />
						<ModeToggle />
					</div>
					{/*  */}
					<SignedIn>
						<UserBox />
					</SignedIn>
					<SignedOut>
						<div className='lg:flex items-center gap-2 hidden'>
							<SignInButton mode='modal'>
								<Button
									size={'lg'}
									variant={'outline'}
									className='rounded-full '
								>
									{t('logIn')}
								</Button>
							</SignInButton>
							<SignUpButton mode='modal'>
								<Button
									size={'lg'}
									className='bg-indigo-600 text-white hover:bg-blue-500 rounded-full'
								>
									{t('signUp')}
								</Button>
							</SignUpButton>
						</div>
						<div className='lg:hidden'>
							<SignInButton mode='modal'>
								<Button
									className='flex items-center justify-between w-full duration-200 group'
									variant={'outline'}
									size={'sm'}
								>
									<span className='font-medium'> {t('logIn')}</span>
									<LogIn className=' group-hover:translate-x-1 transition-transform duration-200' />
								</Button>
							</SignInButton>
						</div>
					</SignedOut>
				</div>
			</div>
		</div>
	)
}

export default NavBar
