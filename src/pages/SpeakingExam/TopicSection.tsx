import React, { useState } from "react";
import axios from "../../api/axios.tsx";
import Select from "react-select";

interface TopicDTO {
    id: number;
    topic: string;
    image1?: string | null;
    image2?: string | null;
}

const parts = [
    { value: "1", label: "Part 1" },
    { value: "2", label: "Part 2" },
    { value: "3", label: "Part 3" }
];

interface TopicSectionProps {
    setTopic2: (topic: TopicDTO | null) => void;
}


const TopicSection: React.FC<TopicSectionProps> = ({setTopic2}) => {
    const [part, setPart] = useState<any>(null);
    const [topic, setTopic] = useState<TopicDTO | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function getRandomTopic() {
        if (!part) {
            setError("Iltimos, part tanlang!");
            return;
        }

        setLoading(true);
        setError(null);
        setTopic(null);

        try {
            const response = await axios.get<TopicDTO>(`/topic/random?part=${part.value}`);
            if (!response.data) {
                setError("Hech qanday ma'lumot topilmadi ❌");
                return;
            }
            setTopic(response.data);
            setTopic2(response.data);
        } catch (e) {
            console.error(e);
            setError("Xatolik yuz berdi ❌");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            {!topic && (
                <div className="space-y-3">
                    <label className="block text-lg font-semibold">Part tanlang:</label>
                    <Select onChange={setPart} value={part} options={parts} />
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-100 text-red-700 rounded-xl shadow">
                    {error}
                </div>
            )}

            {topic && (
                <div className="space-y-4 p-6 rounded-2xl shadow-lg border bg-white text-center">
                    {topic.topic.split("|").map((q, i) => (
                        <h1 className="text-2xl font-bold text-gray-800" key={i}>
                            {q}
                        </h1>
                    ))}

                    {(topic.image1 || topic.image2) ? (
                        <div
                            className={`grid ${
                                topic.image1 && topic.image2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                            } gap-4`}
                        >
                            {topic.image1 && (
                                <img
                                    src={topic.image1}
                                    alt="1"
                                    className="rounded-xl shadow-md w-full h-96 object-cover"
                                />
                            )}
                            {topic.image2 && (
                                <img
                                    src={topic.image2}
                                    alt="2"
                                    className="rounded-xl shadow-md w-full h-96 object-cover"
                                />
                            )}
                        </div>
                    ) : (
                        <p className="text-gray-600 italic">
                            Bu mavzuga rasm mavjud emas 📄
                        </p>
                    )}

                </div>
            )}

            {!topic && (
                <button
                    onClick={getRandomTopic}
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading && (
                        <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                        </svg>
                    )}
                    {loading ? "Yuklanmoqda..." : "Get topic"}
                </button>
            )}
        </div>
    );
};

export default TopicSection;
