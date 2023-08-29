import React, { useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const baseUrl = "http://localhost:4000";

const Navbar = () => {
    const navigate = useNavigate();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // logoutHandler function
    const logoutHandler = async () => {
        try {
            const { data } = await axios.get(`${baseUrl}/api/auth/logout`, {
                withCredentials: true,
            });
            if (data) {
                toast.success(data);
                setLoggedIn(false);
                localStorage.removeItem("user");
                navigate("/");
            }
        } catch (error) {
            toast.error(error.response.data.error);
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setLoggedIn(true);
            setUser(user);
        }
    }, []);

    return (
        <nav className="bg-blue-500 p-4">
            <div className="flex justify-between items-center">
                <div>
                    <NavLink to="/" className="text-white font-bold text-lg">
                        My App
                    </NavLink>
                </div>
                <div>
                    {loggedIn && (
                        <div className="hidden md:flex space-x-4">
                            <h2 className="text-white">
                                Welcome {user.firstName + " " + user.lastName}
                            </h2>
                            <NavLink
                                className="text-white"
                                onClick={logoutHandler}
                            >
                                Logout
                            </NavLink>
                        </div>
                    )}
                </div>
                <div className="md:hidden">
                    <button onClick={toggleMobileMenu} className="text-white">
                        <FiMenu className="h-6 w-6" />
                    </button>
                </div>
            </div>
            {isMobileMenuOpen && (
                <div>
                    {loggedIn && (
                        <div className="mt-4 md:hidden">
                            <h2 className="block text-white py-2">
                                Welcome {user.firstName + " " + user.lastName}
                            </h2>
                            <NavLink
                                className="block text-white py-2"
                                onClick={logoutHandler}
                            >
                                Logout
                            </NavLink>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
