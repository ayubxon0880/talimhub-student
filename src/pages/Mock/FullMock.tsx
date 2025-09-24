import { useEffect, useState } from "react";
import axios from "axios";
import API from "../../api/axios";
import { LoadingSpinner } from "../../utils/index";
import Mock1 from "./Mock1";
import Mock2 from "./Mock2";
import Mock3 from "./Mock3";
import React from "react";

interface Topic {
  id: number;
  topic: string;
  name?: string;
  image1?: string;
  image2?: string;
}

interface SpeakingForm {
  audio: Blob;
  topic: number;
  part: number;
}

const FullMock: React.FC = () => {
  const [speakingOneForm, setSpeakingOneForm] = useState<SpeakingForm | null>(null);
  const [speakingTwoForm, setSpeakingTwoForm] = useState<SpeakingForm | null>(null);
  const [speakingThreeForm, setSpeakingThreeForm] = useState<SpeakingForm | null>(null);

  const [topicOne, setTopicOne] = useState<Topic | null>(null);
  const [topicTwo, setTopicTwo] = useState<Topic | null>(null);
  const [topicThree, setTopicThree] = useState<Topic | null>(null);

  const [step, setStep] = useState<number>(-1);

  useEffect(() => {
    if (speakingThreeForm != null) {
      setStep(4);
      handleFinalSubmission();
    } else if (speakingTwoForm != null) {
      setStep(3);
    } else if (speakingOneForm != null) {
      setStep(2);
    }
  }, [speakingOneForm, speakingTwoForm, speakingThreeForm]);

  const handleRandomTopic = () => {
    setStep(0);
    axios
      .get(`${API}/topic/random/full-mock`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data) {
          setTopicOne(res.data.first);
          setTopicTwo(res.data.second);
          setTopicThree(res.data.third);
          setStep(1);
        }
      })
      .catch((error) => {
        console.error("Error fetching topics:", error);
        setStep(1);
        setTopicOne({
          id: 1,
          topic: "top",
          image1: "/public/logo.png",
          image2: "/public/logo.png",
        });
      });
  };

  const handleFinalSubmission = async () => {
    if (!speakingOneForm || !speakingTwoForm || !speakingThreeForm) return;

    try {
      const formData = new FormData();
      formData.append("topicOne", speakingOneForm.topic.toString());
      formData.append("topicTwo", speakingTwoForm.topic.toString());
      formData.append("topicThree", speakingThreeForm.topic.toString());
      formData.append("audioOne", speakingOneForm.audio);
      formData.append("audioTwo", speakingTwoForm.audio);
      formData.append("audioThree", speakingThreeForm.audio);

      const response = await axios.post(`${API}/mock/save/full-mock`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setStep(5);
      alert("Ma'lumotlar saqlandi: " + JSON.stringify(response.data));
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  return (
    <div className="flex flex-col items-center mt-4">
      {step === -1 && (
        <button
          onClick={handleRandomTopic}
          className="mt-2 p-2 bg-blue-500 text-white rounded"
        >
          Boshlash
        </button>
      )}
      {step === 0 && <LoadingSpinner />}
      {step === 1 && topicOne && (
        <Mock1 setSpeakingForm={setSpeakingOneForm} topic={topicOne} />
      )}
      {step === 2 && topicTwo && (
        <Mock2 setSpeakingForm={setSpeakingTwoForm} topic={topicTwo} />
      )}
      {step === 3 && topicThree && (
        <Mock3 setSpeakingForm={setSpeakingThreeForm} topic={topicThree} />
      )}
      {step === 4 && (
        <>
          <LoadingSpinner />
          <p>
            Sabrning tagi sariq oltin, Speakingni saqlash ozgina vaqt olishi
            mumkin. Sabr qilishingizni so‘raymiz.
          </p>
          <button onClick={handleFinalSubmission}>Saqlash</button>
        </>
      )}
      {step === 5 && (
        <>
          <p>Speaking muvaffaqiyatli saqlandi ✅</p>
        </>
      )}
    </div>
  );
};

export default React.memo(FullMock);
