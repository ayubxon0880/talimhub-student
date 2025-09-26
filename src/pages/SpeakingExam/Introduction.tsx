import React, {useEffect, useState} from "react";

const useTypingEffect = (text: string, speed = 50) => {
    const [displayed, setDisplayed] = useState("");

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setDisplayed((prev) => prev + text[i]);
            i++;
            if (i >= text.length) clearInterval(interval);
        }, speed);
        return () => clearInterval(interval);
    }, [text, speed]);

    return displayed;
};

interface IntroductionPageProps {
    setFalse?: () => void;
}

const IntroductionPage: React.FC<IntroductionPageProps> = ({ setFalse }) => {
    const text =
        "In Part 1, you will be given 30 seconds to prepare and 90 seconds to speak. During this time, you will look at a picture, describe it, and answer the related questions.";
    const displayedText = useTypingEffect(text, 40);

    const speakText = () => {
        if ("speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = "en-US";
            speechSynthesis.speak(utterance);
        } else {
            alert("Your browser does not support text-to-speech.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 text-center space-y-6">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
                    Speaking Practice 🎤
                </h1>

                <p className="text-lg sm:text-xl text-gray-700 whitespace-pre-line min-h-[120px]">
                    {displayedText}
                </p>

                {/* Buttonlar yonma-yon joylashdi */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={speakText}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow hover:bg-blue-700 transition"
                    >
                        🔊 Read Aloud
                    </button>

                    <button
                        onClick={setFalse}
                        className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold shadow hover:bg-green-700 transition"
                    >
                        🚀 Start Test
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IntroductionPage;
