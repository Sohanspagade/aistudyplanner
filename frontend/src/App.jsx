import { useState, useEffect } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [usernameGlobal, setUsernameGlobal] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ important

  // 🔥 Check login on app start
  useEffect(() => {
  const savedUser = localStorage.getItem("user");

  // ✅ Only login if user is valid
  if (savedUser && savedUser.trim() !== "") {
    setUsernameGlobal(savedUser);
    setUserLoggedIn(true);
  } else {
    setUserLoggedIn(false);
  }

  setLoading(false);
}, []);

  // ✅ LOGIN
  const handleLoginSuccess = (username) => {
    localStorage.setItem("user", username);
    setUsernameGlobal(username);
    setUserLoggedIn(true);
  };

  // 🔄 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserLoggedIn(false);
    setUsernameGlobal(null);
  };

  // ⏳ Prevent flicker / blank screen
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  // ✅ MAIN RENDER
  return (
    <>
      {userLoggedIn ? (
        <Dashboard
          username={usernameGlobal}
          logout={handleLogout}
        />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
}

export default App;