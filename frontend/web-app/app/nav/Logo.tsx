'use client'

import { useParamsStore } from '@/hooks/useParamsStore';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React from 'react'
import { AiOutlineCar } from 'react-icons/ai';

export default function Logo() {
    const router = useRouter();
    const pathname = usePathname();

    function doReset() {
        if (pathname !== '/') router.push('/');
        reset();
    }

    const reset = useParamsStore(state => state.reset)

    return (
        <div onClick={doReset} className='flex items-center gap-2 text-3xl font-semibold text-red-500 cursor-pointer'>
            <AiOutlineCar size={34} />
            <div>Carsties Auctions</div>
        </div>
    )
}