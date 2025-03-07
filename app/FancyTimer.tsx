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
import Svg, { Path, Circle, Text as SvgText } from "react-native-svg";
import { TimerContext } from "./TimerContext";
import * as Haptics from "expo-haptics";

const TimerShape: React.FC = () => {
  const context = useContext(TimerContext);

  if (!context) {
    throw new Error("TimerShape must be used within a TimerProvider");
  }

  const {
    time,
    running,
    selectedTime,
    setSelectedTime,
    startTimer,
    pauseResumeTimer,
    stopTimer,
    progress,
  } = context;

  const radius = 80;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const maxTime = 60; // Maximum time: 60 minutes

  const strokeDashoffset = progress.interpolate({
    inputRange: [0, maxTime * 60], // Convert minutes to seconds
    outputRange: [circumference, 0],
  }) as unknown as number;

  // ✅ Draggable Dial Logic
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const angle =
          (Math.atan2(gestureState.dy, gestureState.dx) * (180 / Math.PI) + 90 + 360) % 360;
        let newTime = Math.round((angle / 360) * maxTime);
        if (newTime < 1) newTime = 1;
        if (newTime > maxTime) newTime = maxTime;
        setSelectedTime(newTime);
      },
    })
  ).current;

  // Number markers for minutes
  const minuteMarks = Array.from({ length: 12 }, (_, i) => (i + 1) * 5);

  const handleAngle = ((selectedTime / maxTime) * 360 - 90) * (Math.PI / 180);
  const handleX = Math.cos(handleAngle) * (radius + 15);
  const handleY = Math.sin(handleAngle) * (radius + 15);

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>
        {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")} min
      </Text>

      {/* Circular Timer with Draggable Dial */}
      <View style={styles.circleContainer} {...panResponder.panHandlers}>
        <Svg width={220} height={220} viewBox="-110 -110 220 220">
          <Circle cx="0" cy="0" r={radius} stroke="gray" strokeWidth="4" fill="none" />

          <Path
            d="M 0 -80 A 80 80 0 1 1 0 80 A 80 80 0 1 1 0 -80"
            stroke="purple"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />

          {minuteMarks.map((min) => {
            const angle = (min / maxTime) * 360 - 90;
            const x = Math.cos((angle * Math.PI) / 180) * (radius + 20);
            const y = Math.sin((angle * Math.PI) / 180) * (radius + 20);
            return (
              <SvgText
                key={min}
                x={x}
                y={y}
                fill="black"
                fontSize="14"
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {min}
              </SvgText>
            );
          })}

          <Circle cx={handleX} cy={handleY} r="10" fill="red" {...panResponder.panHandlers} />
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
              <Text style={styles.buttonText}>Pause</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.stopButton} onPress={stopTimer}>
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingHorizontal: 10,
    borderStyle: "solid",
  },
  buttonContainer: {
    marginBottom: 16,
    paddingHorizontal: 10,
    borderStyle: "solid",
  },
  timer: {
    height: 44,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  startButton: {
    backgroundColor: "#EB5B00",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  stopButton: {
    backgroundColor: "#EB5B00",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  pauseButton: {
    backgroundColor: "#EB5B00",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  circleContainer: {
    marginBottom: 16,
    paddingHorizontal: 10,
    borderStyle: "solid",
  },

});

export default TimerShape;
