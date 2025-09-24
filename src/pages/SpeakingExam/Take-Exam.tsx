import React, { useState } from "react";
import Recorder from "./Recorder.tsx";
import TopicSection from "./TopicSection.tsx";
import Countdown from "./Countdown.tsx";

const AudioRecorder: React.FC = () => {
    const [topic, setTopic] = useState<any>(null);
    const [audio, setAudio] = useState<Blob | null>(null);
    const [countdown, setCountdown] = useState(false);
    const takeExam = async () => {
        if (!audio) {
            alert("Avval audio yozib oling!");
            return;
        }

        const formData = new FormData();
        formData.append("file", audio, "recording.webm");

        try {
            const res = await fetch("", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Yuborishda xatolik!");
            alert("Audio muvaffaqiyatli yuborildi ✅");
        } catch (err) {
            console.error(err);
            alert("Xatolik yuz berdi ❌");
        }
    };

    return (
        <div className="p-10">
            <TopicSection setTopic2={setTopic}/>
            {
                !countdown && topic && <Countdown
                    seconds={10}
                    onComplete={() => setCountdown(true)}
                />
            }
            {
                topic && countdown &&
                <Recorder
                duration={8}
                onComplete={(blob) => setAudio(blob)}
                takeExam={takeExam}
            />
            }
        </div>
    );
};

export default AudioRecorder;
