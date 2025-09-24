import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import API from "../../api/axios";
import { LoadingSpinner } from "../../utils/index";

interface Topic {
  topic: string;
}

interface Mock {
  id: number;
  userId: number;
  userFullName: string;
  topic1: Topic;
  topic2: Topic;
  topic3: Topic;
  partOneAudioUrl?: string;
  partTwoAudioUrl?: string;
  partThreeAudioUrl?: string;
  checked?: boolean;
}

interface Grade {
  degree: string;
  feedback: string;
}

const SingleMock = () => {
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mock, setMock] = useState<Mock | null>(null);
  const [grade, setGrade] = useState<Grade | null>(null);

  const fetchSpeaking = async () => {
    try {
      const response = await axios.get(`${API}/mock/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMock(response.data.mock);
      setGrade(response.data.grade);
    } catch (err) {
      setError("Failed to fetch data");
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchSpeaking();
      setLoading(false);
    };
    loadData();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <h1 className="text-red-600">{error}</h1>;

  return (
    <div className="text-center mt-5">
      {mock && (
        <div
          key={mock.id}
          className="w-full md:w-96 lg:w-2/3 xl:w-1/2 mx-auto my-4 border-b rounded border p-4 transition-all hover:shadow-lg"
        >
          {/* Part 1 */}
          <h2 className="text-lg font-semibold">Part 1</h2>
          {mock.topic1.topic.split("|").map((e, i) => (
            <p key={i} className="text-lg font-semibold">
              {e}
            </p>
          ))}
          {mock.partOneAudioUrl && (
            <audio controls>
              <source src={`${API}/audio/${mock.partOneAudioUrl}`} type="audio/mp3" />
            </audio>
          )}

          {/* Part 2 */}
          <h2 className="text-lg font-semibold mt-4">Part 2</h2>
          {mock.topic2.topic.split("|").map((e, i) => (
            <p key={i} className="text-lg font-semibold">
              {e}
            </p>
          ))}
          {mock.partTwoAudioUrl && (
            <audio controls>
              <source src={`${API}/audio/${mock.partTwoAudioUrl}`} type="audio/mp3" />
            </audio>
          )}

          {/* Part 3 */}
          <h2 className="text-lg font-semibold mt-4">Part 3</h2>
          <p>{mock.topic3.topic}</p>
          {mock.partThreeAudioUrl && (
            <audio controls>
              <source src={`${API}/audio/${mock.partThreeAudioUrl}`} type="audio/mp3" />
            </audio>
          )}

          {/* Share link */}
          <div className="text-right mt-2 flex justify-end items-center">
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(
                window.location.origin + `/mock-feedback/${mock.id}`
              )}&text=${encodeURIComponent("Check out this Mock speaking")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-600"
            >
              Share 📤
            </a>
          </div>

          {/* Feedback */}
          {mock.checked && grade && (
            <form className="flex flex-col gap-4 mt-4">
              <label className="text-left">Daraja : {grade.degree}</label>
              <label className="text-left">Feedback : {grade.feedback}</label>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default SingleMock;
