import { useEffect, useState } from "react";
import { getVideos } from "./api";

export default function Videos({ topic }) {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (topic) getVideos(topic).then(setVideos);
  }, [topic]);

  return (
    <div className="bg-white p-6 rounded-xl shadow mb-6">

      <h3 className="text-lg font-bold mb-4 text-red-500">
        🎥 Learning Videos
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        {videos.map((v, i) => (
          <a
            key={i}
            href={v.url}
            target="_blank"
            className="block p-4 bg-gray-50 rounded shadow hover:shadow-lg"
          >
            {v.title}
          </a>
        ))}
      </div>
    </div>
  );
}