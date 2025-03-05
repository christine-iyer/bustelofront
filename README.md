```js
import { useState, useEffect } from "react";

// Simple shapes instead of flowers
const shapes = {
  square: "M0,0 C50,40 50,70 20,100 L0,85 L-20,100 C-50,70 -50,40 0,0 Z",
  circle:
    "M0,0 C50,40 50,70 20,100 L0,85 L-20,100 C-50,70 -50,40 0,0 Z M0, 0 C-22.594, 59.915 -51.127, 69.185 -88.93, 49.922 L-80.8435, 26.265 -101.29, 11.878 -82.027, -25.925 -53.494, -35.195 0, 0  M 0 0,C -16.93579063226 -61.75813503335 0.701832243669994 -86.02970771345 42.6110277997 -92.66365751762L 49.973264815135 -68.76945592695 74.9731247065 -69.14682701638 81.60707451067 -27.23763146035 63.96945163474 -2.96605878025 0 0Z",
  triangle: "M0 0 C50 40 50 70 20 100 L0 85 L-20 100 C-50 70 -50 40 0 0 Z",
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

  // Timer Countdown Effect
  useEffect(() => {
    let timer;
    if (running && !paused) {
      timer = setInterval(() => {
        setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    }

    if (time === 0) {
      setRunning(false);
    }

    return () => clearInterval(timer);
  }, [running, paused, time]);

  // 2️⃣ Progress Update Effect
  useEffect(() => {
    if (running && !paused) {
      setProgress(((selectedTime * 60 - time) / (selectedTime * 60)) * 100);
    }
  }, [time, running, paused, selectedTime]);

  // Get Path Length Dynamically
  useEffect(() => {
    const pathElement = document.querySelector("#shape-path");
    if (pathElement) {
      const length = pathElement.getTotalLength();
      setPathLength(length);
      pathElement.style.strokeDasharray = length;
    }
  }, [selectedShape]);

  const startTimer = () => {
    setTime(selectedTime * 60);
    setProgress(0);
    setRunning(true);
    setPaused(false);
  };

  const pauseResumeTimer = () => {
    setPaused((prevPaused) => !prevPaused);
  };

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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px",
      }}
    >
      <h1
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}
      >
        Shape Timer
      </h1>

      {/* Timer Display */}
      <div
        style={{
          fontSize: "32px",
          fontFamily: "monospace",
          backgroundColor: "#1f2937",
          color: "white",
          padding: "16px",
          borderRadius: "8px",
        }}
      >
        {formatTime(time)}
      </div>

      {/* Time Selection */}
      <select
        style={{
          marginTop: "16px",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
        onChange={(e) => setSelectedTime(Number(e.target.value))}
        value={selectedTime}
        disabled={running}
      >
        {[0.25, 0.5, 1, 5, 10, 15, 30, 45].map((min) => (
          <option key={min} value={min}>
            {min} min
          </option>
        ))}
      </select>

      {/* Shape Selection */}
      <select
        style={{
          marginTop: "16px",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
        onChange={(e) => setSelectedShape(e.target.value)}
        value={selectedShape}
        disabled={running}
      >
        {Object.keys(shapes).map((shape) => (
          <option key={shape} value={shape}>
            {shape.charAt(0).toUpperCase() + shape.slice(1)}
          </option>
        ))}
      </select>

      {/* SVG Animation */}
      <svg
        width="200"
        height="200"
        viewBox="0 -100 35 300"
        style={{ marginTop: "11px" }}
        stroke="purple"
        strokeWidth="4"
        fill="none"
      >
        <path
          id="shape-path"
          d={shapes[selectedShape]}
          strokeDasharray={pathLength}
          strokeDashoffset={pathLength * (1 - progress / 100)}
          strokeLinecap="round"
        />
      </svg>

      {/* Controls */}
      <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
        {!running ? (
          <button
            onClick={startTimer}
            style={{
              padding: "8px 16px",
              backgroundColor: "#22c55e",
              color: "white",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Start
          </button>
        ) : (
          <>
            <button
              onClick={pauseResumeTimer}
              style={{
                padding: "8px 16px",
                backgroundColor: "#eab308",
                color: "white",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
              }}
            >
              {paused ? "Resume" : "Pause"}
            </button>
            <button
              onClick={stopTimer}
              style={{
                padding: "8px 16px",
                backgroundColor: "#ef4444",
                color: "white",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Stop
            </button>
          </>
        )}

        <button
          onClick={restartTimer}
          style={{
            padding: "8px 16px",
            backgroundColor: "#3b82f6",
            color: "white",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Restart
        </button>
      </div>
    </div>
  );
};

export default TimerShape;
```