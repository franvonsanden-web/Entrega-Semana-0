import React, { useState, useRef } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function RemixAIApp() {
  const [status, setStatus] = useState("Ready");
  const [file, setFile] = useState(null);
  const [volume, setVolume] = useState(50);
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef();

  const handleUpload = async () => {
    if (!file) return alert("Select a file first!");
    const formData = new FormData();
    formData.append("file", file);
    setStatus("Uploading...");
    const res = await fetch(`${API_URL}/upload`, { method: "POST", body: formData });
    setStatus(res.ok ? "✅ File uploaded" : "❌ Upload failed");
  };

  const handleAction = async (endpoint, label) => {
    setStatus(`${label}...`);
    const res = await fetch(`${API_URL}/${endpoint}`, { method: "POST" });
    if (res.ok) {
      setStatus(`✅ ${label} complete`);
      if (endpoint === "mix") {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      }
    } else setStatus(`❌ ${label} failed`);
  };

  const handleDownload = () => {
    if (!audioUrl) return alert("Generate a remix first!");
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = "final_remix.wav";
    link.click();
  };

  const handleVolumeChange = (e) => {
    const value = e.target.value;
    setVolume(value);
    if (audioRef.current) audioRef.current.volume = value / 100;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0a0a0f] via-[#111118] to-[#090909] text-white font-sans relative overflow-hidden">
      
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,212,255,0.15),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,0,150,0.15),transparent_50%)] animate-pulse blur-3xl"></div>
      
      <div className="relative z-10 w-full max-w-lg backdrop-blur-xl bg-white/5 rounded-3xl shadow-2xl border border-white/10 p-10 text-center">
        
        <h1 className="text-4xl font-extrabold mb-2 tracking-wide bg-gradient-to-r from-sky-400 to-fuchsia-500 bg-clip-text text-transparent">
          Remix<span className="text-white">AI</span>
        </h1>
        <p className="text-gray-400 mb-8 text-sm tracking-wide">AI-powered remix generator</p>

        {/* File upload */}
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-sm text-gray-300 mb-5
            file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold
            file:bg-gradient-to-r file:from-indigo-500 file:to-blue-600 hover:file:from-indigo-600 hover:file:to-blue-700
            file:text-white transition-all"
        />

        {/* Gooey neon buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            ["Upload", () => handleUpload(), "from-blue-500 to-sky-400"],
            ["Separate", () => handleAction("separate", "Separating"), "from-fuchsia-500 to-pink-500"],
            ["Generate", () => handleAction("generate", "Generating"), "from-green-500 to-emerald-400"],
            ["Mix", () => handleAction("mix", "Mixing"), "from-yellow-400 to-orange-500"],
            ["Download", () => handleDownload(), "from-gray-600 to-gray-800"],
          ].map(([label, action, gradient]) => (
            <button
              key={label}
              onClick={action}
              className={`relative px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${gradient}
                transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Elastic slider */}
        <div className="mt-8">
          <label className="block text-gray-400 text-sm mb-2">Volume</label>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full accent-fuchsia-500 cursor-pointer"
          />
          <p className="text-sm text-gray-400 mt-1">{volume}%</p>
        </div>

        {/* Audio player */}
        {audioUrl && (
          <div className="mt-6">
            <audio ref={audioRef} controls src={audioUrl} className="w-full rounded-lg bg-black/40" />
          </div>
        )}

        {/* Status message */}
        <p className="text-sm text-sky-400 mt-6 font-mono">{status}</p>
      </div>

      {/* Subtle animated cubes */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
    </div>
  );
}
