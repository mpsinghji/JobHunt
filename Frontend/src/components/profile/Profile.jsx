import React from 'react'
import Navbar from '../shared/Navbar'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Label } from '../ui/label'
import AppliedJobTable from './AppliedJobTable'
import { useSelector } from 'react-redux'

const Profile = () => {
    const { user } = useSelector((store) => store.auth);
    const isResume = user?.profile?.resume ? true : false;

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24">
                            <AvatarImage 
                                src={user?.profile?.profilePhoto || `https://avatar.iran.liara.run/public/boy?username=${user?.email}`} 
                                alt={user?.fullname} 
                            />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{user?.fullname}</h1>
                            <p>{user?.profile?.bio || "No bio added yet"}</p>
                        </div>
                    </div>
                    <Button className="text-right" variant="outline"><Pen /></Button>
                </div>
                <div className='my-5'>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail />
                        <span>{user?.email}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact />
                        <span>{user?.phonenumber}</span>
                    </div>
                </div>
                <div className='my-5'>
                    <h1>Skills</h1>
                    <div className='flex items-center gap-1'>
                        {user?.profile?.skills?.length > 0 ? 
                            user.profile.skills.map((skill, index) => (
                                <Badge key={index}>{skill}</Badge>
                            )) 
                            : <span>No skills added yet</span>
                        }
                    </div>
                </div>
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Label className="text-md font-bold">Resume</Label>
                    {isResume ? (
                        <a 
                            target='blank' 
                            href={user.profile.resume} 
                            className='text-blue-500 w-full hover:underline cursor-pointer'
                        >
                            {user.profile.resumeOriginalName || "View Resume"}
                        </a>
                    ) : (
                        <span>No resume uploaded yet</span>
                    )}
                </div>
            </div>
            <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
                <h1 className='font-bold text-lg my-5'>Applied Jobs</h1>
                <AppliedJobTable />
            </div>
        </div>
    )
}

export default Profile