import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

function BackgroundCubes() {
  const canvasRef = useRef(null);
  const animRef = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    let w = (c.width = window.innerWidth);
    let h = (c.height = window.innerHeight);

    const onResize = () => {
      w = c.width = window.innerWidth;
      h = c.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", (e) => {
      mouse.current.x = (e.clientX / w - 0.5) * 2;
      mouse.current.y = (e.clientY / h - 0.5) * 2;
    });

    const N = 80;
    const cubes = Array.from({ length: N }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      s: 6 + Math.random() * 24,
      a: Math.random() * Math.PI * 2,
      sp: 0.15 + Math.random() * 0.6,
      d: Math.random() * 0.6 + 0.4,
      o: 0.15 + Math.random() * 0.4,
    }));

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "rgba(139,92,246,0.7)");
    grad.addColorStop(1, "rgba(56,189,248,0.7)");

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(10,10,16,0.9)";
      ctx.fillRect(0, 0, w, h);
      cubes.forEach((q) => {
        q.a += 0.002 * q.sp;
        q.y -= q.sp;
        q.x += Math.sin(q.a) * q.d + mouse.current.x * 0.5;
        if (q.y + q.s < 0) q.y = h + q.s;
        if (q.x < -q.s) q.x = w + q.s;
        if (q.x > w + q.s) q.x = -q.s;
        ctx.save();
        ctx.translate(q.x, q.y);
        ctx.rotate(q.a * 0.1);
        ctx.globalAlpha = q.o;
        ctx.fillStyle = grad;
        ctx.fillRect(-q.s / 2, -q.s / 2, q.s, q.s);
        ctx.restore();
      });
      animRef.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="bgcubes-canvas" />;
}

function ProgressBar({ progress, label }) {
  return (
    <div className="progress-wrapper">
      <p className="progress-label">{label}</p>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

export default function App() {
  const [status, setStatus] = useState("Ready");
  const [file, setFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [label, setLabel] = useState("");
  const [volume, setVolume] = useState(70);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  const simulateProgress = () => {
    setProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 10;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => setLoading(false), 600);
      }
      setProgress(p);
    }, 200);
  };

const call = async (endpoint, label, expectBlob = false, body = null) => {
  setLoading(true);
  setLabel(label);
  simulateProgress();
  try {
    const r = await fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : null,
    });
    if (!r.ok) throw new Error("Failed");
    if (expectBlob) {
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    }
    setStatus(`✅ ${label} complete`);
  } catch {
    setStatus(`❌ ${label} error`);
  }
};

  return (
    <div className="app-root">
      <BackgroundCubes />

      <div className="card">
        <h1 className="title">
          Remix<span>AI</span>
        </h1>
        <p className="subtitle">AI-powered remix generator</p>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="file"
        />

        <div className="btnrow">
          <button className="btn btn-blue" onClick={() => call("upload", "Uploading")}>
            Upload
          </button>
          <button className="btn btn-violet" onClick={() => call("separate", "Separating", false, { filename: file?.name })}>
            Separate
          </button>
          <button className="btn btn-green" onClick={() => call("generate", "Generating")}>
            Generate
          </button>
          <button className="btn btn-amber" onClick={() => call("mix", "Mixing", true)}>
            Mix
          </button>
          <button className="btn btn-gray" onClick={() => call("download", "Downloading", true)}>
            Download
          </button>
        </div>

        {loading && <ProgressBar progress={progress} label={label} />}

        {audioUrl && <audio className="player" ref={audioRef} src={audioUrl} controls />}

        <div className="vol">
          <label>Volume</label>
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
          <span>{volume}%</span>
        </div>

        <p className="status">{status}</p>
      </div>
    </div>
  );
}
