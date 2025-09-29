import Image from 'next/image';
import React from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className='flex items-center justify-center gap-10 '>
            

            <div className='w-1/3 '>

                {children}
            </div>
            <div className='w-1/2 flex items-center justify-center'>
                <Image src='/login.svg' alt='auth' width={900} height={800} />
            </div>

        </main>
    )
}
export default AuthLayout;
