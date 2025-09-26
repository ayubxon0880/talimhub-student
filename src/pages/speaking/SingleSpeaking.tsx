import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API, {API_URL} from "../../api/axios";
import { LoadingSpinner } from "../../utils";
import type { Speaking, Grade, SpeakingResponse } from "../../types/common";

const SingleSpeaking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [speaking, setSpeaking] = useState<Speaking | null>(null);
  const [grade, setGrade] = useState<Grade | null>(null);
  const [liked, setLiked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSpeaking = async () => {
    setLoading(true);
    try {
      const response = await API.get<SpeakingResponse>(`/grade/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSpeaking(response.data.speaking);
      setGrade(response.data.grade);
      setLiked(response.data.speaking.liked);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchSpeaking();
  }, [id]);

  const handleLike = async (speakingId: number) => {
    try {
      await API.post(
        `/speaking/like?speakingId=${speakingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setLiked(true);
      setSpeaking((prev) =>
        prev ? { ...prev, likes: prev.likes + 1 } : prev
      );
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to like");
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!speaking) return <p className="text-center mt-8">Speaking not found.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Speaking Detail
      </h1>

      <div className="space-y-6">
          <div className="p-4 bg-gray-50 rounded-lg border">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Part {speaking.speakingType}
              </h2>

              {(speaking.topic.image1 || speaking.topic.image2) && (
                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                      {speaking.topic.image1 && (
                          <img
                              src={speaking.topic.image1}
                              alt="Topic Image 1"
                              className="w-full sm:w-1/2 h-48 object-cover rounded-md shadow"
                          />
                      )}
                      {speaking.topic.image2 && (
                          <img
                              src={speaking.topic.image2}
                              alt="Topic Image 2"
                              className="w-full sm:w-1/2 h-48 object-cover rounded-md shadow"
                          />
                      )}
                  </div>
              )}

              <ul className="list-disc list-inside text-gray-600 space-y-2">
                  {speaking.topic.topic.split("|").map((q, i) => (
                      <li key={i} className="text-lg">
                          {q.trim()}
                      </li>
                  ))}
              </ul>
          </div>


          <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
          <Link
            to={`/user-detail/${speaking.userDTOSpeaking.id}`}
            className="text-blue-600 hover:underline font-medium"
          >
            👤 {speaking.userDTOSpeaking.fullName}
          </Link>
          <span className="text-gray-600">❤️ {speaking.likes} likes</span>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <audio controls className="w-full rounded-lg border">
            <source
              src={`${API_URL}/audio/${speaking.audioUrl}`}
              type="audio/mp3"
            />
            Your browser does not support the audio element.
          </audio>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => handleLike(speaking.id)}
            className={`px-4 py-2 rounded-lg text-white font-medium transition ${
              liked ? "bg-yellow-500" : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {liked ? "Liked ❤️" : "Like 👍"}
          </button>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(
              window.location.origin + `/speaking/${speaking.id}`
            )}&text=${encodeURIComponent(
              `Check out this speaking: Part ${speaking.speakingType}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
          >
            Share 📤
          </a>
        </div>
      </div>

      {grade && (
        <div className="mt-8 p-4 bg-green-50 rounded-lg border">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">✅ Baholash</h3>
          <p className="text-gray-700">
            <span className="font-medium">Daraja:</span> {grade.degree}
          </p>
          <p className="text-gray-700 mt-1">
            <span className="font-medium">Mulohaza:</span> {grade.feedback}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            <Link
              to={`/teacher/${grade.supervisorId}`}
              className="text-blue-500 hover:underline"
            >
              {grade.supervisorFullName}
            </Link>{" "}
            tomonidan{" "}
            {new Date(grade.checkedAt).toLocaleDateString("uz-UZ", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            da tekshirildi.
          </p>
        </div>
      )}
    </div>
  );
};

export default React.memo(SingleSpeaking);
