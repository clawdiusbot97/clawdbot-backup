#!/home/manpac/.openclaw/venvs/whisper/bin/python
import sys
from faster_whisper import WhisperModel

def main():
    if len(sys.argv) < 2:
        print("", end="")
        return
    media_path = sys.argv[1]
    model_size = "tiny"
    model = WhisperModel(model_size, device="cpu", compute_type="int8")
    segments, _ = model.transcribe(media_path, vad_filter=True)
    text = " ".join(seg.text.strip() for seg in segments if seg.text and seg.text.strip()).strip()
    print(text)

if __name__ == "__main__":
    main()
