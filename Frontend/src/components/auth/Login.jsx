import React from "react";
import Navbar from "../Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { RadioGroup } from "../ui/radio-group";
import { Link } from "react-router-dom";
import { useState } from "react";
import { USER_API_END_POINT } from "../utils/constants";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });
  
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(`${USER_API_END_POINT}/login`, input,{
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });
        if(response.data.success){
            navigate("/");
            toast.success(response.data.message);
        }
        console.log(response);
    } catch (error) {
        toast.error(error.response.data.message);
        console.log(error);
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
                  />
                </div>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700">Password</Label>
                <div className="mt-1">
                  <Input
                    type="password"
                    value={input.password}
                    name="password"
                    onChange={changeEventHandler}
                    placeholder="Enter your password"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Role</Label>
                <RadioGroup className="flex items-center gap-6">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="radio"
                      name="role"
                      value="student"
                      checked={input.role === 'student'}
                      onChange={changeEventHandler}
                      className="h-4 w-4 text-blue-600 cursor-pointer"
                    />
                    <Label className="text-sm text-gray-700">Student</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="radio"
                      name="role"
                      value="recruiter"
                      checked={input.role === 'recruiter'}
                      onChange={changeEventHandler}
                      className="h-4 w-4 text-blue-600 cursor-pointer"
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