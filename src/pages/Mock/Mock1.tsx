import { useState, useEffect } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

interface Topic {
  id: number;
  topic: string;
}

interface SpeakingForm {
  audio: Blob;
  topic: number;
  part: number;
}

interface Props {
  topic: Topic;
  setSpeakingForm: (form: SpeakingForm) => void;
}

const Mock1: React.FC<Props> = ({ topic, setSpeakingForm }) => {
  const [recordingStarted, setRecordingStarted] = useState(false);
  const [timer, setTimer] = useState(0);

  const { startRecording, stopRecording, mediaBlobUrl, status } =
    useReactMediaRecorder({ audio: true });

  const handleStartRecording = () => {
    setRecordingStarted(true);
    setTimer(0);
    startRecording();
  };

  useEffect(() => {
    let interval: number | undefined;
    let timeout: number | undefined;

    if (status === "recording") {
      interval = window.setInterval(() => setTimer((prev) => prev + 1), 1000);

      timeout = window.setTimeout(() => {
        stopRecording();
        setRecordingForm();
      }, 60_000); 
    }

    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [status]);

  const setRecordingForm = async () => {
    if (mediaBlobUrl) {
      const blob = await fetch(mediaBlobUrl).then((r) => r.blob());
      setSpeakingForm({ audio: blob, topic: topic.id, part: 1 });
    }
  };

  return (
    <div className="flex flex-col items-center mt-6">
      <h2 className="text-lg font-bold mb-4">Part 1</h2>
      <p>{topic.topic}</p>

      {!recordingStarted ? (
        <button
          onClick={handleStartRecording}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Start Recording
        </button>
      ) : (
        <p>Recording... {timer}s</p>
      )}

      {mediaBlobUrl && (
        <div className="mt-4 w-full max-w-md">
          <AudioPlayer src={mediaBlobUrl} />
        </div>
      )}
    </div>
  );
};

export default Mock1;
