import React from 'react'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

const JobCard = () => {
  return (
    <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100'>
        <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500"> 2 days ago</p>
            <Button variant="outline" className="rounded-full" size="icon"><Bookmark/></Button>
        </div>
        <div className='flex items-center gap-2 my-2'>
            <Button className='p-6' variant="outline" size="icon">
                <Avatar>
                    <AvatarImage src="https://w7.pngwing.com/pngs/786/126/png-transparent-logo-contracting-photography-logo-symbol.png"/>
                </Avatar>
            </Button>
            <div>
                <h1 className='font-medium text-lg'>Company Name</h1>
                <p className='text-sm text-gray-500'>India</p>
            </div>
        </div>
        <div>
            <h1 className='font-bold text-lg my-2'>Title</h1>
            <p className='text-sm text-gray-600'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam natus perspiciatis nam.</p>
        </div>
        <div className='flex items-center gap-2 mt-4'>
            <Badge variant="outline" className='rounded-full px-4 py-2 text-sm text-gray-500'>12 Position</Badge>
            <Badge variant="outline" className='rounded-full px-4 py-2 text-sm text-gray-500'>Full Time</Badge>
            <Badge variant="outline" className='rounded-full px-4 py-2 text-sm text-gray-500'>24LPA</Badge>
        </div>
        <div className='flex  items-center gap-4 mt-4'>
            <Button variant="outline" className='rounded-full px-4 py-2 text-sm text-gray-500'>
                Details
            </Button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm">
                Save for later
            </button>
        </div>
    </div>
  )
}

export default JobCard