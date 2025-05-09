import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateApplicationStatus } from "../../redux/applicationSlice";
import { toast } from "sonner";
import { Eye, MoreVertical } from "lucide-react";
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
    setSelectedResume(resumeUrl);
    setIsResumeModalOpen(true);
  };

  if (!currentJob?.applications || currentJob.applications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No applications found for this job.</p>
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
          {currentJob.applications.map((application) => {
            const applicant = application.applicant || {};
            const profile = applicant.profile || {};
            const resumeUrl = profile.resume;

            return (
              <TableRow key={application._id}>
                <TableCell>{applicant.fullname || 'N/A'}</TableCell>
                <TableCell>{applicant.email || 'N/A'}</TableCell>
                <TableCell>{applicant.phonenumber || 'N/A'}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleResumeClick(resumeUrl)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View Resume
                  </Button>
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
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Resume Preview</DialogTitle>
          </DialogHeader>
          {selectedResume ? (
            <iframe
              src={selectedResume}
              className="w-full h-full"
              title="Resume Preview"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No resume available</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicantsTable;
