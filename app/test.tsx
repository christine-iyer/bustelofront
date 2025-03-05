import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { Audio } from "expo-av";
import Svg, { Path } from "react-native-svg";
import { Picker } from "@react-native-picker/picker";
import shapes from "./../app/utilities/shapes"; 

const TimerShape = ({ isVisible, onClose }) => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [selectedTime, setSelectedTime] = useState(1);
  const [selectedShape, setSelectedShape] = useState("square");
  const [progress, setProgress] = useState(0);
  const [sound, setSound] = useState(null);
  const [infoModalVisible, setInfoModalVisible] = useState(false); // ✅ Moved Shape Info modal state

  // Timer Logic
  useEffect(() => {
    let timer;
    if (running && !paused) {
      timer = setInterval(() => {
        setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
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
  };

  const pauseResumeTimer = () => setPaused((prevPaused) => !prevPaused);
  const stopTimer = () => {
    setRunning(false);
    setPaused(false);
    setTime(0);
    setProgress(0);
  };
  const restartTimer = () => {
    setTime(selectedTime * 60);
    setProgress(0);
    setRunning(true);
    setPaused(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.heading}>Shape Timer</Text>
          <Text style={styles.timer}>{formatTime(time)}</Text>

          {/* Time Selection */}
          <Picker
            selectedValue={selectedTime}
            onValueChange={(itemValue) => setSelectedTime(itemValue)}
            enabled={!running}
            style={styles.picker}
          >
            {[0.25, 0.5, 1, 5, 10, 15, 30, 45].map((min) => (
              <Picker.Item key={min} label={`${min} min`} value={min} />
            ))}
          </Picker>

          {/* Shape Selection */}
          <Picker
            selectedValue={selectedShape}
            onValueChange={(itemValue) => setSelectedShape(itemValue)}
            enabled={!running}
            style={styles.picker}
          >
            {Object.keys(shapes).map((shape) => (
              <Picker.Item key={shape} label={shape} value={shape} />
            ))}
          </Picker>

          {/* SVG Shape */}
          <View style={styles.svgContainer}>
            <Svg width={250} height={250} viewBox="-100 -100 200 200">
              <Path
                d={shapes[selectedShape]}
                stroke="purple"
                strokeWidth="4"
                fill="none"
                strokeDasharray={200}
                strokeDashoffset={200 * (1 - progress / 100)}
                strokeLinecap="round"
              />
            </Svg>
          </View>

          {/* Controls */}
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
            <TouchableOpacity style={styles.restartButton} onPress={restartTimer}>
              <Text style={styles.buttonText}>Restart</Text>
            </TouchableOpacity>

            {/* Shape Info Button */}
            <TouchableOpacity style={styles.modalButton} onPress={() => setInfoModalVisible(true)}>
              <Text style={styles.buttonText}>Shape Info</Text>
            </TouchableOpacity>
          </View>

          {/* Close Timer Modal */}
          <TouchableOpacity style={styles.closeModalButton} onPress={onClose}>
            <Text style={styles.buttonText}>Close Timer</Text>
          </TouchableOpacity>
        </View>

        {/* ✅ Shape Info Modal (Cleaner) */}
        <Modal visible={infoModalVisible} transparent={true} animationType="fade">
          <View style={styles.infoModalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Shape Info</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setInfoModalVisible(false)}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContainer: { width: "80%", backgroundColor: "pink", padding: 20, borderRadius: 10, alignItems: "center" },
  heading: { fontSize: 20, fontWeight: "bold" },
  timer: { fontSize: 30, marginVertical: 10 },
  picker: { width: 150, height: 50 },
  svgContainer: { width: 250, height: 250, justifyContent: "center", alignItems: "center", marginVertical: 10 },
  buttonContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 10, justifyContent: "center" },
  buttonText: { color: "white", fontWeight: "bold" },
  modalButton: { backgroundColor: "blue", padding: 10, borderRadius: 5, marginTop: 10 },
  closeModalButton: { backgroundColor: "red", padding: 10, marginTop: 10, borderRadius: 5, alignItems: "center" },
  infoModalContainer: { position: "absolute", top: 50, right: 20, backgroundColor: "white", padding: 15, borderRadius: 10 },
  modalContent: { alignItems: "center" },
  closeButton: { backgroundColor: "red", padding: 10, marginTop: 10, borderRadius: 5, alignItems: "center" },
});

export default TimerShape;
