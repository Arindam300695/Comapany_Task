import React, { useEffect, useState } from "react";
import myImage from "../assets/Mobile-login-Cristina.jpg";
import axios from "axios";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
const baseUrl = "http://localhost:4000";
const Signup = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) return navigate("/welcome");
    }, []);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log("Form submitted with data:", formData);
        try {
            const {
                data, // Access data directly within the response object
            } = await axios.post(`${baseUrl}/api/auth/signup`, formData);
            toast.success(data.message);
            if (data.message) navigate("/login");
            // Use toast.success(data.message) for success message
        } catch (error) {
            toast.error(error.response.data.error);
            // Use toast.error(error.response.data.error) for error message
        }
    };

    return (
        <>
            <Navbar />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-screen min-h-screen">
                {/* signup image starts */}
                <div>
                    <img
                        src={myImage}
                        alt="signup image"
                        className="hidden sm:block h-screen max-w-full"
                    />
                </div>
                {/* signup image ends */}

                {/* signup form section starts */}
                <div>
                    <form className="bg-slate-800 text-white min-h-[30rem] flex flex-col gap-3 justify-center m-auto mt-20 max-w-md p-6 rounded-2xl border border-purple-300 shadow-lg shadow-purple-600">
                        <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
                        <div className="mb-4">
                            <label htmlFor="firstName" className="block mb-1">
                                First Name
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded focus:bg-slate-700 focus:text-slate-100 text-slate-900"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="lastName" className="block mb-1">
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded focus:bg-slate-700 focus:text-slate-100 text-slate-900"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded focus:bg-slate-700 focus:text-slate-100 text-slate-900"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded focus:bg-slate-700 focus:text-slate-100 text-slate-900"
                            />
                        </div>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                        >
                            Sign Up
                        </button>
                        <h2 className="text-xl text-highlight">
                            Already have an Account?
                            <NavLink to="/login">
                                <button className="bg-violet-400 rounded-xl m-2 text-slate-900 font-bold active:scale-75 transition-all duration-300 p-2">
                                    {" "}
                                    Click here{" "}
                                </button>
                            </NavLink>
                            to visit Login Page
                        </h2>
                    </form>
                </div>
                {/* signup form section ends */}
            </div>
        </>
    );
};

export default Signup;
