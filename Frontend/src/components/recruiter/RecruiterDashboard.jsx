import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchRecruiterJobs } from "../../redux/jobSlice";
import { fetchRecruiterCompanies } from "../../redux/companySlice";
import { fetchRecruiterApplications } from "../../redux/applicationSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Building2, Briefcase, Users } from "lucide-react";
import Navbar from "../shared/Navbar";
import { toast } from "sonner";

const RecruiterDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { jobs } = useSelector((state) => state.job);
  const { companies } = useSelector((state) => state.company);
  const { applications } = useSelector((state) => state.application);

  useEffect(() => {
    if (user?.isBanned) {
      toast.error("Your account has been banned. Please contact the administrator.");
      navigate("/verification-status");
      return;
    }

    if (!user?.isVerified) {
      toast.error("Your account is pending verification. Please wait for admin approval.");
      navigate("/verification-status");
      return;
    }

    dispatch(fetchRecruiterJobs());
    dispatch(fetchRecruiterCompanies());
    dispatch(fetchRecruiterApplications());
  }, [dispatch, user, navigate]);

  if (user?.isBanned || !user?.isVerified) {
    return null; // Don't render anything if banned or not verified
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6 mt-12">
          <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>
          <div className="flex gap-4">
            <Button
              onClick={() => navigate("/recruiter/company/create")}
              className="flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Create Company
            </Button>
            <Button
              onClick={() => navigate("/recruiter/job/create")}
              className="flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Post Job
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companies?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobs?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications?.length || 0}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default RecruiterDashboard; 