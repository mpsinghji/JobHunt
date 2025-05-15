import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle, Ban } from "lucide-react";
import Navbar from "../shared/Navbar";

const VerificationStatus = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          {user.isBanned ? (
            <>
              <div className="flex justify-center">
                <Ban className="h-16 w-16 text-red-500" />
              </div>
              <h1 className="text-3xl font-bold text-red-500">Account Banned</h1>
              <p className="text-gray-600">
                Your account has been banned by the administrator. Please contact support for more information.
              </p>
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="mt-4"
              >
                Return to Home
              </Button>
            </>
          ) : !user.isVerified ? (
            <>
              <div className="flex justify-center">
                <AlertCircle className="h-16 w-16 text-yellow-500" />
              </div>
              <h1 className="text-3xl font-bold text-yellow-500">Account Pending Verification</h1>
              <p className="text-gray-600">
                Your account is currently under review by our administrators. This process typically takes 24-48 hours.
                You will be notified once your account is verified.
              </p>
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="mt-4"
              >
                Return to Home
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default VerificationStatus; 