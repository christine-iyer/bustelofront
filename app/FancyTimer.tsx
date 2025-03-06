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
    progress, // ✅ Animated.Value
  } = useContext(TimerContext);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      {!showTimer && (
        <TouchableOpacity style={styles.showButton} onPress={() => setShowTimer(true)}>
          <Text style={styles.buttonText}>Show Timer</Text>
        </TouchableOpacity>
      )}

      {showTimer && (
        <View style={styles.timerBox}>
          <Text style={styles.timer}>{formatTime(time)}</Text>

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
                })} // ✅ Use progress.interpolate
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f4f4f4",
  },
  showButton: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
    textAlign: "center",
  },
  timerBox: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  timer: {},
  slider: {},
  svgContainer: {},
  buttonContainer: {},
  boldText: {
    fontWeight: "bold",
    color: "#000",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginVertical: 4,
    alignItems: "center",
    alignSelf: "flex-start",
  },
  showButton: {
    backgroundColor: "green",
  },
  startButton: {
    backgroundColor: "gray",
  },
  pauseButton: {
    backgroundColor: "blue",
  },
  stopButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
});

export default TimerShape;
