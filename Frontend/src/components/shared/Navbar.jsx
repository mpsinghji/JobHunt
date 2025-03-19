import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { User2, LogOutIcon, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constants";
import { toast } from "sonner";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(`${USER_API_END_POINT}/logout`, {}, {
        withCredentials: true
      });
      dispatch(logout());
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <>
      <div className="bg-white">
        <div className="flex items-center justify-between mx-auto max-w-7xl h-16">
          <div>
            <h1 className="text-2xl font-bold">
              Job<span className="text-blue-500">Hunt</span>
            </h1>
          </div>
          <div className="flex items-center gap-12">
            <ul className="flex font-medium items-center gap-5">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/jobs">Browse Jobs Openings</Link></li>
              {/* <li><Link to="/browse">Browse</Link></li> */}
              {!user && (
                <>
                  {/* <li><Link to="/aboutus">About Us</Link></li> */}
                  <li><Link to="/about">About the Developer</Link></li>
                </>
              )}
            </ul>
            {!user ? (
              <div className="flex items-center gap-2">
                <Link to="/login"><Button variant="outline">Login</Button></Link>
                <Link to="/signup"><Button className="bg-blue-500 text-white hover">Signup</Button></Link>
              </div>
            ) : (
              <Popover className="cursor-pointer">
                <PopoverTrigger asChild>
                  <Avatar>
                    <AvatarImage
                      src={user.profile?.profilePhoto || `https://avatar.iran.liara.run/public/boy?username=${user.email}`}
                      alt={user.fullname}
                      onLoad={() => setImageLoaded(true)}
                      className={imageLoaded ? 'opacity-100' : 'opacity-0'}
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {getInitials(user.fullname)}
                    </AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="flex gap-4 space-y-2">
                    <Avatar>
                      <AvatarImage
                        src={user.profile?.profilePhoto || `https://avatar.iran.liara.run/public/boy?username=${user.email}`}
                        alt={user.fullname}
                        onLoad={() => setImageLoaded(true)}
                        className={imageLoaded ? 'opacity-100' : 'opacity-0'}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {getInitials(user.fullname)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{user.fullname}</h4>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col my-2 text-gray-600">
                    <div className="flex w-fit items-center gap-2 cursor-pointer">
                      <User2 className="w-4 h-4" />
                      <Button variant="link"><Link to="/profile">View Profile</Link></Button>
                    </div>
                    <div className="flex w-fit items-center gap-2 cursor-pointer">
                      <LogOutIcon className="w-4 h-4" />
                      <Button variant="link" onClick={handleLogout}>Logout</Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
