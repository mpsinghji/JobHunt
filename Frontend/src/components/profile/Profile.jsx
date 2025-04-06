import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { Edit2, Mail, Phone, MapPin, Link as LinkIcon, FileText, Briefcase, User, Code2, BookOpen, Share2, Calendar, Trash2 } from 'lucide-react'
import { Badge } from '../ui/badge'
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '../../redux/authSlice'
import UpdateProfileDialog from './UpdateProfileDialog'
import axios from 'axios'
import { USER_API_END_POINT } from '../utils/constants'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog"

const Profile = () => {
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleRemoveProfilePicture = async () => {
        if (!user?.profile?.profilePhoto) {
            toast.info("No profile picture to remove");
            return;
        }

        try {
            setIsRemoving(true);
            const response = await axios.post(
                `${USER_API_END_POINT}/profile/remove-photo`,
                {},
                {
                    withCredentials: true
                }
            );

            if (response.data.success) {
                // Update the user in Redux with the new data
                dispatch(setUser(response.data.user));
                toast.success("Profile picture removed successfully");
            } else {
                toast.error(response.data.message || "Failed to remove profile picture");
            }
        } catch (error) {
            console.error("Remove profile picture error:", error);
            toast.error(error.response?.data?.message || "Failed to remove profile picture");
        } finally {
            setIsRemoving(false);
            setShowDeleteConfirm(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 py-2">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="relative">
                            <img
                                src={user?.profile?.profilePhoto?.url || `https://avatar.iran.liara.run/public/boy?username=${user?.email}`}
                                alt="Profile"
                                className="w-40 h-40 rounded-full object-cover border-4 border-blue-100"
                            />
                            <div className="absolute -bottom-10 -right-2 flex gap-2">
                                <Button
                                    onClick={() => setOpen(true)}
                                    className="bg-blue-600 hover:bg-blue-700 rounded-full p-2"
                                    size="icon"
                                >
                                    <Edit2 className="h-4 w-4 text-white" />
                                </Button>
                                {user?.profile?.profilePhoto && (
                                    <Button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="bg-red-500 hover:bg-red-600 rounded-full p-2"
                                        size="icon"
                                        disabled={isRemoving}
                                    >
                                        <Trash2 className="h-4 w-4 text-white" />
                                    </Button>
                                )}
                            </div>
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
                            </div>
                            <div className="mt-4 flex items-start gap-2 text-gray-600">
                                <MapPin className="h-4 w-4 text-blue-600 mt-1" />
                                <span className="flex-1">{user?.address || "Your Location"}</span>
                            </div>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <User className="h-4 w-4 text-blue-600" />
                                    <span>{user?.gender || "Gender not specified"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar className="h-4 w-4 text-blue-600" />
                                    <span>
                                        {user?.dob 
                                            ? new Date(user.dob).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                              })
                                            : "Date of Birth not specified"}
                                    </span>
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
                        {/* <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Briefcase className="h-5 w-5 text-blue-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Experience</h2>
                            </div>
                            <div className="text-gray-600">
                                {user?.experience || "Add your experience"}
                            </div>
                        </div> */}

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
                        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                    Resume
                                </h2>
                                <Button
                                    onClick={() => setOpen(true)}
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                >
                                    <Edit2 className="h-4 w-4" />
                                    Update Resume
                                </Button>
                            </div>
                            {user?.profile?.resume ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <FileText className="h-8 w-8 text-blue-600" />
                                        <div>
                                            <p className="text-sm text-gray-600">Current Resume</p>
                                            <a
                                                href={user.profile.resume.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                            >
                                                View Resume
                                            </a>
                                        </div>
                                    </div>
                                    <div className="border rounded-lg overflow-hidden">
                                        <iframe
                                            src={user.profile.resume.url}
                                            className="w-full h-[600px]"
                                            title="Resume Preview"
                                            sandbox="allow-scripts allow-same-origin"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-4">No resume uploaded yet</p>
                                    <Button
                                        onClick={() => setOpen(true)}
                                        className="gap-2"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                        Upload Resume
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <UpdateProfileDialog open={open} setOpen={setOpen} />

            <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove Profile Picture</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to remove your profile picture? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleRemoveProfilePicture}
                            className="bg-red-500 hover:bg-red-600"
                            disabled={isRemoving}
                        >
                            {isRemoving ? "Removing..." : "Remove"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default Profile