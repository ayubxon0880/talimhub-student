import { useEffect, useState } from "react";
import API from "../../api/axios";
import { LoadingSpinner } from "../../utils/index";
import React from "react";
interface RatingItem {
  userId: number;
  fullName: string;
  allLikes: number;
}

const Home = () => {
  const [rating, setRating] = useState<RatingItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await API.get<RatingItem[]>("/public/users-rating");
        setRating(res.data);
      } catch (err: any) {
        if (err.response) {
          setError(err.response.data.message || "Serverdan xato qaytdi");
        } else {
          setError("Error fetching data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  return (
    <div className=" flex flex-col items-center py-12 px-4">
      <div className="bg-white/90 backdrop-blur-lg border border-[#e7d3c8] text-center py-12 px-8 rounded-3xl shadow-xl w-full max-w-3xl">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 drop-shadow-sm">
          Speaking bo‘yicha Reyting
        </h1>
        <p className="mb-6 text-lg text-gray-600">
          Ovoz yozib, o‘zingizni sinab ko‘ring va reytingda yuqoriga chiqing 🚀
        </p>
        <a
          href="/take-exam"
          className="inline-block bg-gradient-to-r from-[#af8773] to-[#c2937b] text-white font-semibold px-10 py-3 rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
        >
          Speaking qilish
        </a>
      </div>

      {loading && (
        <div className="mt-12">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <p className="text-red-500 mt-10 text-lg font-medium text-center">
          ❌ Xatolik yuz berdi: {error}
        </p>
      )}

      {!loading && !error && (
        <div className="mt-20 w-full max-w-5xl">
          <h2 className="text-3xl font-semibold mb-10 text-center text-[#744f3c]">
             Foydalanuvchilar Reytingi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {rating.length === 0 ? (
              <p className="text-center col-span-full text-gray-500 text-lg">
                Hozircha hech kim reytingga kiritilmagan.
              </p>
            ) : (
              rating.map((item, index) => (
                <a
                  key={item.userId}
                  href={`/user-detail/${item.userId}`}
                  className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-2xl hover:border-[#af8773] transition duration-300 flex flex-col items-center text-center"
                >
                  <div className="bg-gradient-to-r from-[#af8773] to-[#c2937b] text-white w-12 h-12 flex items-center justify-center rounded-full font-bold shadow-lg mb-4">
                    {index + 1}
                  </div>
                  <p className="text-lg font-bold text-gray-800">
                    {item.fullName}
                  </p>
                  <p className="text-gray-600 mt-1">{item.allLikes} ❤️ like</p>
                </a>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(Home);
