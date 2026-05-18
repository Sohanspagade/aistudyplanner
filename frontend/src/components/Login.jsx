import React, { useState } from "react";
import axios from "axios";

function Login({ onLoginSuccess }) {

    // =====================================
    // STATES
    // =====================================

    const [isRegister, setIsRegister] =
        useState(false);

    const [username, setUsername] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    // =====================================
    // LOGIN
    // =====================================

    const login = async () => {

        if (!username || !password) {

            alert("Please fill all fields");
            return;
        }

        try {

            setLoading(true);

            const res =
                await axios.post(
                    "http://localhost:7000/login",
                    {
                        username,
                        password
                    }
                );

            localStorage.setItem(
                "token",
                res.data.token
            );

            localStorage.setItem(
                "userId",
                res.data.userId
            );
            localStorage.setItem(
    "user",
    username
);


            onLoginSuccess(username);

        } catch (err) {

            console.log(err);

            alert("Invalid Username or Password");

        } finally {

            setLoading(false);
        }
    };

    // =====================================
    // REGISTER
    // =====================================

    const register = async () => {

        if (!username || !password) {

            alert("Please fill all fields");
            return;
        }

        try {

            setLoading(true);

            const res =
                await axios.post(
                    "http://localhost:7000/register",
                    {
                        username,
                        password
                    }
                );

            alert(
                res.data.message ||
                "Registered Successfully"
            );

            setIsRegister(false);

        } catch (err) {

            console.log(err);

            alert("Registration Failed");

        } finally {

            setLoading(false);
        }
    };

    // =====================================
    // UI
    // =====================================

    return (

        <div
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background:
                    "linear-gradient(135deg,#0f172a,#1e293b)",
                fontFamily: "Arial"
            }}
        >

            {/* CARD */}

            <div
                style={{
                    width: "400px",
                    background: "#111827",
                    padding: "40px",
                    borderRadius: "22px",
                    boxShadow:
                        "0 10px 40px rgba(0,0,0,0.5)",
                    border:
                        "1px solid #1e293b"
                }}
            >

                {/* HEADER */}

                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "30px"
                    }}
                >

                    <h1
                        style={{
                            color: "white",
                            marginBottom: "10px",
                            fontSize: "32px"
                        }}
                    >
                        AI Study Planner
                    </h1>

                    <p
                        style={{
                            color: "#94a3b8",
                            fontSize: "14px"
                        }}
                    >
                        {
                            isRegister
                                ? "Create new account"
                                : "Login to continue"
                        }
                    </p>

                </div>

                {/* USERNAME */}

                <div
                    style={{
                        marginBottom: "20px"
                    }}
                >

                    <label
                        style={{
                            color: "#cbd5e1",
                            display: "block",
                            marginBottom: "8px",
                            fontSize: "14px"
                        }}
                    >
                        Username
                    </label>

                    <input
                        type="text"

                        placeholder="Enter username"

                        value={username}

                        onChange={(e) =>
                            setUsername(
                                e.target.value
                            )
                        }

                        style={{
                            width: "100%",
                            padding: "14px",
                            borderRadius: "12px",
                            border:
                                "1px solid #334155",
                            background: "#0f172a",
                            color: "white",
                            outline: "none",
                            fontSize: "15px",
                            boxSizing: "border-box"
                        }}
                    />

                </div>

                {/* PASSWORD */}

                <div
                    style={{
                        marginBottom: "25px"
                    }}
                >

                    <label
                        style={{
                            color: "#cbd5e1",
                            display: "block",
                            marginBottom: "8px",
                            fontSize: "14px"
                        }}
                    >
                        Password
                    </label>

                    <input
                        type="password"

                        placeholder="Enter password"

                        value={password}

                        onChange={(e) =>
                            setPassword(
                                e.target.value
                            )
                        }

                        onKeyDown={(e) => {

                            if (
                                e.key === "Enter"
                            ) {

                                isRegister
                                    ? register()
                                    : login();
                            }
                        }}

                        style={{
                            width: "100%",
                            padding: "14px",
                            borderRadius: "12px",
                            border:
                                "1px solid #334155",
                            background: "#0f172a",
                            color: "white",
                            outline: "none",
                            fontSize: "15px",
                            boxSizing: "border-box"
                        }}
                    />

                </div>

                {/* BUTTON */}

                <button
                    onClick={
                        isRegister
                            ? register
                            : login
                    }

                    disabled={loading}

                    style={{
                        width: "100%",
                        padding: "15px",
                        border: "none",
                        borderRadius: "14px",
                        background:
                            "linear-gradient(90deg,#06b6d4,#3b82f6)",
                        color: "white",
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        marginBottom: "18px"
                    }}
                >

                    {
                        loading
                            ? (
                                isRegister
                                    ? "Registering..."
                                    : "Logging in..."
                            )
                            : (
                                isRegister
                                    ? "Register"
                                    : "Login"
                            )
                    }

                </button>

                {/* SWITCH */}

                <div
                    style={{
                        textAlign: "center"
                    }}
                >

                    <span
                        style={{
                            color: "#94a3b8",
                            fontSize: "14px"
                        }}
                    >
                        {
                            isRegister
                                ? "Already have account?"
                                : "New user?"
                        }
                    </span>

                    <button
                        onClick={() =>
                            setIsRegister(
                                !isRegister
                            )
                        }

                        style={{
                            background: "none",
                            border: "none",
                            color: "#3b82f6",
                            marginLeft: "8px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "14px"
                        }}
                    >
                        {
                            isRegister
                                ? "Login"
                                : "Register"
                        }
                    </button>

                </div>

                {/* FOOTER */}

                <p
                    style={{
                        color: "#64748b",
                        textAlign: "center",
                        marginTop: "25px",
                        fontSize: "12px"
                    }}
                >
                    Secure JWT Authentication
                </p>

            </div>

        </div>
    );
}

export default Login;