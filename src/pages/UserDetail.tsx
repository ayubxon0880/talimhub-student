import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import { LoadingSpinner } from "../utils/index";

interface User {
  userId: number;
  firstName: string;
  lastName: string;
  image?: string;
  totalLikeCount: number;
  totalSpeakingCount: number;
}

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const { data } = await API.get<User>(`/user/detail/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (isMounted) setUser(data);
      } catch {
        if (isMounted)
          setError("❌ Foydalanuvchi ma'lumotlarini olishda xatolik yuz berdi.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUser();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) return <LoadingSpinner text="Foydalanuvchi yuklanmoqda..." />;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!user)
    return <div className="text-center text-gray-500">Ma'lumot topilmadi</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white mt-14 shadow-xl rounded-2xl border border-gray-200">
      {/* Profil */}
      <div className="flex flex-col items-center">
        {user.image ? (
          <img
            src={user.image}
            alt="User"
            className="w-32 h-32 rounded-full object-cover border-4 border-yellow-400 shadow-md"
          />
        ) : (
          <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 text-lg font-semibold">
            No Image
          </div>
        )}

        <h2 className="text-2xl font-bold mt-4 text-gray-900">
          {user.firstName} {user.lastName}
        </h2>
      </div>

      {/* Info */}
      <div className="mt-8 grid grid-cols-2 gap-4 text-center">
        <div className="p-4 bg-yellow-50 rounded-xl shadow-sm border border-yellow-100">
          <p className="font-semibold text-gray-700">👍 Likelar</p>
          <p className="text-xl font-bold text-yellow-600">
            {user.totalLikeCount}
          </p>
        </div>
        <div className="p-4 bg-yellow-50 rounded-xl shadow-sm border border-yellow-100">
          <p className="font-semibold text-gray-700">🗣️ Speakinglar</p>
          <p className="text-xl font-bold text-yellow-600">
            {user.totalSpeakingCount}
          </p>
        </div>
      </div>

      {/* Button */}
      <div className="mt-8 flex justify-center">
        <Link
          to={`/user-speaking/${user.userId}`}
          className="px-6 py-2 bg-[#b18169] text-white rounded-full font-medium hover:bg-[#cba38f] transition shadow"
        >
          Speakinglarni ko‘rish
        </Link>
      </div>
    </div>
  );
};

export default React.memo(UserDetail);
