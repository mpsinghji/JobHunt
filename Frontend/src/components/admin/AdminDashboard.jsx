import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingRecruiters, verifyUser, fetchAllUsers, banUser, clearAdminData } from "../../redux/adminSlice";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "../../utils/api";
import { ADMIN_API_END_POINT } from "../../utils/constants";
import { Ban, CheckCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allUsers, loading, error } = useSelector((state) => state.admin);
  const { user: currentUser } = useSelector((state) => state.auth);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  console.log("Current Redux State:", { allUsers, loading, error });
  console.log("Current User:", currentUser);

  // Memoize filtered users
  const filteredUsers = useMemo(() => {
    console.log("Filtering users with:", { searchQuery, statusFilter });
    const filterUsers = (users) => {
      return users.filter(user => {
        const matchesSearch = searchQuery === "" || (
          (user.fullname?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
          (user.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())
        );
        
        const matchesStatus = statusFilter === "all" ? true :
                            statusFilter === "verified" ? user.isVerified :
                            statusFilter === "pending" ? !user.isVerified :
                            statusFilter === "banned" ? user.isBanned : true;

        return matchesSearch && matchesStatus;
      });
    };

    const filtered = {
      recruiters: filterUsers(allUsers?.recruiters || []),
      jobseekers: filterUsers(allUsers?.jobseekers || []),
      admins: filterUsers(allUsers?.admins || [])
    };

    console.log("Filtered users:", filtered);
    return filtered;
  }, [allUsers, searchQuery, statusFilter]);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
    }, 300),
    []
  );

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      console.log("Not an admin, redirecting...");
      navigate("/login/admin");
      return;
    }

    const fetchData = async () => {
      try {
        console.log("Fetching data...");
        await dispatch(fetchAllUsers()).unwrap();
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.includes("Authentication required") || error.includes("Invalid or expired token")) {
          navigate("/login/admin");
        }
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchData();

    return () => {
      dispatch(clearAdminData());
    };
  }, [dispatch, currentUser, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      if (error.includes("Authentication required") || error.includes("Invalid or expired token")) {
        navigate("/login/admin");
      }
    }
  }, [error, navigate]);

  const handleVerify = async (userId, role) => {
    try {
      await dispatch(verifyUser({ userId, role })).unwrap();
      setIsVerifyModalOpen(false);
      dispatch(fetchAllUsers());
      dispatch(fetchPendingRecruiters());
    } catch (error) {
      console.error('Error verifying user:', error);
      if (error.includes("Authentication required") || error.includes("Invalid or expired token")) {
        navigate("/login/admin");
      }
    }
  };

  const handleBan = async (userId, role) => {
    try {
      await dispatch(banUser({ userId, role })).unwrap();
      setIsBanModalOpen(false);
      dispatch(fetchAllUsers());
    } catch (error) {
      console.error('Error banning user:', error);
      if (error.includes("Authentication required") || error.includes("Invalid or expired token")) {
        navigate("/login/admin");
      }
    }
  };

  if (isInitialLoading || loading) {
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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="pl-8 w-[200px]"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium">{user.fullname || "N/A"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phonenumber || "N/A"}</TableCell>
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
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {(title === "Recruiters" || title === "Admins") && !user.isVerified && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => {
                          setSelectedUser(user);
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
                          setSelectedUser(user);
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
                          setSelectedUser(user);
                          setIsBanModalOpen(true);
                        }}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Unban
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No users found
                </TableCell>
              </TableRow>
            )}
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
            <UserTable users={filteredUsers.recruiters} title="Recruiters" />
          </TabsContent>

          <TabsContent value="jobseekers">
            <UserTable users={filteredUsers.jobseekers} title="Job Seekers" />
          </TabsContent>

          <TabsContent value="admins">
            <UserTable users={filteredUsers.admins} title="Admins" />
          </TabsContent>
        </Tabs>
      </div>

      {/* Verify Modal */}
      <Dialog open={isVerifyModalOpen} onOpenChange={setIsVerifyModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Verify User</DialogTitle>
            <DialogDescription>
              Are you sure you want to verify this {selectedUser?.role}? They will be able to access their account and associated features after verification.
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
              onClick={() => handleVerify(selectedUser?._id, selectedUser?.role)}
            >
              Verify {selectedUser?.role}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ban Modal */}
      <Dialog open={isBanModalOpen} onOpenChange={setIsBanModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedUser?.isBanned ? "Unban" : "Ban"} User</DialogTitle>
            <DialogDescription>
              {selectedUser?.isBanned 
                ? "Are you sure you want to unban this user? They will regain access to their account."
                : "Are you sure you want to ban this user? They will lose access to their account and all associated features."}
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
              variant={selectedUser?.isBanned ? "default" : "destructive"}
              onClick={() => handleBan(selectedUser?._id, selectedUser?.role)}
            >
              {selectedUser?.isBanned ? "Unban" : "Ban"} User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminDashboard; 