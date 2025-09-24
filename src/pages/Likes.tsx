import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../api/axios";
import { LoadingSpinner } from "../utils/index";
import type { LikeItem, LikesResponse } from "../types/common";

const LikesPage: React.FC = () => {
  const [likes, setLikes] = useState<LikeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchLikes = async () => {
    try {
      const response = await axios.get<LikesResponse>(`${API}/likes`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setLikes(response.data.likes);
    } catch (error) {
      console.error("Error fetching likes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto mt-6 p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">❤️ My Likes</h1>
      {likes.length === 0 ? (
        <p className="text-gray-600">No likes found</p>
      ) : (
        <ul className="space-y-3">
          {likes.map((l) => (
            <li
              key={l.speaking_id}
              className="p-3 border rounded-lg bg-gray-50 flex justify-between"
            >
              <div>
                <p className="font-medium">{l.topic}</p>
                <p className="text-sm text-gray-600">
                  👤 {l.userFirstname} {l.userLastname}
                </p>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(l.likePressedDate).toLocaleDateString("uz-UZ")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default React.memo(LikesPage);
