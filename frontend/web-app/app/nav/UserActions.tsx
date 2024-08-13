'use client'

import { useParamsStore } from '@/hooks/useParamsStore'
import { Button, Dropdown, DropdownDivider, DropdownItem } from 'flowbite-react'
import { User } from 'next-auth'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { AiFillCar, AiFillTrophy, AiOutlineLogout } from 'react-icons/ai'
import { HiCog, HiUser } from 'react-icons/hi2'

type Props = {
  user: User
}

export default function UserActions({user}: Props) {
  const setParams = useParamsStore(state => state.setParams);
  const router = useRouter();
  const pathname = usePathname();

  function setWinner() {
    setParams({winner: user.username, seller: undefined});
    if (pathname !== '/') router.push('/'); 
  }

  function setSeller() {
    setParams({seller: user.username, winner: undefined});
    if (pathname !== '/') router.push('/'); 
  }

  return (
    <Dropdown inline label={`Welcome ${user.name}`}>
      <DropdownItem icon={HiUser} onClick={setSeller}>
          My Auctions
      </DropdownItem>
      <DropdownItem icon={AiFillTrophy} onClick={setWinner}>
          Auctions won
      </DropdownItem>
      <DropdownItem icon={AiFillCar}>
        <Link href='/auctions/create'>
          Sell my car
        </Link>
      </DropdownItem>
      <DropdownItem icon={HiCog}>
        <Link href='/session'>
          Session (dev only!)
        </Link>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem icon={AiOutlineLogout} onClick={() => signOut({callbackUrl: '/'})}>
        Sign out
      </DropdownItem>
    </Dropdown>
  )
}
