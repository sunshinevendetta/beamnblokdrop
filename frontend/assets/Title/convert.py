import os
from PIL import Image
import svgwrite

def png_to_svg_colored(input_png_path, output_svg_path, alpha_threshold=0):
    img = Image.open(input_png_path).convert('RGBA')
    width, height = img.size
    pixels = img.load()

    dwg = svgwrite.Drawing(output_svg_path, size=(width, height))

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a > alpha_threshold:
                hex_color = f'#{r:02x}{g:02x}{b:02x}'
                dwg.add(dwg.rect(insert=(x, y), size=(1, 1), fill=hex_color))

    # Create directory only if path is not current folder
    output_dir = os.path.dirname(output_svg_path)
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)

    dwg.save()
    print(f"✅ Colored SVG saved to: {output_svg_path}")

def batch_convert_colored():
    for file in os.listdir('.'):
        if file.lower().endswith('.png'):
            base = os.path.splitext(file)[0]
            output_svg = f"{base}.svg"
            png_to_svg_colored(file, output_svg)

if __name__ == "__main__":
    batch_convert_colored()
