"""Non-browser validation of the OUKKA static design preview."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import re

ROOT = Path(__file__).resolve().parent
PAGES = ("index.html", "product.html", "record.html")


class Page(HTMLParser):
    def __init__(self, filename):
        super().__init__(convert_charrefs=True)
        self.filename = filename
        self.ids, self.links, self.assets, self.errors = set(), [], [], []
        self.h1 = 0
        self.feed((ROOT / filename).read_text())

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            if attrs["id"] in self.ids:
                self.errors.append("Duplicate ID: " + attrs["id"])
            self.ids.add(attrs["id"])
        if tag == "h1":
            self.h1 += 1
        if tag == "a":
            self.links.append(attrs.get("href", ""))
        if tag in ("img", "script", "source"):
            self.assets.append(attrs.get("src", ""))
        if tag == "video" and attrs.get("poster"):
            self.assets.append(attrs["poster"])
        if tag == "link" and attrs.get("rel") in ("stylesheet", "preload"):
            self.assets.append(attrs.get("href", ""))
        if tag == "img" and not attrs.get("alt"):
            self.errors.append("Missing meaningful image alt")


pages = {name: Page(name) for name in PAGES}
errors = []
for name, page in pages.items():
    errors.extend(name + ": " + error for error in page.errors)
    if page.h1 != 1:
        errors.append(name + ": expected one h1")
    for reference in page.assets + page.links:
        parts = urlsplit(reference)
        if parts.scheme or parts.netloc:
            continue
        target = unquote(parts.path) or name
        if not (ROOT / target).is_file():
            errors.append(name + ": missing file " + target)
        elif parts.fragment and target in pages and parts.fragment not in pages[target].ids:
            errors.append(name + ": missing anchor " + reference)
    source = (ROOT / name).read_text()
    if re.search("[—–]", source):
        errors.append(name + ": editorial dash not allowed")
    if 'name="description"' not in source or "<title>" not in source:
        errors.append(name + ": missing metadata")
for filename in ("script.js", "styles.css"):
    if not (ROOT / filename).read_text().strip():
        errors.append(filename + ": empty")
script = (ROOT / "script.js").read_text()
for asset in re.findall(r"['\"](assets/[^'\"\n]+\.(?:png|mp4|svg|webp))['\"]", script):
    variants = [asset.replace("${colour}", colour) for colour in ("white", "black")] if "${colour}" in asset else [asset]
    for variant in variants:
        if not (ROOT / variant).is_file():
            errors.append("script.js missing asset: " + variant)
if "prefers-reduced-motion" not in script or "prefers-reduced-motion" not in (ROOT / "styles.css").read_text():
    errors.append("Reduced motion support missing")
if errors:
    raise SystemExit("\n".join(errors))
print("PASS: 3 pages, unique IDs, one H1 each, links, anchors, static media, alt text, metadata, reduced motion.")
