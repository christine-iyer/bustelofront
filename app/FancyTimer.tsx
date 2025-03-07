import React, { useContext, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Vibration,
} from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { TimerContext } from "./TimerContext";

// ✅ Wrap Path in Animated Component
const AnimatedPath = Animated.createAnimatedComponent(Path);

const TimerShape: React.FC = () => {
  const timerContext = useContext(TimerContext);
  if (!timerContext) return null;

  const {
    time,
    running,
    selectedTime,
    startTimer,
    pauseResumeTimer,
    stopTimer,
    progress,
    setSelectedTime,
  } = timerContext;

  const rotation = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ["0deg", "360deg"],
  });

  // ✅ Fix: Convert Animated Interpolation to Animated.Value
  const animatedStroke = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ["green", "red"],
  });

  const animatedDashOffset = progress.interpolate({
    inputRange: [0, 100],
    outputRange: [500, 0],
  });

  // ✅ Draggable Gesture Handler
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        let angle = Math.atan2(gesture.dy, gesture.dx) * (180 / Math.PI);
        if (angle < 0) angle += 360;

        const newTime = Math.round((angle / 360) * 60);
        if (!running) {
          setSelectedTime(newTime);
          Vibration.vibrate(50);
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>
        {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")} min
      </Text>

      {/* Circular Timer */}
      <View style={styles.circleContainer} {...panResponder.panHandlers}>
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <Svg width={200} height={200} viewBox="-100 -100 200 200">
            <Circle cx="0" cy="0" r="80" stroke="gray" strokeWidth="4" fill="none" />

            {/* ✅ Fix: Use AnimatedPath for stroke animation */}
            <AnimatedPath
              d="M 0 -80 A 80 80 0 1 1 0 80 A 80 80 0 1 1 0 -80"
              stroke={animatedStroke}
              strokeWidth="6"
              fill="none"
              strokeDasharray={500}
              strokeDashoffset={animatedDashOffset}
              strokeLinecap="round"
            />
          </Svg>
        </Animated.View>

        {/* Start/Stop Button Inside Circle */}
        <TouchableOpacity
          style={styles.circleButton}
          onPress={running ? stopTimer : startTimer}
        >
          <Text style={styles.buttonText}>{running ? "Stop" : "Start"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        {running && (
          <TouchableOpacity style={styles.pauseButton} onPress={pauseResumeTimer}>
            <Text style={styles.buttonText}>Pause</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center", padding: 20 },
  timer: { fontSize: 30, marginBottom: 20 },
  circleContainer: { alignItems: "center", justifyContent: "center" },
  circleButton: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "purple",
    alignItems: "center",
    justifyContent: "center",
    top: "35%",
    left: "35%",
  },
  buttonContainer: { flexDirection: "row", marginTop: 10 },
  pauseButton: { backgroundColor: "blue", padding: 10, margin: 5 },
  buttonText: { color: "white", fontWeight: "bold" },
});

export default TimerShape;
