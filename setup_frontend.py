import os, textwrap

# === 1. Crear estructura ===
os.makedirs("templates", exist_ok=True)
os.makedirs("static/js", exist_ok=True)
os.makedirs("uploads", exist_ok=True)

# === 2. Crear app.py ===
app_py = textwrap.dedent("""\
from flask import Flask, render_template, request, send_from_directory, jsonify
import os
import RemixAI

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    filename = file.filename
    path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(path)
    return jsonify({"filename": filename})

@app.route('/separate', methods=['POST'])
def separate():
    filename = request.json['filename']
    RemixAI.separate_stems(filename)
    return jsonify({"status": "ok", "message": "Stems separados"})

@app.route('/generate', methods=['POST'])
def generate():
    RemixAI.generate_music()
    return jsonify({"status": "ok", "message": "Acompañamiento generado"})

@app.route('/mix', methods=['POST'])
def mix():
    RemixAI.mix_tracks()
    return jsonify({"status": "ok", "message": "Remix final listo"})

@app.route('/download/<path:filename>')
def download(filename):
    return send_from_directory('outputs', filename, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
""")
open("app.py", "w", encoding="utf-8").write(app_py)

# === 3. Crear index.html ===
html = textwrap.dedent("""\
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>RemixAI Frontend</title>
</head>
<body>
  <h1>RemixAI</h1>
  <form id="uploadForm">
    <input type="file" id="file" accept="audio/*" />
    <button type="submit">Subir Audio</button>
  </form>

  <button id="btnSeparate">Separar Stems</button>
  <button id="btnGenerate">Generar Acompañamiento</button>
  <button id="btnMix">Mezclar y Descargar</button>

  <div id="status"></div>
  <audio id="player" controls></audio>

  <script src="/static/js/app.js"></script>
</body>
</html>
""")
open("templates/index.html", "w", encoding="utf-8").write(html)

# === 4. Crear app.js ===
js = textwrap.dedent("""\
const status = document.getElementById("status");
let currentFile = "";

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

async function call(endpoint) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: currentFile })
  });
  const data = await res.json();
  status.innerText = data.message;
}

document.getElementById("btnSeparate").onclick = () => call("/separate");
document.getElementById("btnGenerate").onclick = () => call("/generate");
document.getElementById("btnMix").onclick = async () => {
  await call("/mix");
  document.getElementById("player").src = "/download/final_remix.wav";
};
""")
open("static/js/app.js", "w", encoding="utf-8").write(js)

print("✅ Frontend creado. Ejecutá: pip install flask && python app.py")
