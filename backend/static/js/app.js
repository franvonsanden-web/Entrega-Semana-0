const status = document.getElementById("status");
let currentFile = "";

// === Upload ===
document.getElementById("uploadForm").onsubmit = async e => {
  e.preventDefault();
  const file = document.getElementById("file").files[0];
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/upload", { method: "POST", body: formData });
  const data = await res.json();
  currentFile = data.filename;
  status.innerText = "Archivo subido: " + currentFile;
};

// === Generic helper for /separate and /mix ===
async function call(endpoint) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: currentFile })
  });
  const data = await res.json();
  status.innerText = data.message;

  // If we got file links, show them
  if (data.files) {
    const list = document.createElement("ul");
    data.files.forEach(link => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = link;
      a.textContent = "Download " + link.split("/").pop();
      a.download = "";
      li.appendChild(a);
      list.appendChild(li);
    });
    status.appendChild(list);
  }
}

// === Separate ===
document.getElementById("btnSeparate").onclick = () => call("/separate");

// === Generate (new) ===
document.getElementById("btnGenerate").onclick = async () => {
  const stylePrompt = document.getElementById("stylePrompt").value || "lofi hip hop remix";
  const res = await fetch("/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: currentFile, style_prompt: stylePrompt })
  });
  const data = await res.json();
  status.innerText = data.message;

  if (data.files) {
    const list = document.createElement("ul");
    data.files.forEach(link => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = link;
      a.textContent = "Download " + link.split("/").pop();
      a.download = "";
      li.appendChild(a);
      list.appendChild(li);
    });
    status.appendChild(list);
  }
};

// === Mix ===
document.getElementById("btnMix").onclick = async () => {
  await call("/mix");
  document.getElementById("player").src = "/download/final_remix.wav";
};
