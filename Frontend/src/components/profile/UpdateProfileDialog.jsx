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
import { Loader2, Mail, Phone, MapPin, Link as LinkIcon, User, Calendar, X } from "lucide-react";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import { USER_API_END_POINT } from "../../utils/constants";
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

  const [selectedFiles, setSelectedFiles] = useState({
    profilePhoto: null,
    resume: null
  });

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

  const fileChangeHandler = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // console.log(`Selected ${type}:`, {
      //   name: file.name,
      //   type: file.type,
      //   size: file.size
      // });
      setSelectedFiles(prev => ({
        ...prev,
        [type]: file
      }));
    }
  };

  const handleFileDelete = (fieldName) => {
    setSelectedFiles(prev => ({
      ...prev,
      [fieldName]: null
    }));
    // Reset the file input
    const fileInput = document.getElementById(fieldName);
    if (fileInput) fileInput.value = '';
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      
      // Append basic info
      formData.append("fullname", input.fullname);
      formData.append("email", input.email);
      formData.append("phonenumber", input.phonenumber);
      formData.append("role", user.role);
      formData.append("address", input.address || "");
      formData.append("gender", input.gender || "");
      if (input.dob) {
        formData.append("dob", new Date(input.dob).toISOString());
      }

      // Append profile info
      formData.append("profile.bio", input.bio || "");
      formData.append("profile.skills", input.skills || "");

      // Append social media links
      formData.append("socialMediaLinks.linkedin", input.socialMediaLinks.linkedin || "");
      formData.append("socialMediaLinks.github", input.socialMediaLinks.github || "");
      formData.append("socialMediaLinks.portfolio", input.socialMediaLinks.portfolio || "");

      // Append files if selected
      if (selectedFiles.profilePhoto) {
        formData.append("profilePhoto", selectedFiles.profilePhoto);
      }
      if (selectedFiles.resume) {
        formData.append("resume", selectedFiles.resume);
      }

      // Log form data for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        dispatch(setUser(response.data.user));
        toast.success("Profile updated successfully");
        setOpen(false);
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
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
                  disabled
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
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profilePhoto">Profile Photo</Label>
                  <Input
                    id="profilePhoto"
                    type="file"
                    accept="image/*"
                    onChange={(e) => fileChangeHandler(e, "profilePhoto")}
                    className="cursor-pointer"
                  />
                  {selectedFiles.profilePhoto && (
                    <p className="text-sm text-gray-600">
                      Selected: {selectedFiles.profilePhoto.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resume">Resume (PDF)</Label>
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => fileChangeHandler(e, "resume")}
                    className="cursor-pointer"
                  />
                  {selectedFiles.resume && (
                    <p className="text-sm text-gray-600">
                      Selected: {selectedFiles.resume.name}
                    </p>
                  )}
                </div>
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
