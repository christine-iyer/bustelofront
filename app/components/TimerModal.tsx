import React, { useState, useEffect, useRef } from "react";
import { View, Text, Button, Modal, TouchableOpacity } from "react-native";
import * as d3 from "d3";

const TimerModal = ({ isVisible, onClose }) => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [selectedTime, setSelectedTime] = useState(1);
  const svgRef = useRef(null);
  const totalTimeRef = useRef(0); // Store total time in seconds

  // 🎵 Sound Play Function
  const playSound = () => {
    const audio = new Audio("https://www.fesliyanstudios.com/play-mp3/2440");
    audio.volume = 1;
    audio.play();

    // 🎵 Fade out after 10 sec
    setTimeout(() => {
      let fadeOut = setInterval(() => {
        if (audio.volume > 0.05) {
          audio.volume -= 0.05;
        } else {
          audio.volume = 0;
          audio.pause();
          clearInterval(fadeOut);
        }
      }, 200);
    }, 10000);
  };

  // ⏳ Timer Countdown Effect
  useEffect(() => {
    let timer;
    if (running && !paused) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime > 0) return prevTime - 1;
          playSound();
          clearInterval(timer);
          return 0;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [running, paused]);

  // 🌸 Flower Animation Effect (Persists even when modal closes)
  useEffect(() => {
    if (!running || time <= 0) return;

    const width = 200,
      height = 200;
    const numPetals = 6;
    const angle = 360 / numPetals;
    const petalPath =
      "M0,0 C39,57 -53,72 -41,50 L25,26 L17,12, C-6,-23,21,-38 0,0 M0,0 C50,30 50,80 20,100 L0,85 L20,100 C-50,80 -50,30 0,0";
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const flowerGroup = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const colorScale = d3
      .scaleSequential(d3.interpolateCool)
      .domain([numPetals, 0]);

    const progress = 1 - time / totalTimeRef.current;

    for (let i = 0; i < numPetals; i++) {
      const petal = flowerGroup
        .append("path")
        .attr("d", petalPath)
        .attr("fill", "none")
        .attr("stroke", colorScale(i))
        .attr("stroke-width", 2)
        .attr("transform", `rotate(${i * angle})`);

        const petalNode = petal.node();
        if (!petalNode) return; // Prevent error if petal isn't ready
        
        const totalLength = petalNode.getTotalLength();
        

      petal
        .attr("stroke-dasharray", totalLength)
        .attr("stroke-dashoffset", totalLength * (1 - progress))
        .transition()
        .duration(800)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0)
        .attr("fill", colorScale(i))
        .attr("fill-opacity", progress);
    }

    flowerGroup
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 15 * progress)
      .attr("fill", "gold")
      .style("opacity", progress)
      .style("filter", "drop-shadow(0px 0px 10px gold)");
  }, [time]);

  // 🎯 Timer Controls
  const startTimer = () => {
    const totalSeconds = selectedTime * 60;
    setTime(totalSeconds);
    totalTimeRef.current = totalSeconds;
    setRunning(true);
    setPaused(false);
  };

  const pauseResumeTimer = () => setPaused((prev) => !prev);
  const stopTimer = () => {
    setRunning(false);
    setPaused(false);
    setTime(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          style={{
            width: "80%",
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>Flower Timer</Text>

          {/* Timer Display */}
          <Text
            style={{
              fontSize: 32,
              fontFamily: "monospace",
              backgroundColor: "#1f2937",
              color: "white",
              padding: 16,
              borderRadius: 8,
              marginTop: 10,
            }}
          >
            {formatTime(time)}
          </Text>

          {/* Time Selection */}
          <select
            onChange={(e) => setSelectedTime(Number(e.target.value))}
            value={selectedTime}
            disabled={running}
            style={{ marginTop: 16, padding: 8, borderRadius: 4 }}
          >
            {[0.25, 0.5, 1, 5, 10, 15, 30, 45].map((min) => (
              <option key={min} value={min}>
                {min} min
              </option>
            ))}
          </select>

          {/* SVG Flower Animation */}
          <svg
            ref={svgRef}
            width="200"
            height="200"
            viewBox="0 0 200 200"
            style={{ marginTop: 16 }}
          ></svg>

          {/* Controls */}
          <View style={{ flexDirection: "row", marginTop: 16, gap: 8 }}>
            {!running ? (
              <Button title="Start" onPress={startTimer} />
            ) : (
              <>
                <Button
                  title={paused ? "Resume" : "Pause"}
                  onPress={pauseResumeTimer}
                />
                <Button title="Stop" onPress={stopTimer} />
              </>
            )}
          </View>

          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            style={{
              marginTop: 16,
              padding: 10,
              backgroundColor: "#ccc",
              borderRadius: 4,
            }}
          >
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TimerModal;
// import React from "react";
// import { Modal, View, Text, Button, TouchableOpacity } from "react-native";

// interface TimerModalProps {
//   isVisible: boolean;
//   onClose: () => void;
// }

// const TimerModal: React.FC<TimerModalProps> = ({ isVisible, onClose }) => {
//   return (
//     <Modal visible={isVisible} animationType="slide" transparent={true}>
//       <View
//         style={{
//           flex: 1,
//           justifyContent: "center",
//           alignItems: "center",
//           backgroundColor: "rgba(0, 0, 0, 0.5)",
//         }}
//       >
//         <View
//           style={{
//             width: "80%",
//             backgroundColor: "white",
//             padding: 20,
//             borderRadius: 10,
//             alignItems: "center",
//           }}
//         >
//           <Text style={{ fontSize: 24, fontWeight: "bold" }}>Flower Timer</Text>

//           {/* Close Button */}
//           <TouchableOpacity
//             onPress={onClose}
//             style={{
//               marginTop: 16,
//               padding: 10,
//               backgroundColor: "#ccc",
//               borderRadius: 4,
//             }}
//           >
//             <Text>Close</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default TimerModal;
