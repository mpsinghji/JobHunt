import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Loader2, Clock, CheckCircle, AlertCircle, LogOut } from "lucide-react";
import { logout } from "../../redux/authSlice";
import { toast } from "sonner";

const VerificationStatus = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log("Current user state:", user); // Debug log

    if (!user) {
      navigate("/login");
      return;
    }

    // If user is already verified, redirect to appropriate dashboard
    if (user.isVerified) {
      console.log("User is verified, redirecting..."); // Debug log
      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (user.role === "Recruiter") {
        navigate("/companies", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleDashboardClick = () => {
    if (user?.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    } else if (user?.role === "Recruiter") {
      navigate("/companies", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // If user is admin, show admin verification message
  if (user?.role === "admin") {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Admin Account Created
                </h2>
                <p className="text-gray-600">
                  Your admin account has been created successfully
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Your Account Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{user?.fullname}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <p className="font-medium">{user?.role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Verification Status</p>
                      <p className="font-medium">{user?.isVerified ? "Verified" : "Pending"}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Next Steps
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1" />
                      <span className="text-gray-600">
                        You can now access the admin dashboard
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1" />
                      <span className="text-gray-600">
                        Verify and manage recruiter accounts
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1" />
                      <span className="text-gray-600">
                        Monitor job postings and applications
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handleDashboardClick}
                  className="mr-4"
                >
                  Go to Dashboard
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // For recruiter users
  if (user?.role === "Recruiter") {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Account Pending Verification
                </h2>
                <p className="text-gray-600">
                  Your recruiter account is currently under review
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    What happens next?
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1" />
                      <span className="text-gray-600">
                        Our team will review your company and position information
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1" />
                      <span className="text-gray-600">
                        We'll verify your professional credentials
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1" />
                      <span className="text-gray-600">
                        You'll receive an email notification once verified
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Your Account Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{user?.fullname}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{user?.phonenumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <p className="font-medium">{user?.role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Verification Status</p>
                      <p className="font-medium">{user?.isVerified ? "Verified" : "Pending"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg mb-8">
                <div className="flex items-start">
                  <AlertCircle className="h-6 w-6 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Verification Process
                    </h3>
                    <p className="text-gray-600">
                      The verification process typically takes 1-2 business days. During this time, you won't be able to post jobs or access recruiter features. We'll notify you as soon as your account is verified.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

export default VerificationStatus; 