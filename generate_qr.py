from reportlab.graphics import renderSVG
from reportlab.graphics.barcode import qr
from reportlab.graphics.shapes import Drawing


widget = qr.QrCodeWidget("https://oukka.example/phase-0/ou4232")
bounds = widget.getBounds()
width = bounds[2] - bounds[0]
height = bounds[3] - bounds[1]
size = 720
drawing = Drawing(size, size, transform=[size / width, 0, 0, size / height, 0, 0])
drawing.add(widget)
renderSVG.drawToFile(drawing, "assets/ou4232-phase0-qr.svg")
