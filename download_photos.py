#!/usr/bin/env python3
"""Optionally download Ana portfolio images to ana/images/ and localize src paths.

Run on a computer with internet access: python ana/download_photos.py
The site works before running this helper, using six images on Ana's website.
Only use photos with permission from their copyright owners.
"""
from pathlib import Path
import urllib.request

HERE = Path(__file__).resolve().parent
PAGE = HERE / "index.html"
IMAGES = HERE / "images"
SOURCE = "https://makeupsalonanna.com/images/"
FILES = {
  "half-up-waves.jpg": "portfolio7.jpg",
  "bridal-glam.jpg": "portfolio3.jpg",
  "refined-updo.jpg": "portfolio8.jpg",
  "natural-radiance.jpg": "portfolio6.jpg",
  "glam-detail.jpg": "portfolio9.jpg",
  "finishing-touches.jpg": "portfolio5.jpg",
}
IMAGES.mkdir(exist_ok=True)
page = PAGE.read_text(encoding="utf-8")
successes = 0
for filename, original in FILES.items():
    remote = SOURCE + original
    destination = IMAGES / filename
    try:
        request = urllib.request.Request(remote, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(request, timeout=20) as response:
            blob = response.read()
            content_type = response.headers.get("Content-Type", "")
        if not blob.startswith(bytes.fromhex("ffd8ff")):
            raise ValueError(f"Not a JPEG (Content-Type: {content_type})")
        destination.write_bytes(blob)
        page = page.replace(remote, "images/" + filename)
        successes += 1
        print(f"Downloaded {filename} ({len(blob):,} bytes)")
    except Exception as e:
        print(f"Skipped {filename}: {e}")
PAGE.write_text(page, encoding="utf-8")
print(f"Localized {successes} image(s); images already local are unchanged.")
