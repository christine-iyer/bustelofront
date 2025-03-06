import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { TimerContext } from "./TimerContext";
import Svg, { Path } from "react-native-svg";
import Slider from "@react-native-community/slider";

const TimerShape = () => {
  const {
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
  } = useContext(TimerContext);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      {/* Show/Hide Timer Button */}
      {!showTimer && (
        <TouchableOpacity style={styles.showButton} onPress={() => setShowTimer(true)}>
          <Text style={styles.buttonText}>Show Timer</Text>
        </TouchableOpacity>
      )}

      {/* Floating Timer */}
      {showTimer && (
        <View style={styles.timerBox}>
          <Text style={styles.timer}>{formatTime(time)}</Text>

          {/* Time Selection Slider */}
          {!running && (
            <Slider
              style={styles.slider}
              minimumValue={0.25}
              maximumValue={45}
              step={0.25}
              value={selectedTime}
              onValueChange={setSelectedTime}
              minimumTrackTintColor="purple"
              maximumTrackTintColor="gray"
            />
          )}

          <View style={styles.svgContainer}>
            <Svg width={60} height={60} viewBox="-100 -100 200 200">
              <Path
                d="M 0 0 C 50 40 50 70 20 100 L 0 85 L -20 100 C -50 70 -50 40 0 0 M 0 0 C -22.594 59.915 -51.127 69.185 -88.93 49.922 L -80.8435 26.265 L -101.29 11.878 C -82.027 -25.925 -53.494 -35.195 0 0 M 0 0 C -63.9667025 -2.9754184 -81.6000965 -27.2487247 -74.9601842 -69.155425 L -49.961283 -68.77436785 L -42.5957758 -92.666617 C -0.689075500000001 -86.0267047 16.9443185 -61.7533984 0 0 M 0 0 C -16.93579063226 -61.75813503335 0.701832243669994 -86.02970771345 42.6110277997 -92.66365751762 L 49.973264815135 -68.76945592695 L 74.9731247065 -69.14682701638 C 81.60707451067 -27.23763146035 63.96945163474 -2.96605878025 0 0 Z"
                stroke="purple"
                strokeWidth="3"
                fill="none"
                strokeDasharray={100}
                strokeDashoffset={progress.interpolate({
                  inputRange: [0, 100],
                  outputRange: [100, 0],
                })}
                strokeLinecap="round"
              />
            </Svg>
          </View>

          <View style={styles.buttonContainer}>
            {!running ? (
              <TouchableOpacity style={styles.startButton} onPress={startTimer}>
                <Text style={styles.buttonText}>Start</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity style={styles.pauseButton} onPress={pauseResumeTimer}>
                  <Text style={styles.buttonText}>{paused ? "Resume" : "Pause"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.stopButton} onPress={stopTimer}>
                  <Text style={styles.buttonText}>Stop</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default TimerShape;
