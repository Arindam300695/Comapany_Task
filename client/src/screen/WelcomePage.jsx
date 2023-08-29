import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import { toast } from "react-hot-toast";

const baseUrl = "http://localhost:4000";

const Welcome = () => {
    const navigate = useNavigate();

    const [popupOpen, setPopupOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [walletBalance, setWalletBalance] = useState(null);
    const [user, setUser] = useState(null);
    const openPopup = () => {
        setPopupOpen(true);
    };

    const closePopup = () => {
        setPopupOpen(false);
        setInputValue("");
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = async () => {
        console.log("Input value:", inputValue);
        const { data } = await axios.patch(
            `${baseUrl}/api/auth/updateWalletBalance`,
            { inputValue },
            {
                withCredentials: true,
            }
        );
        if (data?.newUserData?.topup) {
            setWalletBalance(data?.newUserData?.topup);
            localStorage.setItem("user", JSON.stringify(data?.newUserData));
        }
        if (data.message) {
            toast.success(data.message);
            closePopup();
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return navigate("/login");
        if (user) {
            setUser(user);
            const findUser = async () => {
                const { data } = await axios.get(
                    `${baseUrl}/api/auth/findUserData`,
                    { withCredentials: true }
                );
                if (data) setWalletBalance(data?.userData?.topup);
            };
            findUser();
        }
    }, []);

    return (
        <>
            <Navbar />
            <div className="flex flex-col gap-5 justify-center items-center h-screen">
                <div className="flex items-end justify-end  p-2 ">
                    <h2 className="text-5xl font-semibold">
                        Your Wallet Ballence is :{" "}
                        <span className="font-bold text-7xl">
                            {walletBalance ? walletBalance : user?.topup}
                        </span>
                    </h2>
                </div>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={openPopup}
                >
                    Recharge Topup
                </button>
                {popupOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-950 bg-opacity-50">
                        <div className="bg-white p-6 rounded shadow-md">
                            <h2 className="text-lg font-semibold mb-4">
                                Recharge Topup
                            </h2>
                            <input
                                type="Number"
                                max={500}
                                className="border rounded w-full p-2 mb-4"
                                placeholder="Enter amount"
                                value={inputValue}
                                onChange={handleInputChange}
                            />
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={handleSubmit}
                            >
                                Submit
                            </button>
                            <button
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2"
                                onClick={closePopup}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Welcome;
