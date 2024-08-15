'use client'

import { useParamsStore } from '@/hooks/useParamsStore'  
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import {FaSearch} from 'react-icons/fa'

export default function Search() {
    const router = useRouter();
    const pathname = usePathname();
    const setParams = useParamsStore(state => state.setParams);
    const setSearchValue = useParamsStore(state => state.setSearchValue);
    const searchValue = useParamsStore(state => state.searchValue);

    function onChange(event: any) {
        setSearchValue(event.target.value);
    }

    function search() {
        if (pathname !== '/') router.push('/');
        setParams({searchTerm: searchValue});
    }

    return (
        <div className='flex w-[50%] items-center border-2 rounded-full py-2 shadow-sm'>
            <input 
                onChange={onChange}
                onKeyDown={(e: any) => {
                    if (e.key === 'Enter') search();
                }}
                type="text" 
                value={searchValue}
                placeholder='Search for cars by make, model or color'
                className='
                input-custom
                text-sm
                text-gray-600   
                '
            />
            <button>
                <FaSearch size={34}
                    onClick={search} 
                    className='bg-red-400 text-white rounded-full p-2 cursor-pointer mx-2' 
                />
            </button>
        </div>
    )
}