import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Loader2, Mail, Phone, MapPin, Link as LinkIcon, User, Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import { USER_API_END_POINT } from "./../utils/constants";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "../../redux/authSlice";
import { useDispatch } from "react-redux";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phonenumber: user?.phonenumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(",") || "",
    resume: user?.profile?.resume || "",
    address: user?.address || "",
    gender: user?.gender || "",
    dob: user?.dob ? new Date(user.dob).toISOString().split('T')[0] : "",
    socialMediaLinks: {
      linkedin: user?.socialMediaLinks?.linkedin || "",
      github: user?.socialMediaLinks?.github || "",
      portfolio: user?.socialMediaLinks?.portfolio || "",
    }
  });

  const [file, setFile] = useState(null);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('socialMediaLinks.')) {
      const platform = name.split('.')[1];
      setInput(prev => ({
        ...prev,
        socialMediaLinks: {
          ...prev.socialMediaLinks,
          [platform]: value
        }
      }));
    } else {
      setInput(prev => ({ ...prev, [name]: value }));
    }
  };

  const fileChangeHandler = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setInput(prev => ({ ...prev, resume: selectedFile.name }));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(input);
    const formData = new FormData();
    
    // Append all input fields
    Object.keys(input).forEach(key => {
      if (key === 'socialMediaLinks') {
        formData.append(key, JSON.stringify(input[key]));
      } else {
        formData.append(key, input[key]);
      }
    });

    if (file) {
      formData.append("file", file);
    }

    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Update Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={submitHandler} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullname" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={input.fullname}
                  onChange={changeEventHandler}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={input.email}
                  onChange={changeEventHandler}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phonenumber" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  type="tel"
                  id="phonenumber"
                  name="phonenumber"
                  value={input.phonenumber}
                  onChange={changeEventHandler}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                <Input
                  type="text"
                  id="address"
                  name="address"
                  value={input.address}
                  onChange={changeEventHandler}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender" className="flex items-center gap-2">
                  {/* <Gender className="h-4 w-4" /> */}
                  Gender
                </Label>
                <Select
                  value={input.gender}
                  onValueChange={(value) => setInput(prev => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date of Birth
                </Label>
                <Input
                  type="date"
                  id="dob"
                  name="dob"
                  value={input.dob}
                  onChange={changeEventHandler}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  type="text"
                  id="bio"
                  name="bio"
                  value={input.bio}
                  onChange={changeEventHandler}
                  placeholder="Write a brief description about yourself"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills">Skills</Label>
                <Input
                  type="text"
                  id="skills"
                  name="skills"
                  value={input.skills}
                  onChange={changeEventHandler}
                  placeholder="Enter skills (comma separated)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resume">Resume</Label>
                <Input
                  type="file"
                  id="resume"
                  name="resume"
                  accept="application/pdf"
                  onChange={fileChangeHandler}
                />
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Social Media Links</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  LinkedIn Profile
                </Label>
                <Input
                  type="url"
                  id="linkedin"
                  name="socialMediaLinks.linkedin"
                  value={input.socialMediaLinks.linkedin}
                  onChange={changeEventHandler}
                  placeholder="https://linkedin.com/in/your-profile"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github" className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  GitHub Profile
                </Label>
                <Input
                  type="url"
                  id="github"
                  name="socialMediaLinks.github"
                  value={input.socialMediaLinks.github}
                  onChange={changeEventHandler}
                  placeholder="https://github.com/your-profile"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolio" className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  Portfolio Website
                </Label>
                <Input
                  type="url"
                  id="portfolio"
                  name="socialMediaLinks.portfolio"
                  value={input.socialMediaLinks.portfolio}
                  onChange={changeEventHandler}
                  placeholder="https://your-portfolio.com"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            {loading ? (
              <Button className="w-full" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
              </Button>
            ) : (
              <Button type="submit" className="w-full">
                Update Profile
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
