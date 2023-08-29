import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import myImage from "../assets/4707071.jpg";
import { NavLink, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const baseUrl = "http://localhost:4000";

const Login = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) return navigate("/welcome");
    }, []);

    const [formData, setFormData] = useState({
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
        try {
            const { data } = await axios.post(
                `${baseUrl}/api/auth/login`,
                formData,
                {
                    withCredentials: true,
                }
            );
            toast.success(data.message);
            console.log(data);
            if (data.user)
                localStorage.setItem("user", JSON.stringify(data.user));
            if (data.message) navigate("/welcome");
        } catch (error) {
            toast.error(error.response.data.error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-screen min-h-screen">
                {/* login image starts */}
                <div>
                    <img
                        src={myImage}
                        alt="login image"
                        className="hidden sm:block h-screen max-w-full"
                    />
                </div>
                {/* login image ends */}

                {/* login form section starts */}
                <div>
                    <form className="bg-slate-800 min-h-[30rem] flex flex-col gap-5 justify-center text-white m-auto mt-20 max-w-md p-6 rounded-2xl border border-purple-300 shadow-lg shadow-purple-600">
                        <h2 className="text-2xl font-semibold mb-4">Login</h2>
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
                            Login
                        </button>
                        <h2 className="text-xl text-highlight">
                            DoNot have an Account?
                            <NavLink to="/">
                                <button className="bg-violet-400 rounded-xl m-2 text-slate-900 font-bold active:scale-75 transition-all duration-300 p-2">
                                    Click here
                                </button>
                            </NavLink>
                            to visit Signup Page
                        </h2>
                    </form>
                </div>
                {/* login form section ends */}
            </div>
        </>
    );
};

export default Login;
