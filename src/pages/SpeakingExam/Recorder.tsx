import {useEffect, useRef, useState} from "react";

type RecorderProps = {
    duration?: number;
    onComplete?: (blob: Blob) => void;
    takeExam?: () => void;
};

export default function Recorder({duration, onComplete, takeExam}: RecorderProps) {
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [recording, setRecording] = useState(false);
    const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [elapsed, setElapsed] = useState(0); // seconds
    const timerRef = useRef<number | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const chunksRef = useRef<BlobPart[]>([]);

    const prepareRecorder = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true});
        streamRef.current = stream;
        setPermissionGranted(true);

        const mr = new MediaRecorder(stream, {mimeType: "audio/webm"});
        mr.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
                chunksRef.current.push(e.data);
            }
        };
        mr.onstop = () => {
            if (chunksRef.current.length > 0) {
                const blob = new Blob(chunksRef.current, {type: "audio/webm"});
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                if (onComplete) onComplete(blob);
                chunksRef.current = [];
            }
            stopAllStreams();
        };
        mediaRecorderRef.current = mr;
    };

    useEffect(() => {
        return () => {
            stopAllStreams();
            cleanupTimer();
            if (audioUrl) URL.revokeObjectURL(audioUrl);
            start();
        };
    }, []);

    const start = async () => {
        if (!mediaRecorderRef.current) await prepareRecorder();
        if (!mediaRecorderRef.current) return;

        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
            setAudioUrl(null);
        }
        setElapsed(0);

        try {
            mediaRecorderRef.current.start();
            setRecording(true);
            startTimer();
        } catch (err) {
            console.error("Failed to start recorder:", err);
        }
    };

    const stop = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
        }
        setRecording(false);
        cleanupTimer();
    };

    const stopAllStreams = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
        mediaRecorderRef.current = null;
    };

    const startTimer = () => {
        cleanupTimer();
        const startTs = Date.now();
        timerRef.current = window.setInterval(() => {
            const sec = Math.floor((Date.now() - startTs) / 1000);
            setElapsed(sec);
            if (typeof duration === "number" && sec >= duration) {
                stop();
            }
        }, 250);
    };

    const cleanupTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    return (
        <div className="max-w-xl mx-auto p-4 border rounded-lg shadow-sm bg-white">
            <h3 className="text-lg font-medium mb-2">Audio Recorder</h3>

            <div className="flex items-center gap-2 mb-3">
                {/*<button*/}
                {/*    onClick={start}*/}
                {/*    disabled={recording}*/}
                {/*    className={`px-3 py-2 rounded-md text-white ${recording ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}>*/}
                {/*    Start*/}
                {/*</button>*/}

                {/*<button*/}
                {/*    onClick={stop}*/}
                {/*    disabled={!recording}*/}
                {/*    className={`px-3 py-2 rounded-md text-white ${!recording ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}>*/}
                {/*    Stop*/}
                {/*</button>*/}

                {/*<button onClick={download} disabled={!audioUrl} className={`px-3 py-2 rounded-md text-white ${!audioUrl ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}>*/}
                {/*    Download*/}
                {/*</button>*/}

                {
                    audioUrl &&
                    <button
                        onClick={takeExam}
                        className={`px-3 py-2 rounded-md text-white ${!audioUrl ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"}`}>
                        Yuborish
                    </button>
                }
            </div>

            <div className="mb-2">
                <div
                    className="text-sm text-gray-600">Mikrafon: {permissionGranted === null ? "topilmadi" : permissionGranted ? "ishlayapti" : "taqiqlandi"}</div>
                <div className="text-sm text-gray-600">Holat: {recording ? "Ovoz yozish" : ""}</div>
                <div className="text-sm text-gray-600">Vaqt: {elapsed}s {duration ? `/ ${duration}s` : null}</div>
            </div>

            {audioUrl && (
                <div className="mt-3">
                    <audio controls src={audioUrl} className="w-full"/>
                </div>
            )}
        </div>
    );
}
