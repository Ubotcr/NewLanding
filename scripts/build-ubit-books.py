"""Build the promotional source from the supplied illustration. Requires Pillow."""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/mascots/ubit-books-original.png"
OUTPUT = ROOT / "src/assets/ubit-books.webp"

with Image.open(SOURCE) as original:
    image = original.convert("RGBA")
    image = image.crop(image.getchannel("A").getbbox())
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    image.save(OUTPUT, "WEBP", quality=90, method=6, exact=True)
    print(f"{OUTPUT.relative_to(ROOT)}: {image.width}x{image.height}, {OUTPUT.stat().st_size} bytes")
