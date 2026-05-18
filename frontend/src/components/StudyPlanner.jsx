import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

const StudyPlanner = ({
  plan,
  setPlan,
  completed,
  setCompleted,
  setActivePage,
  setVideoTopic
}) => {

  // ===============================
  // STATES
  // ===============================
  const [name, setName] =
    useState("");

  const [subjects, setSubjects] =
    useState("");

  const [hours, setHours] =
    useState(1);

  const [examDate, setExamDate] =
    useState("");

  const [tasks, setTasks] =
    useState([]);

  // NOTES
  const [selectedTask, setSelectedTask] =
    useState("");

  const [note, setNote] =
    useState("");

  // USER ID
  const userId =
    localStorage.getItem(
      "userId"
    );

  console.log(
    "USER ID:",
    userId
  );

  // ===============================
  // ASK NOTIFICATION PERMISSION
  // ===============================
  useEffect(() => {

    if (
      Notification.permission !==
      "granted"
    ) {

      Notification.requestPermission();
    }

  }, []);

  // ===============================
  // SHOW REMINDER
  // ===============================
  const showReminder = (task) => {

    if (
      Notification.permission ===
      "granted"
    ) {

      new Notification(
        "📚 Study Reminder",
        {
          body:
            `${task.title} is pending`,
        }
      );
    }
  };

  // ===============================
  // AUTO REMINDER
  // ===============================
  useEffect(() => {

    const interval =
      setInterval(() => {

        tasks.forEach((task) => {

          if (
            task.status !==
            "Completed"
          ) {

            showReminder(task);
          }
        });

      }, 60000);

    return () =>
      clearInterval(interval);

  }, [tasks]);

  // ===============================
  // LOAD PLANNER
  // ===============================
  useEffect(() => {

    const loadPlanner =
      async () => {

        try {

          if (!userId) return;

          const res =
            await axios.get(
              `http://localhost:7000/planner/${userId}`
            );

          console.log(
            "PLANNER DATA:",
            res.data
          );

          setTasks(res.data);

          const loadedPlan =
            res.data.map(
              (item) =>
                item.title
            );

          setPlan(
            loadedPlan
          );

          // LOAD COMPLETED
          const completedIndexes =
            res.data
              .map(
                (
                  item,
                  index
                ) =>

                  item.status ===
                  "Completed"

                    ? index
                    : null
              )
              .filter(
                (i) =>
                  i !== null
              );

          setCompleted(
            completedIndexes
          );

        } catch (err) {

          console.error(
            "Load planner error:",
            err
          );
        }
      };

    loadPlanner();

  }, [
    userId,
    setPlan,
    setCompleted
  ]);

  // ===============================
  // LOAD INPUTS
  // ===============================
  useEffect(() => {

    try {

      const saved =
        JSON.parse(
          localStorage.getItem(
            "plannerInputs"
          )
        ) || {};

      setName(
        saved.name || ""
      );

      setSubjects(
        saved.subjects || ""
      );

      setHours(
        saved.hours || 1
      );

      setExamDate(
        saved.examDate || ""
      );

    } catch {}
  }, []);

  // ===============================
  // SAVE INPUTS
  // ===============================
  useEffect(() => {

    localStorage.setItem(
      "plannerInputs",

      JSON.stringify({
        name,
        subjects,
        hours,
        examDate
      })
    );

  }, [
    name,
    subjects,
    hours,
    examDate
  ]);

  // ===============================
  // TOGGLE COMPLETE
  // ===============================
  const toggleComplete =
    async (index) => {

      let updatedCompleted;

      if (
        completed.includes(index)
      ) {

        updatedCompleted =
          completed.filter(
            (i) =>
              i !== index
          );

      } else {

        updatedCompleted =
          [
            ...completed,
            index
          ];
      }

      setCompleted(
        updatedCompleted
      );

      try {

        const task =
          tasks[index];

        const newStatus =
          updatedCompleted.includes(
            index
          )

            ? "Completed"
            : "Pending";

        await axios.put(
          "http://localhost:7000/planner/update-status",

          {
            id: task.id,
            status:
              newStatus,
          }
        );

        const updatedTasks =
          [...tasks];

        updatedTasks[
          index
        ].status =
          newStatus;

        setTasks(
          updatedTasks
        );

      } catch (err) {

        console.error(
          "Status update failed",
          err
        );
      }
    };

  // ===============================
  // LOAD NOTE
  // ===============================
  const loadNote =
    async (taskTitle) => {

      try {

        const res =
          await axios.get(
            `http://localhost:7000/notes/${userId}/${taskTitle}`
          );

        setNote(
          res.data
        );

        setSelectedTask(
          taskTitle
        );

      } catch (err) {

        console.error(err);
      }
    };

  // ===============================
  // SAVE NOTE
  // ===============================
  const saveNote =
    async () => {

      try {

        await axios.post(
          "http://localhost:7000/notes/save",

          {
            userId,

            taskTitle:
              selectedTask,

            note,
          }
        );

        alert(
          "✅ Note Saved"
        );

      } catch (err) {

        console.error(err);
      }
    };

  // ===============================
  // AI SUMMARY
  // ===============================
  const generateSummary =
    () => {

      if (!note) return;

      const sentences =
        note.split(".");

      const shortSummary =
        sentences
          .slice(0, 3)
          .join(". ");

      setNote(
        shortSummary
      );
    };

  // ===============================
  // PROGRESS
  // ===============================
  const progress =

    plan.length === 0

      ? 0

      : Math.round(
          (
            completed.length /
            plan.length
          ) * 100
        );

  const data = [

    {
      name: "Completed",
      value:
        completed.length
    },

    {
      name: "Pending",
      value:
        plan.length -
        completed.length
    },
  ];

  const COLORS = [
    "#22c55e",
    "#ef4444"
  ];

  // ===============================
  // GENERATE PLAN
  // ===============================
  const generatePlan =
    async () => {

      try {

        const subjectList =
          subjects
            .split(",")

            .map((s) =>
              s.trim()
            );

        const res =
          await axios.post(
            "http://localhost:7000/generate-plan",

            {
              name,

              subjects:
                subjectList,

              hoursPerDay:
                Number(
                  hours
                ),

              examDate,
            }
          );

        const newPlan =

          Array.isArray(
            res.data
          )

            ? res.data

            : [];

        setPlan(
          newPlan
        );

        setCompleted([]);

        const newTasks = [];

        for (
          const item of newPlan
        ) {

          await axios.post(
            "http://localhost:7000/planner/add",

            {
              userId:
                Number(
                  userId
                ),

              title: item,

              dueDate:
                examDate,

              description:
                item,

              status:
                "Pending",
            }
          );

          newTasks.push({
            title: item,
            status:
              "Pending",
          });
        }

        setTasks(
          newTasks
        );

        alert(
          "✅ Planner saved successfully!"
        );

      } catch (err) {

        console.error(
          err
        );

        setPlan([
          "❌ Error generating plan"
        ]);
      }
    };

  // ===============================
  // UI
  // ===============================
  return (

    <div className="grid md:grid-cols-2 gap-6">

      {/* LEFT PANEL */}
      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="text-xl font-bold mb-4">
          📋 Study Details
        </h2>

        <input
          value={name}

          onChange={(e) =>
            setName(
              e.target.value
            )
          }

          placeholder="Your Name"

          className="w-full p-3 mb-3 border rounded"
        />

        <input
          value={subjects}

          onChange={(e) =>
            setSubjects(
              e.target.value
            )
          }

          placeholder="Subjects"

          className="w-full p-3 mb-3 border rounded"
        />

        <input
          type="number"

          value={hours}

          onChange={(e) =>
            setHours(
              Number(
                e.target.value
              )
            )
          }

          className="w-full p-3 mb-3 border rounded"
        />

        <input
          type="date"

          value={examDate}

          onChange={(e) =>
            setExamDate(
              e.target.value
            )
          }

          className="w-full p-3 mb-3 border rounded"
        />

        <button
          onClick={
            generatePlan
          }

          className="w-full bg-blue-500 text-white p-3 rounded"
        >
          🚀 Generate Plan
        </button>

      </div>

      {/* RIGHT PANEL */}
      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="text-xl font-bold mb-4">
          📅 Study Plan
        </h2>

        {plan.length === 0 && (

          <p className="text-gray-500">
            No plan yet...
          </p>
        )}

        <div className="max-h-60 overflow-y-auto">

          {plan.map(
            (
              item,
              index
            ) => (

              <div
                key={index}

                className={`p-3 mb-2 flex justify-between items-center rounded ${
                  completed.includes(
                    index
                  )

                    ? "bg-green-200 line-through"

                    : "bg-gray-100"
                }`}
              >

                <span>
                  {item}
                </span>

                <div className="flex gap-2 items-center">

                  {/* COMPLETE */}
                  <input
                    type="checkbox"

                    checked={
                      completed.includes(
                        index
                      )
                    }

                    onChange={() =>
                      toggleComplete(
                        index
                      )
                    }
                  />

                  {/* NOTES */}
                  <button
                    onClick={() =>
                      loadNote(
                        item
                      )
                    }

                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    📝
                  </button>

                  {/* REMINDER */}
                  <button
                    onClick={() =>
                      showReminder(
                        tasks[
                          index
                        ]
                      )
                    }

                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    🔔
                  </button>

                  {/* VIDEO */}
                  <button
                    onClick={() => {

                      setVideoTopic(
                        item
                      );

                      setActivePage(
                        "videos"
                      );
                    }}

                    className="bg-purple-500 text-white px-3 py-1 rounded"
                  >
                    🎥
                  </button>

                </div>

              </div>
            )
          )}
        </div>

        {/* PROGRESS */}
        <div className="mt-4">

          <p>
            Progress:
            {progress}%
          </p>

          <div className="w-full bg-gray-300 h-3 rounded">

            <div
              className="bg-green-500 h-3 rounded"

              style={{
                width:
                  `${progress}%`
              }}
            />

          </div>

        </div>

        {/* PIE CHART */}
        {plan.length > 0 && (

          <div className="flex justify-center mt-6">

            <PieChart
              width={250}
              height={250}
            >

              <Pie
                data={data}

                dataKey="value"

                outerRadius={80}
              >

                {data.map(
                  (
                    entry,
                    i
                  ) => (

                    <Cell
                      key={i}

                      fill={
                        COLORS[i]
                      }
                    />
                  )
                )}

              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>

          </div>
        )}

        {/* NOTES PANEL */}
        {selectedTask && (

          <div className="mt-6 bg-gray-100 p-4 rounded">

            <h3 className="font-bold mb-2">
              📝 Notes:
              {selectedTask}
            </h3>

            <textarea
              value={note}

              onChange={(e) =>
                setNote(
                  e.target.value
                )
              }

              rows="6"

              className="w-full border p-3 rounded"
            />

            <div className="flex gap-3 mt-3">

              <button
                onClick={
                  saveNote
                }

                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save Note
              </button>

              <button
                onClick={
                  generateSummary
                }

                className="bg-indigo-500 text-white px-4 py-2 rounded"
              >
                AI Summary
              </button>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default StudyPlanner;