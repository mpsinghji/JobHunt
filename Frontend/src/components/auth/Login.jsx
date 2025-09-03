import React, { useEffect } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { RadioGroup } from "../ui/radio-group";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { USER_API_END_POINT } from "../../utils/constants";
import axios from "axios";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "../../redux/authSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "jobseeker",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { loading , user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    const loginData = {
      ...input,
      role: input.role === "jobseeker" ? "Jobseeker" : "Recruiter",
    };
    // console.log("Login attempt with data:", loginData);
    try {
      const response = await axios.post(
        `${USER_API_END_POINT}/login`,
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      // console.log("Login response:", response.data);
      if (response.data.success) {
        dispatch(setUser(response.data.user));
        toast.success(response.data.message || "Login successful!");
        navigate("/");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      dispatch(setLoading(false));
    }
  };
  useEffect(()=>{
    if(user){
      navigate("/");
    }
  })
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
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
          <form
            onSubmit={submitHandler}
            className="bg-white py-8 px-6 shadow-xl rounded-lg"
          >
            <div className="space-y-6">
              <div>
                <Label className="block text-sm font-medium text-gray-700">
                  Email
                </Label>
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
                <Label className="block text-sm font-medium text-gray-700">
                  Password
                </Label>
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
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </Label>
                <RadioGroup defaultValue="jobseeker" className="flex items-center gap-6">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="radio"
                      name="role"
                      value="jobseeker"
                      defaultChecked
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
                      onChange={changeEventHandler}
                      className="h-4 w-4 text-blue-600 cursor-pointer"
                      required
                    />
                    <Label className="text-sm text-gray-700">Recruiter</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full text-gray-600 border-gray-300 hover:bg-gray-50"
                    >
                      Try Demo Account <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full" align="center">
                    <DropdownMenuItem
                      className="flex items-center cursor-pointer hover:bg-blue-50"
                      onClick={() => {
                        setInput({
                          email: "testRecruiter@gmail.com",
                          password: "12345678",
                          role: "recruiter"
                        });
                      }}
                    >
                      <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="font-medium">Recruiter Account</p>
                        <p className="text-xs text-gray-500">testRecruiter@gmail.com</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center cursor-pointer hover:bg-green-50"
                      onClick={() => {
                        setInput({
                          email: "testuser@gmail.com",
                          password: "12345678",
                          role: "jobseeker"
                        });
                      }}
                    >
                      <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <div>
                        <p className="font-medium">Job Seeker Account</p>
                        <p className="text-xs text-gray-500">testuser@gmail.com</p>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {loading ? (
              <Button className="w-full my-4" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
              </Button>
            ) : (
              <Button type="submit" className="w-full my-4">
                Sign in
              </Button>
            )}
            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
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
