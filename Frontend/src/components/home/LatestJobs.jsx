import React from 'react'
import LatestJobCards from './LatestJobCards'
import { Button } from '../ui/button'

const randomJobs = [1,2,3,4,5,6];

const LatestJobs = () => {
  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold text-gray-900'>
          <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600'>
            Latest & Top
          </span>{' '}
          Job Openings
        </h2>
        <Button variant="outline" className="text-blue-600 hover:text-blue-700">
          View All Jobs
        </Button>
      </div>
      
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {randomJobs.map((item, index) => (
          <LatestJobCards key={index} />
        ))}
      </div>
    </div>
  )
}

export default LatestJobs