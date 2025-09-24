import React, { useState, useEffect } from 'react';

interface ListeningTest {
  question: string;
  audioUrl: string;
  options: string;
}

const Listening: React.FC = () => {
  const [testData, setTestData] = useState<ListeningTest[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(30);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:8081/api/v1/listening/listening-tests');
      const data: ListeningTest[] = await response.json();
      setTestData(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime > 1) {
          return prevTime - 1;
        } else {
          if (currentQuestion < testData.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
            return 30;
          }
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, testData.length]);

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">IELTS Listening Test</h2>
      <p className="mb-4">Time remaining: {timeRemaining}s</p>

      {testData.length > 0 && (
        <div>
          <h3 className="mb-2">{testData[currentQuestion].question}</h3>
          <audio controls className="mb-4">
            <source src={testData[currentQuestion].audioUrl} type="audio/mp3" />
          </audio>
          <div className="space-y-2">
            {testData[currentQuestion].options &&
              testData[currentQuestion].options.split(',').map((option, idx) => (
                <div key={idx}>
                  <input type="radio" name="answer" id={`option-${idx}`} />
                  <label htmlFor={`option-${idx}`} className="ml-2">
                    {option}
                  </label>
                </div>
              ))}
          </div>
          <button
            onClick={() =>
              currentQuestion < testData.length - 1 &&
              setCurrentQuestion(currentQuestion + 1)
            }
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(Listening);
