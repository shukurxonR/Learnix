'use client'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import useTranslate from '@/hooks/use-lng'
import { SignOutButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu'
function UserBox() {
	const { user } = useUser()
	const t = useTranslate()
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar className='size-9 max-md:size-10'>
					<AvatarImage src={user?.imageUrl} />
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className=' w-64 '
				align='end'
				alignOffset={11}
				forceMount
			>
				<div className='flex flex-col space-y-4 p-2'>
					<p className='font-mono text-xs  leading-none text-muted-foreground'>
						{user?.emailAddresses[0].emailAddress}
					</p>

					<div className='flex items-center gap-x-2'>
						<div className='rounded-full bg-secondary p-1'>
							<Avatar className='size-8'>
								<AvatarImage src={user?.imageUrl} />
							</Avatar>
						</div>

						<div className=''>
							<p className='line-clamp-1 text-sm'>{user?.fullName}</p>
						</div>
					</div>
				</div>

				<DropdownMenuSeparator />
				<div className='flex flex-col gap-2'>
					<Link href={'/user-profile'} className='cursor-pointer'>
						<DropdownMenuItem className='w-full cursor-pointer  font-space-grotesk'>
							{t('manageAccount')}
						</DropdownMenuItem>
					</Link>
					<Link href={'/instructor'} className='cursor-pointer'>
						<DropdownMenuItem className='w-full cursor-pointer  font-space-grotesk'>
							Insructor
						</DropdownMenuItem>
					</Link>
					<DropdownMenuItem
						asChild
						className='w-full bg-secondary  cursor-pointer'
					>
						<SignOutButton>{t('logout')}</SignOutButton>
					</DropdownMenuItem>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default UserBox
