import React, { useState, useEffect } from "react";

const PomodoroTimer = () => {
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [endTime, setEndTime] = useState(null);

  // 🔔 Notification function
  const showNotification = (message) => {
    if (Notification.permission === "granted") {
      new Notification("⏰ Pomodoro Timer", { body: message });
    }
  };

  // 🔐 Request Notification Permission
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  // 🔄 Load saved state from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("pomodoro")) || {};
    if (saved.endTime && saved.isRunning) {
      const remaining = Math.floor((saved.endTime - Date.now()) / 1000);
      if (remaining > 0) {
        setTime(remaining);
        setEndTime(saved.endTime);
        setIsRunning(true);
      }
    }
    setIsBreak(saved.isBreak || false);
    setSessions(saved.sessions || 0);
  }, []);

  // 💾 Save state
  useEffect(() => {
    localStorage.setItem(
      "pomodoro",
      JSON.stringify({ endTime, isRunning, isBreak, sessions })
    );
  }, [endTime, isRunning, isBreak, sessions]);

  // ⏱ Timer logic (REAL TIME, keeps running across tabs)
  useEffect(() => {
    if (!isRunning || !endTime) return;

    const interval = setInterval(() => {
      const remaining = Math.floor((endTime - Date.now()) / 1000);

      if (remaining <= 0) {
        clearInterval(interval);

        if (!isBreak) {
          showNotification("🎉 Focus session completed! Take a break ☕");

          const newEnd = Date.now() + 5 * 60 * 1000;
          setEndTime(newEnd);
          setIsBreak(true);
          setSessions((prev) => prev + 1);
          setTime(5 * 60);
        } else {
          showNotification("💪 Break over! Back to focus 📚");

          const newEnd = Date.now() + 25 * 60 * 1000;
          setEndTime(newEnd);
          setIsBreak(false);
          setTime(25 * 60);
        }
      } else {
        setTime(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, endTime, isBreak]);

  // ▶ Start
  const startTimer = () => {
    const newEnd = Date.now() + time * 1000;
    setEndTime(newEnd);
    setIsRunning(true);
  };

  // ⏸ Pause
  const pauseTimer = () => setIsRunning(false);

  // 🔄 Reset
  const resetTimer = () => {
    setIsRunning(false);
    setTime(25 * 60);
    setIsBreak(false);
    setEndTime(null);
  };

  // ⏱ Format time for display
  const formatTime = () => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 
      bg-gradient-to-r from-blue-500 to-purple-600 
      text-white rounded-2xl shadow-xl max-w-md mx-auto">

      <h2 className="text-2xl font-bold mb-4">
        {isBreak ? "☕ Break Time" : "📚 Focus Time"}
      </h2>

      <div className="text-5xl font-bold mb-6">{formatTime()}</div>

      <div className="flex gap-4">
        <button onClick={startTimer} className="bg-green-500 px-4 py-2 rounded-xl">
          Start
        </button>

        <button onClick={pauseTimer} className="bg-yellow-500 px-4 py-2 rounded-xl">
          Pause
        </button>

        <button onClick={resetTimer} className="bg-red-500 px-4 py-2 rounded-xl">
          Reset
        </button>
      </div>

      <p className="mt-6 text-lg">🔥 Sessions Completed: {sessions}</p>
    </div>
  );
};

export default PomodoroTimer;