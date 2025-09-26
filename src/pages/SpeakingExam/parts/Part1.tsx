// Part1.tsx
import React, { useState } from "react";
import Countdown from "../Countdown.tsx";
import Recorder from "../Recorder.tsx";
import type { TopicDTO } from "../../../services/models.tsx";

interface PartProps {
    topic: TopicDTO;
    setAudioFile: (audioBlob: Blob) => void;
}

const Part1: React.FC<PartProps> = ({ topic, setAudioFile }) => {
    const [countdownEnd, setCountdownEnd] = useState(false);
    const questions = topic.topic.split("|");

    return (
        <div className="space-y-8 w-full">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">
                Part 1
            </h1>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
                {topic.image1 && (
                    <img
                        src={topic.image1}
                        alt="Topic Image 1"
                        className="w-full sm:w-1/2 h-48 sm:h-36 object-cover rounded-xl shadow-md"
                    />
                )}
                {topic.image2 && (
                    <img
                        src={topic.image2}
                        alt="Topic Image 2"
                        className="w-full sm:w-1/2 h-48 sm:h-36 object-cover rounded-xl shadow-md"
                    />
                )}
            </div>

            <div className="bg-gray-100 p-4 sm:p-6 rounded-xl shadow-inner w-full">
                {questions.map((q, idx) => (
                    <p
                        key={idx}
                        className="text-base sm:text-lg text-gray-700 leading-relaxed border-b last:border-0 pb-2"
                    >
                        {q.trim()}
                    </p>
                ))}
            </div>

            <div className="flex flex-col items-center w-full">
                <Countdown
                    seconds={30}
                    onComplete={() => setCountdownEnd(true)}
                />

                {countdownEnd && (
                    <div className="mt-6 w-full">
                        <Recorder onComplete={setAudioFile} duration={60} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Part1;
