'use client'

import Link from 'next/link'
import React, { useState } from 'react'


const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className='flex flex-col md:flex-row items-center justify-center px-4 md:px-16 py-10 '>
      <div className='flex items-center justify-between w-full md:w-1/4'>
        <div className='font-bold text-2xl md:text-3xl text-green-800'>
          EvoBank
        </div>
        <button
          className="md:hidden text-green-800 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      <div className={`w-full md:w-2/3 flex flex-col md:flex md:flex-row items-center md:gap-10 ${mobileMenuOpen ? 'block' : 'hidden'} md:block`}>
        <div className='flex flex-col md:flex-row items-center justify-between w-2/3 md:w-2/3 mb-4 md:mb-0'>
          <ul className='mb-2 md:mb-0 md:mr-4 text-center w-full'><a href="#" className="hover:underline text-green-900">Home</a></ul>
          <ul className='mb-2 md:mb-0 md:mr-4 text-center w-full'><a href="#" className="hover:underline text-green-900">Features</a></ul>
          <ul className='mb-2 md:mb-0 md:mr-4 text-center w-full'><a href="#" className="hover:underline text-green-900">Pricing</a></ul>
          <ul className='mb-2 md:mb-0 md:mr-4 text-center w-full'><a href="#" className="hover:underline text-green-900">FAQ</a></ul>
        </div>

        <div className='flex flex-col font-semibold md:flex-row items-center justify-between w-1/3 md:w-1/4 mt-4 md:mt-0'>
          <Link href="/login">
            <ul className='mb-2 md:mb-0 text-center w-full'><a href="#" className="hover:underline text-green-900">Login</a></ul>
          </Link>
          <ul className='text-center w-full'><a href="#" className="hover:underline text-green-900 bg-[#D0F0F3] rounded-md px-4 py-2">Register</a></ul>
        </div>
      </div>
    </div>
  )
}

export default Header