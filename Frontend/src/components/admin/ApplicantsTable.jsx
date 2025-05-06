import React, { useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { MoreHorizontal } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '../../utils/constants';
import axios from 'axios';
import { Badge } from '../ui/badge';
import { updateApplicationStatus } from '../../redux/applicationSlice';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { job } = useSelector(store => store.application);
    const dispatch = useDispatch();
    const [resumeModalOpen, setResumeModalOpen] = useState(false);
    const [selectedResume, setSelectedResume] = useState(null);

    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            if (res.data.success) {
                // Update the UI immediately without page reload
                dispatch(updateApplicationStatus({ applicationId: id, status }));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    }
    
    const openResumeModal = (resume) => {
        setSelectedResume(resume);
        setResumeModalOpen(true);
    }

    if (!job?.application?.length) {
        return (
            <div className="text-center py-8">No applicants found for this job.</div>
        );
    }    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-semibold">{job.title}</h2>
                <div className="flex gap-4 mt-2">
                    <Badge>{job.jobType}</Badge>
                    <Badge variant="outline">{job.experience}</Badge>
                    <Badge variant="secondary">{job.location}</Badge>
                </div>
            </div>
            <Table>
                <TableCaption>List of applicants for {job.title}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Applied Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {job.application.map((item) => (
                        <TableRow key={item._id}>
                            <TableCell>{item.applicant?.fullname}</TableCell>
                            <TableCell>{item.applicant?.email}</TableCell>
                            <TableCell>{item.applicant?.phonenumber}</TableCell>                            <TableCell>
                                {item.applicant?.profile?.resume?.url ? (
                                    <span 
                                        className="text-blue-600 cursor-pointer underline" 
                                        onClick={() => openResumeModal(item.applicant.profile.resume)}
                                    >
                                        {item.applicant.profile.resume.originalName || 'View Resume'}
                                    </span>
                                ) : (
                                    <span>NA</span>
                                )}
                            </TableCell>
                            <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <Badge 
                                    variant={item.status === "Pending" ? "outline" : 
                                            item.status === "Accepted" ? "success" : "destructive"}
                                >
                                    {item.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Popover>
                                    <PopoverTrigger>
                                        <MoreHorizontal className="h-5 w-5" />
                                    </PopoverTrigger>
                                    <PopoverContent className="w-32">
                                        {shortlistingStatus.map((status) => (
                                            <div 
                                                key={status}
                                                onClick={() => statusHandler(status, item._id)}
                                                className="flex w-full items-center px-2 py-1.5 cursor-pointer hover:bg-slate-100 rounded"
                                            >
                                                <span>{status}</span>
                                            </div>
                                        ))}
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            
            {/* Resume Preview Dialog/Modal */}
            <Dialog open={resumeModalOpen} onOpenChange={setResumeModalOpen}>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Resume Preview</DialogTitle>
                        <DialogDescription>
                            {selectedResume?.originalName || "Applicant Resume"}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center py-4">                        {selectedResume?.url && (
                            <>
                                {selectedResume.url.toLowerCase().endsWith('.pdf') ? (
                                    // PDF Viewer with fallback
                                    <>
                                        <iframe
                                            src={`${selectedResume.url}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                                            className="w-full h-[70vh] border-0"
                                            title="Resume Preview"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                document.getElementById('pdf-fallback').style.display = 'block';
                                            }}
                                        />
                                        <div 
                                            id="pdf-fallback" 
                                            className="hidden text-center p-4 border border-dashed border-gray-300 rounded-md w-full"
                                        >
                                            <p className="mb-2">PDF preview not available</p>
                                            <a 
                                                href={selectedResume.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="bg-blue-600 text-white px-4 py-2 rounded-md"
                                            >
                                                Open PDF
                                            </a>
                                        </div>
                                    </>
                                ) : (
                                    // Image Viewer - Force JPG display
                                    <div className="flex flex-col items-center">
                                        <img
                                            src={selectedResume.url}
                                            alt="Resume"
                                            className="max-w-full max-h-[70vh] object-contain"
                                            onError={(e) => {
                                                // If image fails, try to append jpg extension or show error
                                                if (!e.target.src.endsWith('?format=jpg')) {
                                                    e.target.src = `${selectedResume.url}?format=jpg`;
                                                } else {
                                                    e.target.style.display = 'none';
                                                    document.getElementById('img-fallback').style.display = 'block';
                                                }
                                            }}
                                        />
                                        <div 
                                            id="img-fallback" 
                                            className="hidden text-center p-4 border border-dashed border-gray-300 rounded-md w-full mt-2"
                                        >
                                            <p className="mb-2">Image preview not available</p>
                                        </div>
                                    </div>
                                )}
                                <div className="mt-4 w-full flex justify-end">
                                    <a
                                        className="text-blue-600 hover:underline"
                                        href={selectedResume.url}
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        download
                                    >
                                        Download Resume
                                    </a>
                                </div>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>        </div>    )
}

export default ApplicantsTable