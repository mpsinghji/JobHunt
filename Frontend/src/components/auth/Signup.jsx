import React from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { RadioGroup } from "../ui/radio-group";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "../../utils/constants";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/authSlice";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phonenumber: "",
    password: "",
    role: "",
    profilePhoto: null,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, profilePhoto: e.target.files?.[0] || null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    const formData = new FormData();
    formData.append("fullname", input.fullname.trim());
    formData.append("email", input.email.trim());
    formData.append("phonenumber", input.phonenumber.trim());
    formData.append("password", input.password);
    formData.append("role", input.role === "jobseeker" ? "Jobseeker" : "Recruiter");

    if (input.profilePhoto) {
      formData.append("profilePhoto", input.profilePhoto);
    } else {
      formData.append("profilePhoto", `https://avatar.iran.liara.run/public/boy?username=${input.email}`);
    }

    try {
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Registration successful!");
        navigate("/login");
      } else {
        toast.error(res.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.status === 400 && error.response?.data?.message === "Email already exists") {
        toast.error("Email already exists. Please use a different email address.");
      } else {
        toast.error(error.response?.data?.message || "Registration failed. Please try again.");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Join us and start your journey
            </p>
          </div>
          <form onSubmit={handleSubmit} className="bg-white py-8 px-6 shadow-xl rounded-lg">
            <div className="space-y-6">
              <div>
                <Label className="block text-sm font-medium text-gray-700">Full Name</Label>
                <div className="mt-1">
                  <Input
                    type="text"
                    name="fullname"
                    placeholder="Full Name"
                    value={input.fullname}
                    onChange={changeEventHandler}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700">Phone Number</Label>
                <div className="mt-1">
                  <Input
                    type="tel"
                    name="phonenumber"
                    placeholder="Phone Number"
                    value={input.phonenumber}
                    onChange={changeEventHandler}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700">Email</Label>
                <div className="mt-1">
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={input.email}
                    onChange={changeEventHandler}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700">Password</Label>
                <div className="mt-1">
                  <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={input.password}
                    onChange={changeEventHandler}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Role</Label>
                  <RadioGroup className="flex flex-row space-x-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        type="radio"
                        name="role"
                        value="jobseeker"
                        checked={input.role === "jobseeker"}
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
                        checked={input.role === "recruiter"}
                        onChange={changeEventHandler}
                        className="h-4 w-4 text-blue-600 cursor-pointer"
                        required
                      />
                      <Label className="text-sm text-gray-700">Recruiter</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</Label>
                  <Input
                    accept="image/*"
                    type="file"
                    onChange={changeFileHandler}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              {loading ? (
                <Button className="w-full my-4" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full my-4"
                >
                  Create Account
                </Button>
              )}
            </div>

            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                  Sign in
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
