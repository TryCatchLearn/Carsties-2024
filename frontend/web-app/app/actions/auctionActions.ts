'use server';

import { auth } from '@/auth';
import { fetchWrapper } from '@/lib/fetchWrapper';
import { Auction, PagedResult } from '@/types';
import { revalidatePath } from 'next/cache';
import { FieldValues } from 'react-hook-form';

export async function getData(query: string): Promise<PagedResult<Auction>> {
    return await fetchWrapper.get(`search${query}`)
}

export async function updateAuctionTest() {
    const data = {
        mileage: Math.floor(Math.random() * 10000) + 1
    }

    return await fetchWrapper.put('auctions/afbee524-5972-4075-8800-7d1f9d7b0a0c', data);
}

export async function createAuction(data: FieldValues) {
    return await fetchWrapper.post('auctions', data);
}

export async function getDetailedViewData(id: string): Promise<Auction> {
    return await fetchWrapper.get(`auctions/${id}`)
}

export async function updateAuction(data: FieldValues, id: string) {
    const res = await fetchWrapper.put(`auctions/${id}`, data);
    revalidatePath(`/auctions/${id}`)
    return res;
}

export async function deleteAuction(id: string) {
    return await fetchWrapper.del(`auctions/${id}`);
}