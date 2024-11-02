import { useEffect, useState } from "react";

export const DoomsdayClock = () => {
  const [timeRemaining, setTimeRemaining] = useState("");
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTime(new Date(2025, 6, 30, 12, 0, 0, 0)));
    });

    return () => {
      clearInterval(interval);
    };
  }, []);

  function calculateTime(dt) {
    const now = new Date();
    const diff = dt - now;
    if (diff < 0) {
      return "Czas wygasł";
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    return `${days} dni, ${hours} godzin, ${minutes} minut i ${seconds} sekund`;
  }
  return (
    <div className="flex flex-row gap-4 justify-center items-center">
      <p className="text-center">
        Do egzaminu zawodowego pozostało: {timeRemaining}
      </p>
    </div>
  );
};
