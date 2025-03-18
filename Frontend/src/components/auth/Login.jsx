import React from "react";
import Navbar from "../Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { RadioGroup } from "../ui/radio-group";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { USER_API_END_POINT } from "../utils/constants";
import axios from "axios";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!input.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!input.password) {
      toast.error("Password is required");
      return;
    }
    if (!input.role) {
      toast.error("Please select a role");
      return;
    }

    // Transform role to match backend expectations
    const loginData = {
      ...input,
      role: input.role === "jobseeker" ? "Jobseeker" : "Recruiter"
    };

    console.log("Login attempt with data:", loginData);

    try {
      const response = await axios.post(`${USER_API_END_POINT}/login`, loginData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      console.log("Login response:", response.data);

      if (response.data.success) {
        toast.success(response.data.message || "Login successful!");
        navigate("/");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please sign in to your account
            </p>
          </div>
          <form onSubmit={submitHandler} className="bg-white py-8 px-6 shadow-xl rounded-lg">
            <div className="space-y-6">
              <div>
                <Label className="block text-sm font-medium text-gray-700">Email</Label>
                <div className="mt-1">
                  <Input
                    type="email"
                    value={input.email}
                    name="email"
                    onChange={changeEventHandler}
                    placeholder="Enter your email"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700">Password</Label>
                <div className="mt-1 relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={input.password}
                    name="password"
                    onChange={changeEventHandler}
                    placeholder="Enter your password"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Role</Label>
                <RadioGroup className="flex items-center gap-6">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="radio"
                      name="role"
                      value="jobseeker"
                      checked={input.role === 'jobseeker'}
                      onChange={changeEventHandler}
                      className="h-4 w-4 text-blue-600 cursor-pointer"
                      required
                    />
                    <Label className="text-sm text-gray-700">Jobseeker</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="radio"
                      name="role"
                      value="recruiter"
                      checked={input.role === 'recruiter'}
                      onChange={changeEventHandler}
                      className="h-4 w-4 text-blue-600 cursor-pointer"
                      required
                    />
                    <Label className="text-sm text-gray-700">Recruiter</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="mt-6">
              <Button 
                type="submit" 
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Sign in
              </Button>
            </div>

            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                  Sign up
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;