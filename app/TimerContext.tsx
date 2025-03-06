import React, { createContext, useState, useEffect } from "react";
import { Animated } from "react-native";

// ✅ Create Context
export const TimerContext = createContext(null);

export const TimerProvider = ({ children }) => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [selectedTime, setSelectedTime] = useState(1);
  const [showTimer, setShowTimer] = useState(false);
  const progress = new Animated.Value(0);

  useEffect(() => {
    let timer;
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
        progress,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};
