import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateApplicationStatus } from "../../redux/applicationSlice";
import { toast } from "sonner";
import { Eye, MoreVertical, FileText } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ApplicantsTable = () => {
  const dispatch = useDispatch();
  const { currentJob } = useSelector((state) => state.application);
  const [selectedResume, setSelectedResume] = useState(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [resumePreviewUrl, setResumePreviewUrl] = useState(null);

  console.log("Current Job in Table:", currentJob);
  console.log("Applications:", currentJob?.applications);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const result = await dispatch(updateApplicationStatus({ 
        applicationId, 
        status: newStatus 
      })).unwrap();

      if (result.success) {
        toast.success(result.message || "Status updated successfully");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleResumeClick = (resumeUrl) => {
    if (!resumeUrl) {
      toast.error("No resume available");
      return;
    }
    // Convert PDF URL to use Cloudinary's page transformation
    const urlParts = resumeUrl.split('/upload/');
    if (urlParts.length === 2) {
      const baseUrl = urlParts[0] + '/upload/';
      const publicId = urlParts[1].split('.')[0]; // Remove file extension
      // Create a URL that uses the page transformation to convert PDF to image
      const imageUrl = `${baseUrl}pg_1/${publicId}.jpg`;
      setResumePreviewUrl(imageUrl);
      setSelectedResume(resumeUrl);
      setIsResumeModalOpen(true);
    } else {
      // Fallback to original URL if transformation fails
      setResumePreviewUrl(resumeUrl);
      setSelectedResume(resumeUrl);
      setIsResumeModalOpen(true);
    }
  };

  if (!currentJob?.applications || currentJob.applications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No applications found for this job.</p>
      </div>
    );
  }

  // Filter out withdrawn applications
  const activeApplications = currentJob.applications.filter(
    application => application.status !== "Withdrawn"
  );

  if (activeApplications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No active applications found for this job.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Applied Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activeApplications.map((application) => {
            const applicant = application.applicant || {};
            const profile = applicant.profile || {};
            const resumeUrl = profile.resume?.url;

            return (
              <TableRow key={application._id}>
                <TableCell>{applicant.fullname || 'N/A'}</TableCell>
                <TableCell>{applicant.email || 'N/A'}</TableCell>
                <TableCell>{applicant.phonenumber || 'N/A'}</TableCell>
                <TableCell>
                  {resumeUrl ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleResumeClick(resumeUrl)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Resume
                    </Button>
                  ) : (
                    <span className="text-gray-500 text-sm">No resume uploaded</span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(application.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    application.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    application.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                    application.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {application.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48">
                      <div className="flex flex-col gap-2">
                        {application.status !== "Accepted" && (
                          <Button
                            variant="ghost"
                            onClick={() => handleStatusChange(application._id, "Accepted")}
                            className="text-green-600 hover:text-green-700"
                          >
                            Approve
                          </Button>
                        )}
                        {application.status !== "Pending" && (
                          <Button
                            variant="ghost"
                            onClick={() => handleStatusChange(application._id, "Pending")}
                            className="text-yellow-600 hover:text-yellow-700"
                          >
                            Move to Pending
                          </Button>
                        )}
                        {application.status !== "Rejected" && (
                          <Button
                            variant="ghost"
                            onClick={() => handleStatusChange(application._id, "Rejected")}
                            className="text-red-600 hover:text-red-700"
                          >
                            Reject
                          </Button>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Dialog open={isResumeModalOpen} onOpenChange={setIsResumeModalOpen}>
        <DialogContent className="max-w-5xl h-[95vh] p-0 overflow-hidden">
          <DialogHeader className="p-6 border-b">
            <DialogTitle className="text-xl font-semibold">Resume Preview</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col h-full">
            {resumePreviewUrl ? (
              <>
                <div className="flex-1 overflow-auto bg-gray-100 p-6 flex items-center justify-center">
                  <div className="bg-white rounded-lg shadow-lg p-2 max-w-full max-h-full">
                    <img 
                      src={resumePreviewUrl} 
                      alt="Resume Preview" 
                      className="max-w-full max-h-[calc(90vh-200px)] object-contain"
                    />
                  </div>
                </div>
                <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
                  <Button 
                    onClick={() => window.open(resumePreviewUrl, '_blank')}
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Eye className="h-4 w-4" />
                    Open in New Tab
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-100">
                <div className="text-center p-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Failed to load resume preview</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicantsTable;
