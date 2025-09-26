import React, { useState, useEffect } from "react";
import { getRandomTopic, handleUpload } from "../../services/takeExam.tsx";
import API from "../../api/axios.tsx";
import Select from "react-select";
import type { TopicDTO } from "../../services/models.tsx";
import Part1 from "./parts/Part1.tsx";
import { LoadingSpinner } from "../../utils";
import { useNavigate } from "react-router-dom";
import IntroductionPage from "./Introduction.tsx";

const parts = [
    { value: "1", label: "Part 1" },
    { value: "2", label: "Part 2" },
    { value: "3", label: "Part 3" },
];

const SpeakingTest: React.FC = () => {
    const [introductionOpen, setIntroductionOpen] = useState<boolean>(
        !localStorage.getItem("introduction") // faqat birinchi kirishda true
    );
    const [part, setPart] = useState<any>(null);
    const [topic, setTopic] = useState<TopicDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showIntroBtn, setShowIntroBtn] = useState<boolean>(true);
    const navigate = useNavigate();

    const takeExam = async (audio: Blob) => {
        setLoading(true);
        try {
            const audioUrl = await handleUpload(audio);
            const response = await API.post("/speaking/save", {
                topicId: topic?.id,
                audioUrl,
            });
            console.log(response.data);
            navigate(`/speaking/${response.data.id}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => setShowIntroBtn(false), 10000);
        return () => clearTimeout(timer);
    }, []);

    const closeIntro = () => {
        setIntroductionOpen(false);
        localStorage.setItem("introduction", "true");
    };

    if (introductionOpen) {
        return <IntroductionPage setFalse={closeIntro} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative">
            {showIntroBtn && (
                <button
                    onClick={() => setIntroductionOpen(true)}
                    className="absolute top-4 right-4 bg-blue-500 text-white text-sm px-3 py-1 rounded-md shadow hover:bg-blue-600 transition"
                >
                    Show Intro
                </button>
            )}

            <div className="bg-white shadow-2xl rounded-2xl w-full max-w-2xl p-8">
                {!topic && (
                    <div className="space-y-6 text-center">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Start Speaking Test
                        </h1>
                        <p className="text-gray-600">Choose a part to get a random topic</p>

                        <Select
                            onChange={setPart}
                            value={part}
                            options={parts}
                            className="text-left"
                        />

                        <button
                            onClick={() => getRandomTopic(part.value, setTopic)}
                            disabled={!part || loading}
                            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
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
                            {loading ? "Loading..." : "Get Topic"}
                        </button>
                    </div>
                )}

                {topic && <Part1 topic={topic} setAudioFile={takeExam} />}

                {topic && loading && (
                    <div className="mt-6 text-center">
                        <h1 className="text-lg font-semibold text-gray-700">Saqlanmoqda...</h1>
                        <LoadingSpinner />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpeakingTest;
