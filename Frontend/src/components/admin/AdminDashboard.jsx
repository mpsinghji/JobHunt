import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingRecruiters, verifyRecruiter, fetchAllUsers } from "../../redux/adminSlice";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "../../utils/api";
import { ADMIN_API_END_POINT } from "../../utils/constants";
import { Ban, CheckCircle } from "lucide-react";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { pendingRecruiters = [], allUsers, loading, error } = useSelector((state) => state.admin);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchPendingRecruiters());
    dispatch(fetchAllUsers());
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
        dispatch(fetchAllUsers());
        setIsVerifyModalOpen(false);
      } else {
        toast.error(res.data.message || "Failed to verify recruiter");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify recruiter");
    }
  };

  const handleBan = async (recruiterId) => {
    try {
      const res = await api.post(`${ADMIN_API_END_POINT}/ban-recruiter/${recruiterId}`);
      if (res.data.success) {
        toast.success("Recruiter banned successfully");
        dispatch(fetchAllUsers());
        setIsBanModalOpen(false);
      } else {
        toast.error(res.data.message || "Failed to ban recruiter");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to ban recruiter");
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

  const UserTable = ({ users, title }) => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              {title === "Recruiters" && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium">{user.fullname}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phonenumber}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {user.isBanned ? (
                      <Badge variant="destructive">Banned</Badge>
                    ) : (
                      <Badge variant={user.isVerified ? "success" : "destructive"}>
                        {user.isVerified ? "Verified" : "Pending"}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                {title === "Recruiters" && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {!user.isVerified && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => {
                            setSelectedRecruiter(user);
                            setIsVerifyModalOpen(true);
                          }}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Verify
                        </Button>
                      )}
                      {!user.isBanned ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            setSelectedRecruiter(user);
                            setIsBanModalOpen(true);
                          }}
                        >
                          <Ban className="w-4 h-4 mr-1" />
                          Ban
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => {
                            setSelectedRecruiter(user);
                            setIsBanModalOpen(true);
                          }}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Unban
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6 mt-12">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>

        <Tabs defaultValue="recruiters" className="space-y-4">
          <TabsList>
            <TabsTrigger value="recruiters">Recruiters</TabsTrigger>
            <TabsTrigger value="jobseekers">Job Seekers</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger>
          </TabsList>

          <TabsContent value="recruiters">
            <UserTable users={allUsers.recruiters} title="Recruiters" />
          </TabsContent>

          <TabsContent value="jobseekers">
            <UserTable users={allUsers.jobseekers} title="Job Seekers" />
          </TabsContent>

          <TabsContent value="admins">
            <UserTable users={allUsers.admins} title="Admins" />
          </TabsContent>
        </Tabs>
      </div>

      {/* Verify Modal */}
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

      {/* Ban Modal */}
      <Dialog open={isBanModalOpen} onOpenChange={setIsBanModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedRecruiter?.isBanned ? "Unban" : "Ban"} Recruiter</DialogTitle>
            <DialogDescription>
              {selectedRecruiter?.isBanned 
                ? "Are you sure you want to unban this recruiter? They will regain access to their account."
                : "Are you sure you want to ban this recruiter? They will lose access to their account and all associated features."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsBanModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant={selectedRecruiter?.isBanned ? "default" : "destructive"}
              onClick={() => handleBan(selectedRecruiter?._id)}
            >
              {selectedRecruiter?.isBanned ? "Unban" : "Ban"} Recruiter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminDashboard; 