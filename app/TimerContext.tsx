import React, { createContext, useState } from "react";
import { Animated } from "react-native"; // ✅ Import Animated

export const TimerContext = createContext({
  time: 0,
  running: false,
  paused: false,
  selectedTime: 1,
  showTimer: false,
  setShowTimer: () => {},
  setSelectedTime: () => {},
  startTimer: () => {},
  pauseResumeTimer: () => {},
  stopTimer: () => {},
  restartTimer: () => {},
  progress: new Animated.Value(0), // ✅ Ensure this is an Animated value
});

export const TimerProvider = ({ children }) => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [selectedTime, setSelectedTime] = useState(1);
  const [showTimer, setShowTimer] = useState(false);
  const progress = new Animated.Value(0); // ✅ Fix: Use Animated.Value

  const startTimer = () => {
    setRunning(true);
    Animated.timing(progress, {
      toValue: 100,
      duration: selectedTime * 60000, // Converts minutes to milliseconds
      useNativeDriver: false,
    }).start();
  };

  const pauseResumeTimer = () => setPaused((prev) => !prev);
  const stopTimer = () => {
    setRunning(false);
    setPaused(false);
    setTime(0);
    progress.setValue(0); // ✅ Reset progress animation
  };

  const restartTimer = () => {
    setTime(selectedTime * 60);
    progress.setValue(0);
    setRunning(true);
    setPaused(false);
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
        pauseResumeTimer,
        stopTimer,
        restartTimer,
        progress, // ✅ Pass Animated progress
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};
