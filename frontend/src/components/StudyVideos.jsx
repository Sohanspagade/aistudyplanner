import React, { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = "AIzaSyDU1-yE8HfFBfyBNbpRsHBh-Q-heLr3Ze8";

const EDUCATOR_CHANNELS = [
  "Neso Academy",
  "Gate Smashers",
  "Khan Academy",
  "Physics Wallah",
  "Apna College",
  "CodeWithHarry",
  "freeCodeCamp.org",
  "Unacademy",
];

const StudyVideos = ({ topic }) => {

  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [search, setSearch] = useState("");

  const [level, setLevel] =
    useState("beginner");

  const [loading, setLoading] =
    useState(false);

  // ===============================
  // AI TOPIC EXTRACTION
  // ===============================
  const extractTopic = (text) => {

    if (!text) return "";

    return text
      .replace(/[0-9]/g, "")
      .replace(
        /study|task|chapter|learn|practice|hours/gi,
        ""
      )
      .trim();
  };

  const aiTopic =
    extractTopic(topic);

  // ===============================
  // FINAL QUERY
  // ===============================
  const finalQuery = search
    ? `${search} ${level}`
    : `${aiTopic} ${level} tutorial`;

  // ===============================
  // FETCH VIDEOS
  // ===============================
  const fetchVideos = async (query) => {

    try {

      setLoading(true);

      const res =
        await axios.get(
          "https://www.googleapis.com/youtube/v3/search",
          {
            params: {
              part: "snippet",
              q: query,
              key: API_KEY,
              maxResults: 12,
              type: "video",
              videoEmbeddable: true,
              relevanceLanguage: "en",
              safeSearch: "strict",
            },
          }
        );

      // ===============================
      // FILTER EDUCATIONAL CHANNELS
      // ===============================
      const filtered =
        res.data.items.filter((video) => {

          const channel =
            video.snippet.channelTitle;

          return EDUCATOR_CHANNELS.some(
            (name) =>
              channel
                .toLowerCase()
                .includes(
                  name.toLowerCase()
                )
          );
        });

      const finalVideos =
        filtered.length > 0
          ? filtered
          : res.data.items;

      setVideos(finalVideos);

      if (finalVideos.length > 0) {

        setSelectedVideo(
          finalVideos[0]
        );
      }

    } catch (err) {

      console.error(
        "YouTube API Error:",
        err
      );

    } finally {

      setLoading(false);
    }
  };

  // ===============================
  // AUTO LOAD
  // ===============================
  useEffect(() => {

    fetchVideos(finalQuery);

  }, [topic, level]);

  // ===============================
  // SEARCH BUTTON
  // ===============================
  const handleSearch = () => {

    if (!search.trim()) return;

    fetchVideos(
      `${search} ${level}`
    );
  };

  // ===============================
  // BOOKMARK VIDEO
  // ===============================
  const bookmarkVideo = () => {

    if (!selectedVideo) return;

    const saved =
      JSON.parse(
        localStorage.getItem(
          "bookmarkedVideos"
        )
      ) || [];

    saved.push(selectedVideo);

    localStorage.setItem(
      "bookmarkedVideos",
      JSON.stringify(saved)
    );

    alert("📌 Video bookmarked!");
  };

  return (

    <div className="bg-white p-6 rounded-xl shadow-lg">

      {/* TITLE */}
      <h2 className="text-2xl font-bold mb-4">

        🎥 AI Smart Study Videos

      </h2>

      {/* SEARCH */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">

        <input
          value={search}

          onChange={(e) =>
            setSearch(e.target.value)
          }

          placeholder="Search any study topic..."

          className="flex-1 p-3 border rounded-lg"
        />

        <select
          value={level}

          onChange={(e) =>
            setLevel(
              e.target.value
            )
          }

          className="p-3 border rounded-lg"
        >

          <option value="beginner">
            Beginner
          </option>

          <option value="intermediate">
            Intermediate
          </option>

          <option value="advanced">
            Advanced
          </option>

        </select>

        <button
          onClick={handleSearch}

          className="bg-blue-500 text-white px-6 rounded-lg"
        >
          Search
        </button>

      </div>

      {/* AI INFO */}
      <div className="mb-4 text-gray-600">

        <p>
          🧠 AI Detected Topic:
          <b> {aiTopic || "General Study"} </b>
        </p>

        <p>
          📘 Difficulty Level:
          <b> {level} </b>
        </p>

      </div>

      {/* LOADING */}
      {loading && (

        <div className="text-center py-10">

          Loading videos...

        </div>
      )}

      {/* VIDEO PLAYER */}
      {!loading && selectedVideo && (

        <div className="mb-6">

          <iframe
            width="100%"
            height="450"

            src={`https://www.youtube.com/embed/${selectedVideo.id.videoId}`}

            title="YouTube Video Player"

            allowFullScreen

            className="rounded-xl"
          />

          <div className="mt-3">

            <h3 className="font-bold text-lg">

              {selectedVideo.snippet.title}

            </h3>

            <p className="text-sm text-gray-500">

              {selectedVideo.snippet.channelTitle}

            </p>

            <button
              onClick={bookmarkVideo}

              className="mt-3 bg-purple-500 text-white px-4 py-2 rounded"
            >
              📌 Bookmark
            </button>

          </div>

        </div>
      )}

      {/* VIDEO GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

        {videos.map((video) => (

          <div
            key={video.id.videoId}

            onClick={() =>
              setSelectedVideo(video)
            }

            className="cursor-pointer border rounded-lg overflow-hidden hover:shadow-xl transition"
          >

            <img
              src={
                video.snippet.thumbnails.medium.url
              }

              alt={video.snippet.title}

              className="w-full"
            />

            <div className="p-3">

              <h4 className="font-semibold text-sm">

                {video.snippet.title}

              </h4>

              <p className="text-xs text-gray-500 mt-1">

                {video.snippet.channelTitle}

              </p>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default StudyVideos;