import React, { createContext, useState, useEffect, ReactNode } from "react";
import { Animated } from "react-native";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";

// ✅ Define Timer Context Type
interface TimerContextType {
  time: number;
  running: boolean;
  selectedTime: number;
  setSelectedTime: (time: number) => void;
  startTimer: () => void;
  pauseResumeTimer: () => void;
  stopTimer: () => void;
  progress: Animated.Value;
}

// ✅ Create Context with Type
export const TimerContext = createContext<TimerContextType | null>(null);

// ✅ TimerProvider Props Type
interface TimerProviderProps {
  children: ReactNode;
}

// ✅ TimerProvider Component
export const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
  const [time, setTime] = useState<number>(0);
  const [running, setRunning] = useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState<number>(1); // Default 1 minute
  const progress = new Animated.Value(0);
  const sound = React.useRef<Audio.Sound | null>(null);

  // ✅ Fetch sound from the internet (NO LOCAL MP3)
  const loadSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: "https://www.fesliyanstudios.com/play-mp3/2440" }, // ✅ Use external sound URL
        { shouldPlay: false }
      );
      return sound;
    } catch (error) {
      console.error("Error loading sound:", error);
      return null;
    }
  };

  // ✅ Play sound when timer ends
  const playSound = async () => {
    if (!sound.current) {
      sound.current = await loadSound();
    }
    if (sound.current) {
      await sound.current.replayAsync();
    }
  };

  // ✅ Handle Timer Completion
  const handleCompletion = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    playSound();
  };

  // ✅ Timer Countdown Logic
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (running && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === 1) {
            handleCompletion();
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (time === 0) {
      setRunning(false);
      progress.setValue(0);
    }

    return () => clearInterval(timer);
  }, [running, time]);

  // ✅ Start Timer
  const startTimer = async () => {
    if (!sound.current) {
      sound.current = await loadSound();
    }
    setTime(selectedTime * 60);
    setRunning(true);
    Animated.timing(progress, {
      toValue: selectedTime * 60,
      duration: selectedTime * 60000,
      useNativeDriver: false,
    }).start();
  };

  // ✅ Pause/Resume Timer
  const pauseResumeTimer = () => {
    setRunning((prev) => !prev);
  };

  // ✅ Stop Timer
  const stopTimer = () => {
    setRunning(false);
    setTime(0);
    progress.setValue(0);
  };

  return (
    <TimerContext.Provider
      value={{
        time,
        running,
        selectedTime,
        setSelectedTime,
        startTimer,
        pauseResumeTimer,
        stopTimer,
        progress,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};
