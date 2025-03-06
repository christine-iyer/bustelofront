import React, { createContext, useState, useEffect } from "react";
import { Audio } from "expo-av";
import { Animated } from "react-native";

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [selectedTime, setSelectedTime] = useState(1);
  const [showTimer, setShowTimer] = useState(false);
  const [sound, setSound] = useState(null);
  const [progress, setProgress] = useState(new Animated.Value(0));

  useEffect(() => {
    let timer;
    if (running && !paused) {
      timer = setInterval(() => {
        setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        setProgress(
          new Animated.Value(((selectedTime * 60 - time) / (selectedTime * 60)) * 100)
        );
      }, 1000);
    }
    if (time === 0) setRunning(false);
    return () => clearInterval(timer);
  }, [running, paused, time]);

  useEffect(() => {
    if (time === 0 && running) {
      playSound();
      setRunning(false);
    }
  }, [time, running]);

  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: "https://www.fesliyanstudios.com/play-mp3/24" },
        { shouldPlay: true }
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  const startTimer = () => {
    setTime(selectedTime * 60);
    setRunning(true);
    setPaused(false);
    Animated.timing(progress, {
      toValue: 100,
      duration: selectedTime * 60 * 1000,
      useNativeDriver: false,
    }).start();
  };

  const pauseResumeTimer = () => setPaused((prevPaused) => !prevPaused);
  const stopTimer = () => {
    setRunning(false);
    setPaused(false);
    setTime(0);
    setProgress(new Animated.Value(0));
  };

  const restartTimer = () => {
    setTime(selectedTime * 60);
    setRunning(true);
    setPaused(false);
    Animated.timing(progress, {
      toValue: 100,
      duration: selectedTime * 60 * 1000,
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
        pauseResumeTimer,
        stopTimer,
        restartTimer,
        progress,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};
