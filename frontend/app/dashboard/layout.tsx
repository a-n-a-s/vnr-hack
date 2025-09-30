'use client';

import React from 'react'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Sidebar from '@/components/dashboard/Sidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const { user, loading } = useAuthStore();

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [loading, user, router]);

    if (loading) return <p>Loading...</p>;
    if (!user) return null;
    return (
        <div className='flex h-screen'>
            <div className='w-1/5 h-screen sticky top-0'>
                <Sidebar />
            </div>
            <div className='w-full h-screen overflow-y-auto'>
                {children}
            </div>
        </div>
    )
}

export default DashboardLayout