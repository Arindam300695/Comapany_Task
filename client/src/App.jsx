import Signup from "./screen/Signup";
import { Toaster } from "react-hot-toast";
import Login from "./screen/Login";
import { Route, Routes } from "react-router-dom";
import WelcomePage from "./screen/WelcomePage";

const App = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/welcome" element={<WelcomePage />} />
            </Routes>
            <Toaster />
        </div>
    );
};

export default App;
