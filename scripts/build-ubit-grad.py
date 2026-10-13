#!/usr/bin/env python3
"""Fase A: rig animable Ubit graduacion (birrete) desde Piezas 2.

Uso:
    python3 build-ubit-grad.py [SRC] [OUT]
    SRC default: /home/eddieberu/Downloads/Ubot/Assets  (usa SRC/Piezas 2)
    OUT default: <landing>/public/ubit-grad

Mapeo verificado contra renders (score diff ~3px):
    Piezas 2 1/3/4/5/6/7/9/10/11/12/13/15/16 -> 13 capas.
    Excluidas: 2 (torso alterno), 8 (rim del set de luces), 14 (wizard hat).

Variantes (mismo canvas, union incluye ala levantada):
    wave+hat  = sin wing-right + wing-up + cap + tassel  (hero landing)
    rest+hat  = sin wing-up
    rest      = sin wing-up/cap/tassel

Hace:
  1. Union-bbox alfa>0 sobre las 13 piezas + pad, crop comun, resize a 512.
  2. Export WebP q85 a layers/.
  3. Hero estatico wave+hat (poster) + verificacion vs los 3 renders.
  4. Emite ubit-grad.json + SIZES.txt.

Solo stdlib + PIL.
"""
import json
import os
import sys
from PIL import Image, ImageChops

SRC = sys.argv[1] if len(sys.argv) > 1 else "/home/eddieberu/Downloads/Ubot/Assets"
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "ubit-grad")
PIEZAS = os.path.join(SRC, "Piezas 2")
LAYERS_DIR = os.path.join(OUT, "layers")
P2 = "Untitled_Artwork-%d.png"

# back -> front (todas; variantes omiten capas segun VARIANTS)
ZORDER = [
    ("foot-left", P2 % 3, "pata izq", "none"),
    ("foot-right", P2 % 4, "pata der", "none"),
    ("wing-shadow-left", P2 % 9, "sombra ala izq", "none"),
    ("wing-shadow-right", P2 % 5, "sombra ala der", "none"),
    ("wing-left", P2 % 10, "ala izq reposo", "breathe"),
    ("wing-right", P2 % 6, "ala der reposo", "breathe"),
    ("wing-up", P2 % 7, "ala der levantada (saludo)", "wave"),
    ("torso", P2 % 1, "torso", "none"),
    ("beak", P2 % 11, "pico", "none"),
    ("eyes", P2 % 13, "ojos felices", "blink"),
    ("glasses", P2 % 12, "gafas", "none"),
    ("cap", P2 % 16, "birrete", "none"),
    ("tassel", P2 % 15, "borla", "sway"),
]
VARIANTS = {
    # id: (capas omitidas, render referencia)
    "wave-hat": ({"wing-right"}, "Ubot, Hand Up With Hat.png"),
    "rest-hat": ({"wing-up"}, "Ubot, With Hat.png"),
    "rest": ({"wing-up", "cap", "tassel"}, "Ubot, Without Hat.png"),
}
SIZE = 512
PAD = 48  # margen amplio: ala-saludo rota ±5° y necesita ~20px en canvas final
NIGHT = (0x0F, 0x11, 0x17)


def union_bbox(imgs):
    l, t, r, b = None, None, None, None
    for im in imgs:
        box = im.getchannel("A").getbbox()
        if not box:
            continue
        if l is None:
            l, t, r, b = box
        else:
            l, t, r, b = min(l, box[0]), min(t, box[1]), max(r, box[2]), max(b, box[3])
    W, H = imgs[0].size
    return (max(0, l - PAD), max(0, t - PAD), min(W, r + PAD), min(H, b + PAD))


def diff_score(a, b):
    h = ImageChops.difference(a, b).convert("L").histogram()
    return sum(c for v, c in enumerate(h) if v > 30)


def main():
    os.makedirs(LAYERS_DIR, exist_ok=True)
    loaded = {}
    for lid, fn, _d, _a in ZORDER:
        loaded[lid] = Image.open(os.path.join(PIEZAS, fn)).convert("RGBA")
    W0, H0 = next(iter(loaded.values())).size
    box = union_bbox(list(loaded.values()))
    uw, uh = box[2] - box[0], box[3] - box[1]
    scale = SIZE / max(uw, uh)
    nw, nh = round(uw * scale), round(uh * scale)
    print(f"canvas {W0}x{H0} union {box} -> {nw}x{nh} (scale {scale:.4f})")

    manifest, total = [], 0
    cropped = {}
    for lid, _fn, desc, anim in ZORDER:
        c = loaded[lid].crop(box).resize((nw, nh), Image.LANCZOS)
        cropped[lid] = c
        out = os.path.join(LAYERS_DIR, f"{lid}.webp")
        c.save(out, "WEBP", quality=85, method=6)
        sz = os.path.getsize(out)
        total += sz
        ab = c.getchannel("A").getbbox() or (0, 0, nw, nh)
        manifest.append({"id": lid, "src": f"layers/{lid}.webp", "z": len(manifest),
                         "size": [nw, nh], "bbox": list(ab), "anim": anim, "desc": desc})
        print(f"  {lid}.webp {sz // 1024}KB")
    print(f"layers total {total // 1024}KB")

    # hero = variante wave-hat a 1024 + poster + verificacion
    hero = Image.new("RGBA", (nw, nh), (0, 0, 0, 0))
    for lid, _fn, _d, _a in ZORDER:
        if lid not in VARIANTS["wave-hat"][0]:
            hero.alpha_composite(cropped[lid])
    hero_big = hero.resize((1024, round(1024 * nh / nw)), Image.LANCZOS)
    hero_big.save(os.path.join(OUT, "ubit-grad-hero.webp"), "WEBP", quality=88, method=6)
    poster = Image.new("RGB", hero_big.size, NIGHT)
    poster.paste(hero_big, mask=hero_big.getchannel("A"))
    poster.save(os.path.join(OUT, "ubit-grad-hero.png"))

    print("verificacion vs renders:")
    for vid, (omit, ref_name) in VARIANTS.items():
        comp = Image.new("RGBA", (nw, nh), (0, 0, 0, 0))
        for lid, _fn, _d, _a in ZORDER:
            if lid not in omit:
                comp.alpha_composite(cropped[lid])
        full = Image.new("RGBA", (W0, H0), (0, 0, 0, 0))
        for lid, _fn, _d, _a in ZORDER:
            if lid not in omit:
                full.alpha_composite(loaded[lid])
        ref = Image.open(os.path.join(SRC, ref_name)).convert("RGBA")
        print(f"  {vid} vs {ref_name}: diff {diff_score(full, ref)}px")
        h = 700
        r1, r2 = ref.copy(), full.copy()
        r1.thumbnail((3000, h), Image.LANCZOS)
        r2.thumbnail((3000, h), Image.LANCZOS)
        for im in (r1, r2):
            bg = Image.new("RGB", im.size, (255, 0, 255))
            bg.paste(im, mask=im.getchannel("A"))
            im.paste(bg)
        side = Image.new("RGB", (r1.width + r2.width + 16, h), (255, 255, 255))
        side.paste(r1, (0, (h - r1.height) // 2))
        side.paste(r2, (r1.width + 16, (h - r2.height) // 2))
        side.save(f"/tmp/opencode/verify-grad-{vid}.png")

    with open(os.path.join(OUT, "ubit-grad.json"), "w") as f:
        json.dump({"canvas": [nw, nh], "scaleFrom2048": scale,
                   "unionBox2048": list(box), "layers": manifest,
                   "variants": {k: sorted(o) for k, (o, _r) in VARIANTS.items()}}, f, indent=2)
    with open(os.path.join(OUT, "SIZES.txt"), "w") as f:
        f.write("layers:\n")
        for lid, _fn, _d, _a in ZORDER:
            p = os.path.join(LAYERS_DIR, f"{lid}.webp")
            f.write(f"  {lid}.webp {os.path.getsize(p) // 1024}KB\n")
        f.write(f"total layers {total // 1024}KB\n")
    print("OK ->", OUT)


if __name__ == "__main__":
    main()
