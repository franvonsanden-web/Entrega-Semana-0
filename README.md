🎶 Remix Franken 2.0

Remix Franken 2.0 es un generador de remixes impulsado por IA que separa una canción en stems (vocales, batería, bajo, acompañamiento) y crea un nuevo acompañamiento en cualquier estilo usando Demucs y MusicGen de Meta.

🚀 Características

🎤 Extrae voces, batería, bajo y acompañamiento con Demucs

🎹 Genera un nuevo acompañamiento con MusicGen

🎧 Mezcla automáticamente la voz original con el instrumental generado

⚙️ Funciona en CPU o GPU (detecta automáticamente)

🧩 Requisitos

Python 3.10 – 3.13

Recomendado: 8 GB de RAM o más

FFmpeg instalado (verificar con ffmpeg -version)

📦 Instalación

Clonar o descomprimir el proyecto

git clone https://github.com/franvonsanden-web/Entrega-Semana-0.git
cd [carpeta]/Entrega-Semana-0


o, si recibiste un .zip, simplemente descomprímelo en cualquier lugar.

Crear un entorno virtual

py -m venv env
env\Scripts\activate


Instalar las dependencias

pip install -r requirements.txt


Asegurarse de que FFmpeg funciona

ffmpeg -version

🎛️ Uso

Colocá tu canción de entrada (por ejemplo, input_song.mp3) dentro de la carpeta del proyecto y ejecutá:

py RemixAI.py --input "input_song.mp3" --style "electronic" --duration 30 --output_dir "mi_remix"

Ejemplos de estilos

"lo-fi chillhop"

"deep house 120 bpm"

"acoustic indie"

"dark trap"

📁 Estructura de salida

Tras la ejecución, revisá la carpeta de salida (ej. mi_remix/):

drums.wav
bass.wav
other.wav
vocals.wav
accompaniment_generated.wav
final_remix.wav


✅ final_remix.wav → tu remix con IA

⚡ Consejos

Si aparece OSError: The paging file is too small, aumentá la memoria virtual de Windows.

Si tu PC es lenta, podés cambiar a un modelo más liviano editando esta línea en el script:

MUSICGEN_MODEL_NAME = "facebook/musicgen-melody"

👨‍💻 Créditos

Desarrollado por Francisco Von Sanden utilizando modelos open source de Meta (MusicGen) y Facebook Research (Demucs).

📜 Licencia

MIT License – libre de usar y modificar.
