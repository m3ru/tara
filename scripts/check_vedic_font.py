"""Check the bundled font against the Sanskrit characters actually stored in the app.

Development dependency: fonttools[woff]. No Python package is needed to run the site.
Run with: python scripts/check_vedic_font.py
"""
import hashlib
import re
from pathlib import Path

from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parent.parent
font_path = root / "public/fonts/shobhika-regular.woff2"
font = TTFont(font_path)
source = (root / "src/passages.ts").read_text(encoding="utf-8")
characters = set(re.findall(r"[\u0900-\u097f\u1cd0-\u1cff\ua8e0-\ua8ff]", source))
cmap = font.getBestCmap()
missing = [f"U+{ord(char):04X}" for char in sorted(characters) if ord(char) not in cmap]
assert not missing, f"Missing Sanskrit glyphs: {missing}"
assert all(table in font for table in ("GSUB", "GPOS", "GDEF")), "Missing shaping tables"
print(f"{len(characters)} Sanskrit code points covered; GSUB, GPOS, GDEF retained.")
print(f"WOFF2 SHA-256: {hashlib.sha256(font_path.read_bytes()).hexdigest()}")
