// import { LogOut } from 'lucide-react';
// import Link from 'next/link'
// import { usePathname } from 'next/navigation';
// import React from 'react';
// import { useAuthStore } from '@/store/authStore';
// import { logout } from '@/utils/auth';

// const Sidebar = () => {
//     const pathname = usePathname();
    
//     const isActive = (path: string) => pathname === path;


//     return (
//         <div className='w-full h-screen bg-white  px-10 py-10'>
//             <div className='font-bold text-2xl md:text-3xl text-green-900'>
//                 <Link href='/dashboard'>
//                     EvoBank
//                 </Link>
//             </div>
//             <div className='flex items-start justify-start flex-col mt-4 gap-2'>
//                 <div className={`flex items-center justify-center h-12 text-green-800 rounded-md w-full transition-colors duration-200 px-4 py-2 ${
//                     isActive('/dashboard/financial-data') 
//                         ? 'bg-green-100 text-green-700 font-semibold' 
//                         : 'hover:bg-green-100 hover:text-green-700'
//                 }`}>
//                     <Link href='/dashboard/financial-data' className="w-full ">
//                         <h1 className='text-lg font-semi'>Financial Data</h1>
//                     </Link>
//                 </div>
//                 <div className={`flex items-center justify-center h-12 text-green-800 rounded-md w-full transition-colors duration-200 px-4 py-2 ${
//                     isActive('/dashboard/ai-assistant') 
//                         ? 'bg-green-100 text-green-700 font-semibold' 
//                         : 'hover:bg-green-100 hover:text-green-700'
//                 }`}>
//                     <Link href='/dashboard/ai-assistant' className="w-full ">
//                         <h1 className='text-lg font-semi'>Ai Assistant</h1>
//                     </Link>
//                 </div>
//                 <div className={`flex items-center justify-center h-12 text-green-800 rounded-md w-full transition-colors duration-200 px-4 py-2 ${
//                     isActive('/dashboard/utilities') 
//                         ? 'bg-green-100 text-green-700 font-semibold' 
//                         : 'hover:bg-green-100 hover:text-green-700'
//                 }`}>
//                     <Link href='/dashboard/utilities' className="w-full text">
//                         <h1 className='text-lg font-semi'>Utilities</h1>
//                     </Link>
//                 </div>
//                 <div className={`flex items-center justify-center h-12 text-green-800 rounded-md w-full transition-colors duration-200 px-4 py-2 ${
//                     isActive('/dashboard/quantum-mode') 
//                         ? 'bg-green-100 text-green-700 font-semibold' 
//                         : 'hover:bg-green-100 hover:text-green-700'
//                 }`}>
//                     <Link href='/dashboard/quantum-mode' className="w-full ">
//                         <h1 className='text-lg font-semi'>Quantum Mode</h1>
//                     </Link>
//                 </div>
//             </div>
//             <div className={`flex items-start justify-start mt-[] h-12 text-green-800 rounded-md w-full transition-colors duration-200 px-4 py-2 ${
//                     isActive('/dashboard/logout') 
//                         ? 'bg-green-100 text-green-700 font-semibold' 
//                         : 'hover:bg-green-100 hover:text-green-700'
//                 }`}>
//                     <Link href='/login' className="w-full flex items-start  justify-start gap-2" onClick={logout}>
//                         <LogOut size={24} />
//                         <h1 className='text-lg font-semi'>Logout</h1>
//                     </Link>
//                 </div>
//         </div>
//     )
// }

// export default Sidebar

import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/utils/auth';

const Sidebar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className='w-full h-screen bg-white px-10 py-10 flex flex-col'>
      {/* Logo */}
      <div className='font-bold text-2xl md:text-3xl text-green-900'>
        <Link href='/dashboard'>EvoBank</Link>
      </div>

      {/* Navigation Links */}
      <div className='flex flex-col mt-4 gap-2'>
        {[
          { path: '/dashboard/financial-data', label: 'Financial Data' },
          { path: '/dashboard/ai-assistant', label: 'Ai Assistant' },
          { path: '/dashboard/utilities', label: 'Utilities' },
          { path: '/dashboard/quantum-mode', label: 'Quantum Mode' },
        ].map(({ path, label }) => (
          <div
            key={path}
            className={`flex items-center justify-center h-12 text-green-800 rounded-md w-full transition-colors duration-200 px-4 py-2 ${
              isActive(path)
                ? 'bg-green-100 text-green-700 font-semibold'
                : 'hover:bg-green-100 hover:text-green-700'
            }`}
          >
            <Link href={path} className='w-full'>
              <h1 className='text-lg font-semi'>{label}</h1>
            </Link>
          </div>
        ))}
      </div>

      {/* Logout (at bottom) */}
      <div
        className={`flex items-start justify-start mt-auto h-12 text-green-800 rounded-md w-full transition-colors duration-200 px-4 py-2 ${
          isActive('/dashboard/logout')
            ? 'bg--100 text-green-700 font-semibold'
            : 'hover:bg-red-500 hover:text-white'
        }`}
      >
        <Link
          href='/login'
          className='w-full flex items-center gap-2'
          onClick={logout}
        >
          <LogOut size={24} />
          <h1 className='text-lg font-semi'>Logout</h1>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
