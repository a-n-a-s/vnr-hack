'use client'
import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-green-900 text-white py-12">
      <div className="container mx-auto px-6">


        <div className="border-t border-green-900 mt-10 pt-6 text-center text--white">
          <p>© {new Date().getFullYear()} VNR Finance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer