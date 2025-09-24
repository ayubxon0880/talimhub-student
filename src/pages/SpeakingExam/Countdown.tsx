import React, { useEffect, useState } from "react";

interface CountdownProps {
    seconds: number;
    onComplete: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ seconds, onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(seconds);

    useEffect(() => {
        if (timeLeft <= 0) {
            onComplete();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, onComplete]);

    return (
        <div className="p-4 text-center text-3xl font-bold text-blue-600">
            ⏳ {timeLeft} s
        </div>
    );
};

export default Countdown;
