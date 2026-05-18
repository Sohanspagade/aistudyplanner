import React, { useState, useEffect } from "react";
import Home from "./Home";
import StudyPlanner from "./StudyPlanner";
import PomodoroTimer from "./PomodoroTimer";
import Chatbot from "./Chatbot";
import StudyVideos from "./StudyVideos";

// 🎯 Career imports
import Career from "./Career";
import Roadmap from "./Roadmap";
import SkillGap from "./SkillGap";
import Videos from "./Videos";

const Dashboard = ({ username = "User", logout }) => {
  const [activePage, setActivePage] = useState("home");

  const [plan, setPlan] = useState([]);
  const [completed, setCompleted] = useState([]);

  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [endTime, setEndTime] = useState(null);

  const [selectedCareer, setSelectedCareer] = useState(""); // ✅ NEW

  const [showMenu, setShowMenu] = useState(false);
  const [videoTopic, setVideoTopic] = useState("");

  const plannerKey = `planner_${username}`;
  const timerKey = `timer_${username}`;

  // LOAD DATA
  useEffect(() => {
    try {
      const plannerData = JSON.parse(localStorage.getItem(plannerKey));
      if (plannerData) {
        setPlan(plannerData.plan || []);
        setCompleted(plannerData.completed || []);
      }

      const timerData = JSON.parse(localStorage.getItem(timerKey));
      if (timerData) {
        setIsBreak(timerData.isBreak || false);
        setSessions(timerData.sessions || 0);

        if (timerData.endTime && timerData.isRunning) {
          const remaining = Math.floor(
            (timerData.endTime - Date.now()) / 1000
          );

          if (remaining > 0) {
            setTime(remaining);
            setEndTime(timerData.endTime);
            setIsRunning(true);
          }
        }
      }
    } catch {}
  }, [username]);

  // SAVE DATA
  useEffect(() => {
    localStorage.setItem(
      plannerKey,
      JSON.stringify({ plan, completed })
    );
  }, [plan, completed, username]);

  useEffect(() => {
    localStorage.setItem(
      timerKey,
      JSON.stringify({ endTime, isRunning, isBreak, sessions })
    );
  }, [endTime, isRunning, isBreak, sessions, username]);

  // PAGE SWITCH
  const renderPage = () => {
    switch (activePage) {
      case "home":
        return (
          <Home
            plan={plan}
            completed={completed}
            sessions={sessions}
            setActivePage={setActivePage}
          />
        );

      case "planner":
        return (
          <StudyPlanner
            plan={plan}
            setPlan={setPlan}
            completed={completed}
            setCompleted={setCompleted}
            setActivePage={setActivePage}
            setVideoTopic={setVideoTopic}
          />
        );

      case "timer":
        return (
          <PomodoroTimer
            time={time}
            setTime={setTime}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            isBreak={isBreak}
            setIsBreak={setIsBreak}
            sessions={sessions}
            setSessions={setSessions}
            endTime={endTime}
            setEndTime={setEndTime}
          />
        );

      case "chat":
        return <Chatbot username={username} logout={logout} />;

      case "videos":
        return <StudyVideos topic={videoTopic} />;

      // 🎯 NEW CAREER PAGE
      case "career":
        return (
          <div>
            <Career onSelectCareer={setSelectedCareer} />

            {selectedCareer && (
              <>
                <h2 className="text-xl mt-4 font-semibold">
                  Selected: {selectedCareer}
                </h2>

                <Roadmap career={selectedCareer} />
                <SkillGap career={selectedCareer} />
                <Videos topic={selectedCareer} />
              </>
            )}
          </div>
        );

      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-6 py-4 bg-white shadow">

        <h1 className="text-xl font-bold text-blue-600">
          🎯 AI Planner
        </h1>

        <div className="flex gap-3">
          {[
            { key: "home", label: "Home" },
            { key: "planner", label: "Planner" },
            { key: "timer", label: "Timer" },
            { key: "chat", label: "Chat" },
            { key: "videos", label: "🎥 Videos" },
            { key: "career", label: "🎯 Career" } // ✅ NEW
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setActivePage(item.key)}
              className={`px-4 py-2 rounded ${
                activePage === item.key
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <div
            onClick={() => setShowMenu(!showMenu)}
            className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full cursor-pointer"
          >
            {username.charAt(0).toUpperCase()}
          </div>

          {showMenu && (
            <div className="absolute right-0 mt-2 bg-white border rounded shadow">
              <p className="px-4 py-2 text-center">{username}</p>
              <button
                onClick={logout}
                className="px-4 py-2 text-red-500 w-full"
              >
                Logout
              </button>
            </div>
          )}
        </div>

      </div>

      <div className="p-6">{renderPage()}</div>
    </div>
  );
};

export default Dashboard;