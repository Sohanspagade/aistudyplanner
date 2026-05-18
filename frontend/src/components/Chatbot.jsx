// src/components/Chatbot.jsx

import React, {
    useEffect,
    useRef,
    useState
} from "react";

import axios from "axios";

function Chatbot() {

    // =========================================
    // STATES
    // =========================================

    const [input, setInput] = useState("");

    const [messages, setMessages] = useState([]);

    const [sessions, setSessions] = useState([]);

    const [currentSessionId, setCurrentSessionId] =
        useState(null);

    // AI typing loading state
    const [isTyping, setIsTyping] =
        useState(false);

    const messagesEndRef = useRef(null);

    // =========================================
    // USER ID
    // =========================================

    const userId =
        localStorage.getItem("userId");

    // =========================================
    // AUTO SCROLL
    // =========================================

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages, isTyping]);

    useEffect(() => {

    const token =
        localStorage.getItem("token");

    if (!token) {

        window.location.href = "/";
    }

}, []);

    // =========================================
    // LOAD SESSIONS
    // =========================================

    useEffect(() => {

        if (
            !userId ||
            userId === "undefined"
        ) {
            return;
        }

        loadSessions();

    }, []);

    const loadSessions = async () => {

        try {

            const res =
                await axios.get(
                    `http://localhost:7000/chat-sessions/${userId}`
                );

            setSessions(res.data);

        } catch (err) {

            console.log(err);
        }
    };

    // =========================================
    // LOAD CHAT HISTORY
    // =========================================

    const loadChats = async (sessionId) => {

        try {

            const res =
                await axios.get(
                    `http://localhost:7000/chat-history/${sessionId}`
                );

            setMessages(res.data);

            setCurrentSessionId(sessionId);

        } catch (err) {

            console.log(err);
        }
    };

    // =========================================
    // START NEW CHAT
    // =========================================

    const startNewChat = () => {

        setMessages([]);

        setCurrentSessionId(null);
    };

    // =========================================
    // DELETE CHAT
    // =========================================

    const deleteChat = async (sessionId) => {

        try {

            await axios.delete(
                `http://localhost:7000/delete-chat/${sessionId}`
            );

            loadSessions();

            if (
                currentSessionId === sessionId
            ) {

                setMessages([]);

                setCurrentSessionId(null);
            }

        } catch (err) {

            console.log(err);
        }
    };

    // =========================================
    // SEND MESSAGE
    // =========================================

    const sendMessage = async () => {

        if (!input.trim()) {
            return;
        }

        try {

            const userText = input;

            // USER MESSAGE
            const userMessage = {
                role: "user",
                text: userText
            };

            setMessages(prev => [
                ...prev,
                userMessage
            ]);

            setInput("");

            // SHOW TYPING
            setIsTyping(true);

            let activeSessionId =
                currentSessionId;

            // =================================
            // CREATE NEW SESSION
            // =================================

            if (!activeSessionId) {

                const newChat =
                    await axios.post(
                        "http://localhost:7000/new-chat",
                        {
                            userId:
                                Number(userId)
                        }
                    );

                activeSessionId =
                    newChat.data.sessionId;

                setCurrentSessionId(
                    activeSessionId
                );

                loadSessions();
            }

            // =================================
            // AI RESPONSE
            // =================================

            const aiRes =
                await axios.post(
                    "http://localhost:7000/chat",
                    {
                        message: userText
                    }
                );

            const aiReply =
                aiRes.data.reply;

            // HIDE TYPING
            setIsTyping(false);

            // AI MESSAGE
            const aiMessage = {
                role: "ai",
                text: aiReply
            };

            setMessages(prev => [
                ...prev,
                aiMessage
            ]);

            // =================================
            // SAVE CHAT
            // =================================

            await axios.post(
                "http://localhost:7000/save-chat",
                {
                    userId:
                        Number(userId),

                    sessionId:
                        activeSessionId,

                    message: userText,

                    response: aiReply
                }
            );

            loadSessions();

        } catch (err) {

            console.log(err);

            setIsTyping(false);
        }
    };

    // =========================================
    // UI
    // =========================================

    return (

        <div
            style={{
                display: "flex",
                height: "100vh",
                background: "#0f172a",
                fontFamily: "Arial"
            }}
        >

            {/* ================================= */}
            {/* SIDEBAR */}
            {/* ================================= */}

            <div
                style={{
                    width: "300px",
                    background: "#111827",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    borderRight:
                        "1px solid #1f2937"
                }}
            >

                {/* TOP */}

                <div
                    style={{
                        padding: "20px",
                        borderBottom:
                            "1px solid #1f2937"
                    }}
                >

                    <h2
                        style={{
                            margin: 0,
                            marginBottom: "15px",
                            fontSize: "22px"
                        }}
                    >
                        SSP Chatbot
                    </h2>

                    <button
                        onClick={startNewChat}
                        style={{
                            width: "100%",
                            padding: "12px",
                            background:
                                "linear-gradient(90deg,#06b6d4,#3b82f6)",

                            color: "white",

                            border: "none",

                            borderRadius: "10px",

                            cursor: "pointer",

                            fontSize: "15px",

                            fontWeight: "bold"
                        }}
                    >
                        + New Chat
                    </button>

                </div>

                {/* SESSIONS */}

                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "15px"
                    }}
                >

                    {
                        sessions.map(session => (

                            <div
                                key={session.id}

                                style={{
                                    background:
                                        currentSessionId ===
                                        session.id
                                            ? "#1e293b"
                                            : "#0f172a",

                                    padding: "14px",

                                    borderRadius: "12px",

                                    marginBottom: "12px",

                                    display: "flex",

                                    justifyContent:
                                        "space-between",

                                    alignItems: "center",

                                    border:
                                        currentSessionId ===
                                        session.id
                                            ? "1px solid #3b82f6"
                                            : "1px solid #1e293b",

                                    transition:
                                        "0.3s"
                                }}
                            >

                                <div
                                    onClick={() =>
                                        loadChats(
                                            session.id
                                        )
                                    }

                                    style={{
                                        flex: 1,
                                        cursor: "pointer",
                                        fontSize: "14px"
                                    }}
                                >
                                    💬 {session.title}
                                </div>

                                <button
                                    onClick={() =>
                                        deleteChat(
                                            session.id
                                        )
                                    }

                                    style={{
                                        background:
                                            "transparent",

                                        border: "none",

                                        color: "#ef4444",

                                        cursor: "pointer",

                                        fontSize: "16px"
                                    }}
                                >
                                    🗑
                                </button>

                            </div>
                        ))
                    }

                </div>
                <button
    onClick={() => {

        localStorage.clear();

        window.location.href = "/";
    }}
>
    Logout
</button>

            </div>

            {/* ================================= */}
            {/* CHAT AREA */}
            {/* ================================= */}

            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column"
                }}
            >

                {/* HEADER */}

                <div
                    style={{
                        padding: "20px",
                        borderBottom:
                            "1px solid #1e293b",

                        color: "white",

                        background: "#111827",

                        fontSize: "20px",

                        fontWeight: "bold"
                    }}
                >
                    AI Study Assistant
                </div>

                {/* MESSAGES */}

                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "30px"
                    }}
                >

                    {
                        messages.map(
                            (msg, index) => (

                                <div
                                    key={index}

                                    style={{
                                        display: "flex",

                                        justifyContent:
                                            msg.role ===
                                            "user"
                                                ? "flex-end"
                                                : "flex-start",

                                        marginBottom:
                                            "20px"
                                    }}
                                >

                                    <div
                                        style={{
                                            background:
                                                msg.role ===
                                                "user"
                                                    ? "linear-gradient(90deg,#06b6d4,#3b82f6)"
                                                    : "#1e293b",

                                            color:
                                                "white",

                                            padding:
                                                "14px 18px",

                                            borderRadius:
                                                "18px",

                                            maxWidth:
                                                "70%",

                                            lineHeight:
                                                "1.6",

                                            fontSize:
                                                "15px",

                                            boxShadow:
                                                "0 4px 15px rgba(0,0,0,0.2)"
                                        }}
                                    >
                                        {msg.text}
                                    </div>

                                </div>
                            )
                        )
                    }

                    {/* ================================= */}
                    {/* AI TYPING ANIMATION */}
                    {/* ================================= */}

                    {
                        isTyping && (

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "flex-start",
                                    marginBottom:
                                        "20px"
                                }}
                            >

                                <div
                                    style={{
                                        background:
                                            "#1e293b",

                                        color:
                                            "white",

                                        padding:
                                            "14px 18px",

                                        borderRadius:
                                            "18px",

                                        fontSize:
                                            "15px",

                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        gap: "6px"
                                    }}
                                >

                                    AI is typing

                                    <span
                                        style={{
                                            animation:
                                                "blink 1s infinite"
                                        }}
                                    >
                                        .
                                    </span>

                                    <span
                                        style={{
                                            animation:
                                                "blink 1s infinite 0.2s"
                                        }}
                                    >
                                        .
                                    </span>

                                    <span
                                        style={{
                                            animation:
                                                "blink 1s infinite 0.4s"
                                        }}
                                    >
                                        .
                                    </span>

                                </div>

                            </div>
                        )
                    }

                    <div ref={messagesEndRef} />

                </div>

                {/* INPUT */}

                <div
                    style={{
                        padding: "20px",
                        borderTop:
                            "1px solid #1e293b",

                        background: "#111827",

                        display: "flex",

                        gap: "15px"
                    }}
                >

                    <input
                        type="text"

                        value={input}

                        onChange={(e) =>
                            setInput(
                                e.target.value
                            )
                        }

                        onKeyDown={(e) => {

                            if (
                                e.key === "Enter"
                            ) {

                                sendMessage();
                            }
                        }}

                        placeholder="Ask anything..."

                        style={{
                            flex: 1,

                            padding:
                                "16px 18px",

                            borderRadius:
                                "14px",

                            border:
                                "1px solid #334155",

                            background:
                                "#0f172a",

                            color: "white",

                            outline: "none",

                            fontSize: "15px"
                        }}
                    />

                    <button
                        onClick={sendMessage}

                        style={{
                            padding:
                                "14px 28px",

                            border: "none",

                            borderRadius:
                                "14px",

                            background:
                                "linear-gradient(90deg,#06b6d4,#3b82f6)",

                            color: "white",

                            fontWeight: "bold",

                            cursor: "pointer",

                            fontSize: "15px"
                        }}
                    >
                        Send
                    </button>

                </div>

            </div>

            {/* ================================= */}
            {/* CSS ANIMATION */}
            {/* ================================= */}

            <style>
                {`
                    @keyframes blink {
                        0% {
                            opacity: 0.2;
                        }

                        20% {
                            opacity: 1;
                        }

                        100% {
                            opacity: 0.2;
                        }
                    }
                `}
            </style>

        </div>
    );
}

export default Chatbot;