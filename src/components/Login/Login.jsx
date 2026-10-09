import "./Login.css";
import { useState } from "react";
import { loginUser, registerUser } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
function Login({ setShowLogin, setUser }) {

    const [isRegister, setIsRegister] = useState(false);
    
    const [successMessage, setSuccessMessage] = useState("");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");

    
    const navigate = useNavigate();


    // LOGIN

    const handleLogin = async (e) => {

        e.preventDefault();


        if (!identifier || !password) {

            alert("Please enter email/mobile and password");

            return;
        }


        try {

            const response = await loginUser({
                identifier: identifier,
                password: password
            });


            console.log("LOGIN RESPONSE:", response.data);

            setUser(response.data.user);

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

           setSuccessMessage("Login successful!");

            setTimeout(() => {
                setShowLogin(false);
            }, 1000);
            

            if (response.data.user.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/");
            }


        } catch (error) {

            console.error("LOGIN ERROR:", error);

            alert(
                error.response?.data?.message ||
                "Login failed"
            );

        }

    };

    //LOGOUT

    const handleLogout = () => {

    localStorage.removeItem("user");

    setUser(null);

    setUserMenuOpen(false);
};



    // REGISTER

    const handleRegister = async (e) => {

        e.preventDefault();


        if (!name || !email || !mobile || !password) {

            alert("Please fill all the fields");

            return;
        }


        if (password.length < 8) {

            alert("Password must be at least 8 characters");

            return;
        }


        try {

            const response = await registerUser({

                

                name: name,

                email: email,

                mobile: mobile,

                password: password

            });


            console.log(
                "REGISTER RESPONSE:",
                response.data
            );


            setSuccessMessage("Registration successful!");

            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);


            // Clear register form

            setName("");
            setEmail("");
            setMobile("");
            setPassword("");


            // Switch back to Login

            setIsRegister(false);


        } catch (error) {

            console.error(
                "REGISTER ERROR:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Registration failed"
            );

        }

    };


    return (

        <div className="login-overlay">

            <div className="login-popup">


                {/* CLOSE */}

                <button
                    className="close-login"
                    onClick={() => setShowLogin(false)}
                >
                    ×
                </button>

                {successMessage && (
                    <div className="login-success">
                        ✓ {successMessage}
                        </div>
                )}


                {/* LOGIN */}

                {!isRegister && (

                    <>

                        <h2>Login</h2>


                        <form onSubmit={handleLogin}>

                            <input
                                type="text"
                                placeholder="Email or Mobile Number"
                                value={identifier}
                                onChange={(e) =>
                                    setIdentifier(e.target.value)
                                }
                            />


                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                            />


                            <button type="submit">
                                Login
                            </button>

                        </form>


                        <p>

                            Don't have an account?

                            <button
                                className="register-link"
                                onClick={() =>
                                    setIsRegister(true)
                                }
                            >
                                Register
                            </button>

                        </p>

                    </>

                )}


                {/* REGISTER */}

                {isRegister && (

                    <>

                        <h2>Create Account</h2>


                        <form onSubmit={handleRegister}>


                            {/* NAME */}

                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                            />


                            {/* EMAIL */}

                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                            />


                            {/* MOBILE */}

                            <input
                                type="tel"
                                placeholder="Mobile Number"
                                value={mobile}
                                onChange={(e) =>
                                    setMobile(e.target.value)
                                }
                            />


                            {/* PASSWORD */}

                            <input
                                type="password"
                                placeholder="Password (minimum 8 characters)"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                            />


                            <button type="submit">
                                Register
                            </button>


                        </form>


                        <p>

                            Already have an account?

                            <button
                                className="register-link"
                                onClick={() =>
                                    setIsRegister(false)
                                }
                            >
                                Login
                            </button>

                        </p>

                    </>

                )}

            </div>

        </div>

    );

}

export default Login;