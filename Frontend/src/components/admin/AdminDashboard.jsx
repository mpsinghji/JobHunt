import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingRecruiters, verifyRecruiter } from "../../redux/adminSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Navbar from "../shared/Navbar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api from "../../utils/api";
import { ADMIN_API_END_POINT } from "../../utils/constants";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { pendingRecruiters = [], loading, error } = useSelector((state) => state.admin);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchPendingRecruiters());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleVerify = async (recruiterId) => {
    try {
      const res = await api.post(`${ADMIN_API_END_POINT}/verify-recruiter/${recruiterId}`);
      if (res.data.success) {
        toast.success("Recruiter verified successfully");
        dispatch(fetchPendingRecruiters());
        setIsVerifyModalOpen(false);
      } else {
        toast.error(res.data.message || "Failed to verify recruiter");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify recruiter");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6 mt-12">
          <h1 className="text-2xl font-bold">Recruiter Verifications</h1>
        </div>

        {!pendingRecruiters || pendingRecruiters.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No pending recruiter verifications</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRecruiters.map((recruiter) => (
                  <TableRow key={recruiter._id}>
                    <TableCell className="font-medium">
                      {recruiter.firstName} {recruiter.lastName}
                    </TableCell>
                    <TableCell>{recruiter.email}</TableCell>
                    <TableCell>{recruiter.company}</TableCell>
                    <TableCell>{recruiter.position}</TableCell>
                    <TableCell>
                      {new Date(recruiter.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => {
                          setSelectedRecruiter(recruiter);
                          setIsVerifyModalOpen(true);
                        }}
                      >
                        Verify
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog open={isVerifyModalOpen} onOpenChange={setIsVerifyModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Verify Recruiter</DialogTitle>
            <DialogDescription>
              Are you sure you want to verify this recruiter? They will be able to post jobs and create companies after verification.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsVerifyModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => handleVerify(selectedRecruiter?._id)}
            >
              Verify Recruiter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminDashboard; 