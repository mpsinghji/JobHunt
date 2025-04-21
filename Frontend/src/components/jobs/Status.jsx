import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "../../utils/constants";
import { toast } from "sonner";
import { Building2, Briefcase, Calendar, Clock, Filter } from "lucide-react";
import Saved from "./Saved";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const Status = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all", "active", "withdrawn"

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setApplications(res.data.application);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Withdrawn":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const handleWithdraw = async (applicationId) => {
    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/withdraw/${applicationId}`,
        {},
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setApplications(applications.filter((application) => application._id !== applicationId));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to withdraw application");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredApplications = applications.filter((application) => {
    if (filter === "all") return true;
    if (filter === "active") return application.status !== "Withdrawn";
    if (filter === "withdrawn") return application.status === "Withdrawn";
    return true;
  });

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Applications</h1>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter applications" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="active">Active Applications</SelectItem>
                <SelectItem value="withdrawn">Withdrawn Applications</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              {filter === "all"
                ? "You haven't applied to any jobs yet."
                : filter === "active"
                ? "No active applications found."
                : "No withdrawn applications found."}
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Company & Job</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-semibold">
                            {application.job?.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.job?.companyId?.name}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-500" />
                        <span>{application.job?.position}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{formatDate(application.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>
                          {new Date(application.updatedAt).toLocaleDateString() ===
                          new Date(application.createdAt).toLocaleDateString()
                            ? "Today"
                            : formatDate(application.updatedAt)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className={getStatusColor(application.status)}>
                        {application.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {application.status !== "Withdrawn" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 mr-5"
                          onClick={() => handleWithdraw(application._id)}
                        >
                          Withdraw
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      <Saved />
    </>
  );
};

export default Status;
