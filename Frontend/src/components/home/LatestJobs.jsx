import React from 'react'
import LatestJobCards from './LatestJobCards'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const LatestJobs = () => { 
  const { allJobs } = useSelector((store) => store.job);

  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold text-gray-900'>
          <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600'>
            Latest & Top
          </span>{' '}
          Job Openings
        </h2>
        <Link to="/jobs">
          <Button variant="outline" className="text-blue-600 hover:text-blue-700">
            View All Jobs
          </Button>
        </Link>
      </div>
      
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {allJobs.length <= 0 ? (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500 text-lg">No jobs found</p>
          </div>
        ) : (
          allJobs.slice(0, 6).map((job) => (
            <LatestJobCards key={job._id} item={job} />
          ))
        )}
      </div>
    </div>
  )
}

export default LatestJobs