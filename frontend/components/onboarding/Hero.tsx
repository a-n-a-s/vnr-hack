'use client'
import React from 'react'
import Image from 'next/image'
const Hero = () => {
  return (
    <div className='my-10'>
      <div className='w-full py-20  flex items-center'>
        <div className='w-1/2 mx-auto flex flex-col items-center justify-center'>
          <h1 className='text-7xl font-bold text-green-800'>Next-Gen  Finances</h1>
          <h1 className='text-7xl font-bold text-green-800'>Made Simple</h1>
          <div className='py-4'>
            <p className='text-xl text-gray-600 text-center'>
              Manage your finances with ease , track all your expenses , run simulations ,
              get optimizations and financial guidance with our latest next gen technology and secure finance management systems.
            </p>
            <div className="pt-4 flex justify-center">
              <button className="bg-green-800 hover:bg-green-900 cursor-pointer text-white font-semibold py-3 px-6 rounded-full transition duration-300 ease-in-out">
                Start Now
              </button>
            </div>
          </div>
        </div>

      </div>
      <div className='w-full flex justify-center'>
        <Image src={"/hero2.png"} alt="hero" width={1100} height={500} />
      </div>
      <br />
    </div>
  )
}

export default Hero