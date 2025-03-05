import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Picker } from "@react-native-picker/picker";

const shapes = {
  square: "M 0 0 C 50 40 50 70 20 100 L 0 85 L -20 100 C -50 70 -50 40 0 0 M 0 0 C -22.594 59.915 -51.127 69.185 -88.93 49.922 L -80.8435 26.265 L -101.29 11.878 C -82.027 -25.925 -53.494 -35.195 0 0 M 0 0 C -63.9667025 -2.9754184 -81.6000965 -27.2487247 -74.9601842 -69.155425 L -49.961283 -68.77436785 L -42.5957758 -92.666617 C -0.689075500000001 -86.0267047 16.9443185 -61.7533984 0 0 M 0 0 C -16.93579063226 -61.75813503335 0.701832243669994 -86.02970771345 42.6110277997 -92.66365751762 L 49.973264815135 -68.76945592695 L 74.9731247065 -69.14682701638 C 81.60707451067 -27.23763146035 63.96945163474 -2.96605878025 0 0 M 0 0 C 53.5050029248508 -35.1908941956476 82.0397211695563 -25.9156670365015 101.299212255116 11.8942783673501 L 80.8483683599988 26.2798102842473 L 88.9322427095875 49.9405693602907 C 51.1222973057359 69.2000604458501 22.5875790610304 59.924833286704 0 0 Z",
  circle:
    "M 0 0 C 50 40 50 70 20 100 L 0 85 L -20 100 C -50 70 -50 40 0 0 M 0 0 C -22.594 59.915 -51.127 69.185 -88.93 49.922 L -80.8435 26.265 L -101.29 11.878 C -82.027 -25.925 -53.494 -35.195 0 0 M 0 0 C -63.9667025 -2.9754184 -81.6000965 -27.2487247 -74.9601842 -69.155425 L -49.961283 -68.77436785 L -42.5957758 -92.666617 C -0.689075500000001 -86.0267047 16.9443185 -61.7533984 0 0 M 0 0 C -16.93579063226 -61.75813503335 0.701832243669994 -86.02970771345 42.6110277997 -92.66365751762 L 49.973264815135 -68.76945592695 L 74.9731247065 -69.14682701638 C 81.60707451067 -27.23763146035 63.96945163474 -2.96605878025 0 0 M 0 0 C 53.5050029248508 -35.1908941956476 82.0397211695563 -25.9156670365015 101.299212255116 11.8942783673501 L 80.8483683599988 26.2798102842473 L 88.9322427095875 49.9405693602907 C 51.1222973057359 69.2000604458501 22.5875790610304 59.924833286704 0 0Z",
  triangle: "M 0 0 C 50 40 50 70 20 100 L 0 85 L -20 100 C -50 70 -50 40 0 0 M 0 0 C -22.594 59.915 -51.127 69.185 -88.93 49.922 L -80.8435 26.265 L -101.29 11.878 C -82.027 -25.925 -53.494 -35.195 0 0 M 0 0 C -63.9667025 -2.9754184 -81.6000965 -27.2487247 -74.9601842 -69.155425 L -49.961283 -68.77436785 L -42.5957758 -92.666617 C -0.689075500000001 -86.0267047 16.9443185 -61.7533984 0 0 M 0 0 C -16.93579063226 -61.75813503335 0.701832243669994 -86.02970771345 42.6110277997 -92.66365751762 L 49.973264815135 -68.76945592695 L 74.9731247065 -69.14682701638 C 81.60707451067 -27.23763146035 63.96945163474 -2.96605878025 0 0 M 0 0 C 53.5050029248508 -35.1908941956476 82.0397211695563 -25.9156670365015 101.299212255116 11.8942783673501 L 80.8483683599988 26.2798102842473 L 88.9322427095875 49.9405693602907 C 51.1222973057359 69.2000604458501 22.5875790610304 59.924833286704 0 0 Z",
  oval: "M 0 0 C 50 40 50 70 20 100 L 0 85 L -20 100 C -50 70 -50 40 0 0 M 0 0 C -22.594 59.915 -51.127 69.185 -88.93 49.922 L -80.8435 26.265 L -101.29 11.878 C -82.027 -25.925 -53.494 -35.195 0 0 M 0 0 C -63.9667025 -2.9754184 -81.6000965 -27.2487247 -74.9601842 -69.155425 L -49.961283 -68.77436785 L -42.5957758 -92.666617 C -0.689075500000001 -86.0267047 16.9443185 -61.7533984 0 0 M 0 0 C -16.93579063226 -61.75813503335 0.701832243669994 -86.02970771345 42.6110277997 -92.66365751762 L 49.973264815135 -68.76945592695 L 74.9731247065 -69.14682701638 C 81.60707451067 -27.23763146035 63.96945163474 -2.96605878025 0 0 M 0 0 C 53.5050029248508 -35.1908941956476 82.0397211695563 -25.9156670365015 101.299212255116 11.8942783673501 L 80.8483683599988 26.2798102842473 L 88.9322427095875 49.9405693602907 C 51.1222973057359 69.2000604458501 22.5875790610304 59.924833286704 0 0Z",
};

const TimerShape = () => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [selectedTime, setSelectedTime] = useState(1);
  const [selectedShape, setSelectedShape] = useState("square");
  const [progress, setProgress] = useState(0);
  const [pathLength, setPathLength] = useState(200);

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
    if (running && !paused) {
      setProgress(((selectedTime * 60 - time) / (selectedTime * 60)) * 100);
    }
  }, [time, running, paused, selectedTime]);

  const startTimer = () => {
    setTime(selectedTime * 60);
    setProgress(0);
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
    <View style={styles.container}>
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

      {/* SVG Animation */}
      <Svg width="200" height="200" viewBox="0 -100 35 300" style={styles.svg}>
        <Path
          d={shapes[selectedShape]}
          stroke="purple"
          strokeWidth="4"
          fill="none"
          strokeDasharray={pathLength}
          strokeDashoffset={pathLength * (1 - progress / 100)}
          strokeLinecap="round"
        />
      </Svg>

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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    backgroundColor: "pink"
  }
});

export default TimerShape;
