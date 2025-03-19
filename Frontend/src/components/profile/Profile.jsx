import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { Edit2, Mail, Phone, MapPin, Link as LinkIcon, FileText, Briefcase, User, Code2, BookOpen, Share2 } from 'lucide-react'
import { Badge } from '../ui/badge'
import { useSelector } from 'react-redux'
import UpdateProfileDialog from './UpdateProfileDialog'

const Profile = () => {
    const { user } = useSelector((store) => store.auth);
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 py-2">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="relative">
                            <img
                                src={user?.profilePhoto || `https://avatar.iran.liara.run/public/boy?username=${user?.email}`}
                                alt="Profile"
                                className="w-40 h-40 rounded-full object-cover border-4 border-blue-100"
                            />
                            <Button
                                onClick={() => setOpen(true)}
                                className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 rounded-full p-2"
                                size="icon"
                            >
                                <Edit2 className="h-4 w-4 text-white" />
                            </Button>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        {user?.fullname || "Your Name"}
                                    </h1>
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-sm">
                                        {user?.role || "Job Seeker"}
                                    </Badge>
                                </div>
                                {/* <div className="flex gap-2">
                                    <Button variant="outline" className="gap-2">
                                        <Share2 className="h-4 w-4" />
                                        Share Profile
                                    </Button>
                                </div> */}
                            </div>
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Mail className="h-4 w-4 text-blue-600" />
                                    <span>{user?.email || "your.email@example.com"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Phone className="h-4 w-4 text-blue-600" />
                                    <span>{user?.phonenumber || "Your Phone Number"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="h-4 w-4 text-blue-600" />
                                    <span>{user?.address || "Your Location"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* About Section */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <User className="h-5 w-5 text-blue-600" />
                                <h2 className="text-xl font-semibold text-gray-900">About Me</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                {user?.profile?.bio || "Write a brief description about yourself..."}
                            </p>
                        </div>

                        {/* Skills Section */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Code2 className="h-5 w-5 text-blue-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {user?.profile?.skills?.map((skill, index) => (
                                    <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                                        {skill}
                                    </Badge>
                                )) || (
                                    <p className="text-gray-600">Add your skills...</p>
                                )}
                            </div>
                        </div>

                        {/* Experience Section */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Briefcase className="h-5 w-5 text-blue-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Experience</h2>
                            </div>
                            <div className="text-gray-600">
                                {user?.experience || "Add your experience"}
                            </div>
                        </div>

                        {/* Social Links Section */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Share2 className="h-5 w-5 text-blue-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Social Links</h2>
                            </div>
                            <div className="space-y-4">
                                {user?.socialMediaLinks?.linkedin ? (
                                    <a
                                        href={user.socialMediaLinks.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        <LinkIcon className="h-4 w-4" />
                                        <span className="text-sm font-medium">LinkedIn Profile</span>
                                    </a>
                                ) : (
                                    <p className="text-gray-600">Add LinkedIn profile</p>
                                )}
                                {user?.socialMediaLinks?.github ? (
                                    <a
                                        href={user.socialMediaLinks.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        <LinkIcon className="h-4 w-4" />
                                        <span className="text-sm font-medium">GitHub Profile</span>
                                    </a>
                                ) : (
                                    <p className="text-gray-600">Add GitHub profile</p>
                                )}
                                {user?.socialMediaLinks?.portfolio ? (
                                    <a
                                        href={user.socialMediaLinks.portfolio}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        <LinkIcon className="h-4 w-4" />
                                        <span className="text-sm font-medium">Portfolio Website</span>
                                    </a>
                                ) : (
                                    <p className="text-gray-600">Add portfolio website</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Resume Section */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FileText className="h-5 w-5 text-blue-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Resume</h2>
                            </div>
                            {user?.profile?.resume ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <FileText className="h-4 w-4" />
                                        <span className="text-sm font-medium">
                                            {user.profile.resumeOriginalName || "Resume.pdf"}
                                        </span>
                                    </div>
                                    <div className="h-[400px] w-full border rounded-lg overflow-hidden">
                                        <iframe
                                            src={`data:application/pdf;base64,${user.profile.resume}`}
                                            className="w-full h-full"
                                            title="Resume Preview"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-600">No resume uploaded</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile