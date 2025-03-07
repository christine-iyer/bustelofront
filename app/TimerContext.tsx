import React, { createContext, useState, useEffect, ReactNode } from "react";
import { Animated } from "react-native";

// ✅ Define TimerContext Type
interface TimerContextProps {
  time: number;
  running: boolean;
  paused: boolean;
  selectedTime: number;
  showTimer: boolean;
  setShowTimer: (show: boolean) => void;
  setSelectedTime: (time: number) => void;
  startTimer: () => void;
  pauseResumeTimer: () => void;
  stopTimer: () => void;
  progress: Animated.Value;
}

// ✅ Create Context with Default Values
export const TimerContext = createContext<TimerContextProps | null>(null);

interface TimerProviderProps {
  children: ReactNode;
}

export const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [selectedTime, setSelectedTime] = useState(1);
  const [showTimer, setShowTimer] = useState(false);
  const progress = new Animated.Value(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (running && !paused) {
      timer = setInterval(() => {
        setTime((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }

    if (time === 0) {
      setRunning(false);
      progress.setValue(0);
    }

    return () => clearInterval(timer);
  }, [running, paused, time]);

  const startTimer = () => {
    setTime(selectedTime * 60);
    setRunning(true);
    setPaused(false);
    Animated.timing(progress, {
      toValue: 100,
      duration: selectedTime * 60000,
      useNativeDriver: false,
    }).start();
  };

  return (
    <TimerContext.Provider
      value={{
        time,
        running,
        paused,
        selectedTime,
        showTimer,
        setShowTimer,
        setSelectedTime,
        startTimer,
        pauseResumeTimer: () => setPaused((prev) => !prev),
        stopTimer: () => {
          setRunning(false);
          setPaused(false);
          setTime(0);
          progress.setValue(0);
        },
        progress,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};
