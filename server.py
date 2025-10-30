from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import FileResponse
import uvicorn
import os
from RemixAI import separate_stems, generate_accompaniment, mix_tracks, ensure_dir

app = FastAPI(title="Remix Franken 2.0 API")

@app.post("/remix")
async def remix_song(file: UploadFile, style: str = Form("electronic")):
    input_path = f"uploads/{file.filename}"
    ensure_dir("uploads")
    
    with open(input_path, "wb") as f:
        f.write(await file.read())

    output_dir = "output_remix"
    ensure_dir(output_dir)
    stems = separate_stems(input_path, output_dir)
    vocal_path = stems["vocals"]
    accomp_path = os.path.join(output_dir, "accompaniment_generated.wav")
    final_mix = os.path.join(output_dir, "final_remix.wav")

    generate_accompaniment(style, accomp_path)
    mix_tracks(vocal_path, accomp_path, final_mix)

    return FileResponse(final_mix, media_type="audio/wav", filename="final_remix.wav")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
