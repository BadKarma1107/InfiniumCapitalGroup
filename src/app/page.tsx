// pages/index.tsx
import React from 'react'
import Link from 'next/link'
import Form from './testing/page'

const Page: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
       
        <Link href="/strategy">
          <p className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300">
            Move to Strategy
          </p>
        </Link>
      </div>
    
    </div>
    
  )
}

export default Page
