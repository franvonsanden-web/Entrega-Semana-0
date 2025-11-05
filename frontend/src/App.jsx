import React, { useState, useCallback } from "react";

export default function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("Arrastra un archivo o haz clic para subirlo");
  const [mixReady, setMixReady] = useState(false);

  // Drag & Drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setStatus(`🎵 Archivo listo: ${droppedFile.name}`);
    }
  }, []);

  const handleDragOver = (e) => e.preventDefault();

  // Selección manual
  const handleSelect = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setStatus(`🎵 Archivo listo: ${selected.name}`);
    }
  };

  // Subida al backend Flask
  const handleUpload = async () => {
    if (!file) return;
    setStatus("⏳ Subiendo archivo...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setStatus(`✅ Archivo subido: ${data.filename}`);
      setMixReady(true);
    } catch (err) {
      console.error(err);
      setStatus("❌ Error al subir el archivo");
    }
  };

  // Mezcla
  const handleMix = async () => {
    setStatus("🎧 Mezclando...");
    try {
      const res = await fetch("http://127.0.0.1:5000/mix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name }),
      });
      const data = await res.json();
      setStatus(data.message);
    } catch (err) {
      console.error(err);
      setStatus("❌ Error al mezclar el archivo");
    }
  };

  // Descarga
  const handleDownload = async () => {
    setStatus("⬇️ Descargando...");
    try {
      const res = await fetch("http://127.0.0.1:5000/download");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "output.wav";
      a.click();
      window.URL.revokeObjectURL(url);
      setStatus("✅ Archivo descargado");
    } catch (err) {
      console.error(err);
      setStatus("❌ Error al descargar el archivo");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-950 flex items-center justify-center text-white">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10 w-[90%] max-w-lg text-center space-y-6"
      >
        <h1 className="text-3xl font-bold text-indigo-400">
          🎵 Music Generator
        </h1>

        <p className="text-gray-300 text-sm">{status}</p>

        <label
          htmlFor="file"
          className="cursor-pointer bg-indigo-600 hover:bg-indigo-500 transition text-white px-6 py-3 rounded-xl inline-block font-semibold"
        >
          {file ? "Cambiar archivo" : "Seleccionar archivo"}
          <input
            id="file"
            type="file"
            onChange={handleSelect}
            className="hidden"
          />
        </label>

        <div className="flex flex-col gap-3 mt-4">
          <button
            onClick={handleUpload}
            className="bg-blue-600 hover:bg-blue-500 transition px-6 py-2 rounded-lg"
          >
            Subir
          </button>

          {mixReady && (
            <>
              <button
                onClick={handleMix}
                className="bg-pink-600 hover:bg-pink-500 transition px-6 py-2 rounded-lg"
              >
                Mezclar
              </button>

              <button
                onClick={handleDownload}
                className="bg-green-600 hover:bg-green-500 transition px-6 py-2 rounded-lg"
              >
                Descargar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
