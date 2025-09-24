import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../../api/axios";
import { LoadingSpinner } from "../../utils";
import { useParams, Link } from "react-router-dom";

// --- Typelar ---
interface TopicDTO {
  id: number;
  topic: string;
}

interface UserDTO {
  id: number;
  fullName: string;
}

interface SpeakingDTO {
  id: number;
  speakingType: string;
  topic: TopicDTO;
  audioUrl: string;
  userDTOSpeaking: UserDTO;
  likes: number;
  liked: boolean;
}

interface SpeakingResponse {
  speakings: SpeakingDTO[];
  totalPages: number;
}

const Speaking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [speakings, setSpeakings] = useState<SpeakingDTO[]>([]);
  const [page, setPage] = useState<number>(0);
  const [pageSize] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSpeakings = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const response = await axios.get<SpeakingResponse>(
        `${API}/speaking/my-speakings?userId=${id}&page=${page}&size=${pageSize}&sorted=true`
      );
      setSpeakings(response.data.speakings);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeakings(page, pageSize);
  }, [page, pageSize]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLike = async (speakingId: number) => {
    try {
      await axios.post(
        `${API}/speaking/like?speakingId=${speakingId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setSpeakings((prevSpeakings) =>
        prevSpeakings.map((speaking) =>
          speaking.id === speakingId
            ? {
                ...speaking,
                liked: true,
                likes: speaking.likes + 1,
              }
            : speaking
        )
      );
    } catch (error: any) {
      alert(error.response?.data?.message || "Like bosishda xatolik");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        🎤 Speakinglar
      </h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <LoadingSpinner />
        </div>
      ) : speakings.length === 0 ? (
        <div className="text-center text-gray-500">Speaking topilmadi</div>
      ) : (
        <div className="space-y-6">
          {speakings.map((speaking) => (
            <div
              key={speaking.id}
              className="bg-white shadow-md rounded-xl p-5 transition hover:shadow-lg border"
            >
              {/* Topic title + savollar */}
              <div className="mt-2">
                <Link
                  to={`/speaking/${speaking.id}`}
                  className="block text-lg font-semibold text-blue-600 hover:underline"
                >
                  Part {speaking.speakingType}
                </Link>

                {/* Savollar */}
                <ul className="mt-2 list-disc list-inside text-gray-700 space-y-1">
                  {speaking.topic.topic.split("|").map((question, index) => (
                    <li key={index} className="text-sm">
                      {question.trim()}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to={`/user-detail/${speaking.userDTOSpeaking.id}`}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                👤 {speaking.userDTOSpeaking.fullName} | 👍 Likes:{" "}
                {speaking.likes}
              </Link>

              {/* Audio */}
              <div className="mt-4">
                <audio
                  controls
                  className="w-full rounded-lg border border-gray-300"
                >
                  <source
                    src={`${API}/audio/${speaking.audioUrl}`}
                    type="audio/mp3"
                  />
                  Sizning brauzeringiz audio qo‘llab-quvvatlamaydi.
                </audio>
              </div>

              {/* Buttons */}
              <div className="flex justify-end items-center gap-3 mt-4">
                <button
                  className={`px-4 py-2 rounded-full text-white font-medium transition ${
                    speaking.liked
                      ? "bg-yellow-400 hover:bg-yellow-500"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                  onClick={() => handleLike(speaking.id)}
                >
                  {speaking.liked ? "Liked ❤️" : "Like 👍"}
                </button>

                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(
                    window.location.origin + `/speaking/${speaking.id}`
                  )}&text=${encodeURIComponent(
                    `Check out this speaking: Part ${speaking.speakingType}, Topic: ${speaking.topic.topic}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-blue-500 text-white font-medium transition hover:bg-blue-600"
                >
                  Share 📤
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 0}
          className="px-4 py-2 bg-gray-400 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ⬅ Previous
        </button>
        <span className="text-gray-700 font-medium">
          Page {page + 1} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page + 1 >= totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default React.memo(Speaking);
