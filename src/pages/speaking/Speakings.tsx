import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API, { API_URL } from "../../api/axios";
import { LoadingSpinner } from "../../utils";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

interface Topic {
  id: number;
  topic: string;
}

interface UserDTO {
  id: number;
  fullName: string;
}

interface Speaking {
  id: number;
  speakingType: number;
  topic: Topic;
  audioUrl: string;
  liked: boolean;
  likes: number;
  userDTOSpeaking: UserDTO;
}

interface SpeakingsResponse {
  speakings?: Speaking[];
  totalPages?: number;
}

const Speakings: React.FC = () => {
  const [speakings, setSpeakings] = useState<Speaking[]>([]);
  const [page, setPage] = useState<number>(0);
  const [pageSize] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const months = [
    { value: 1, label: "Yanvar" },
    { value: 2, label: "Fevral" },
    { value: 3, label: "Mart" },
    { value: 4, label: "Aprel" },
    { value: 5, label: "May" },
    { value: 6, label: "Iyun" },
    { value: 7, label: "Iyul" },
    { value: 8, label: "Avgust" },
    { value: 9, label: "Sentyabr" },
    { value: 10, label: "Oktyabr" },
    { value: 11, label: "Noyabr" },
    { value: 12, label: "Dekabr" },
  ];

  const [selectedMonth, setSelectedMonth] = useState(
    months[new Date().getMonth()]
  );
  const token = localStorage.getItem("token");

  const fetchSpeakings = async () => {
    setLoading(true);
    try {
      if (!token) return;

      const { data } = await API.get<SpeakingsResponse>(
        `/public/speakings?page=${page}&size=${pageSize}&month=${selectedMonth.value}&sorted=true`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSpeakings(data.speakings ?? []);
      setTotalPages(data.totalPages ?? 1);
    } catch (error) {
      console.error("❌ Error fetching speakings:", error);
      setSpeakings([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeakings();
  }, [page, pageSize, selectedMonth]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 0 || newPage >= totalPages) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLikeToggle = async (speaking: Speaking) => {
    if (!token) return alert("Token topilmadi, login qiling!");

    try {
      await API.post(`/speaking/like?speakingId=${speaking.id}`);

      setSpeakings((prev) =>
        prev.map((s) =>
          s.id === speaking.id
            ? {
                ...s,
                liked: !s.liked,
                likes: s.liked ? s.likes - 1 : s.likes + 1,
              }
            : s
        )
      );
    } catch (error: any) {
      alert(error.response?.data?.message || "Error liking/unliking speaking");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
        Speakinglar
      </h1>

      <div className="mb-6">
  <Swiper
    spaceBetween={10}
    slidesPerView="auto"
    className="flex items-center"
  >
    {months.map((month) => (
      <SwiperSlide key={month.value} style={{ width: "auto" }}>
        <button
          onClick={() => setSelectedMonth(month)}
          className={`px-3 py-1 rounded-full font-medium transition ${
            month.value === selectedMonth.value
              ? "bg-[#b18169] text-white shadow-md"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {month.label}
        </button>
      </SwiperSlide>
    ))}
  </Swiper>
</div>


      {loading ? (
        <div className="flex justify-center my-10">
          <LoadingSpinner text="Yuklanmoqda..." />
        </div>
      ) : speakings.length === 0 ? (
        <p className="text-gray-500 text-lg text-center">Bu oyda speaking qilmagansiz </p>
      ) : (
        speakings.map((speaking) => (
          <div
            key={speaking.id}
            className="bg-white shadow-md rounded-xl p-5 transition hover:shadow-lg border mb-5"
          >
            <div className="mb-3">
              <Link
                to={`/speaking/${speaking.id}`}
                className="text-lg font-semibold text-yellow-600 hover:underline"
              >
                Part {speaking.speakingType}
              </Link>
              <ul className="mt-2 list-disc list-inside text-gray-700 space-y-1">
                {speaking.topic?.topic.split("|").map((q, i) => (
                  <li key={i} className="text-sm">
                    {q.trim()}
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-sm text-gray-600 mb-3">
              <Link
                to={`/user-detail/${speaking.userDTOSpeaking.id}`}
                className="hover:underline text-gray-800"
              >
                👤 {speaking.userDTOSpeaking.fullName}
              </Link>{" "}
              • ❤️ {speaking.likes}
            </div>

            <audio
              controls
              controlsList="nodownload"
              className="w-full my-3 rounded-md border border-gray-200"
            >
              <source
                src={`${API_URL}/audio/${speaking.audioUrl}`}
                type="audio/mp3"
              />
              Sizning brauzeringiz audio qo‘llab-quvvatlamaydi.
            </audio>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => handleLikeToggle(speaking)}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  speaking.liked
                    ? "bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
              >
                {speaking.liked ? "Liked ❤️" : "Like 👍"}
              </button>
            </div>
          </div>
        ))
      )}

      {!loading && totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-8 items-center">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 0}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ⬅ Oldingi
          </button>
          <span className="text-gray-700 font-medium">
            Sahifa {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page + 1 >= totalPages}
            className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Keyingi ➡
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(Speakings);
