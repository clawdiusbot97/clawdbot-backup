#!/usr/bin/env python3
"""
Generate Excalidraw JSON for the formalization process diagram.
"""

import json
import uuid

def create_excalidraw_json():
    elements = []
    
    def add_text(x, y, text, font_size=12, stroke="#333", width=100):
        elem_id = f"text-{uuid.uuid4().hex[:8]}"
        elements.append({
            "id": elem_id,
            "type": "text",
            "x": x, "y": y, "width": width, "height": font_size + 4,
            "strokeColor": stroke,
            "backgroundColor": "transparent",
            "fillStyle": "solid",
            "strokeWidth": 1,
            "roughness": 1,
            "text": text,
            "fontSize": font_size,
            "fontFamily": 1,
            "textAlign": "center",
            "verticalAlign": "middle",
            "seed": len(elements) * 100,
            "version": 1,
            "versionNonce": len(elements) * 100,
            "isDeleted": False,
            "groupIds": [],
            "frameId": None,
            "roundness": None,
            "boundElements": [],
            "updated": 1,
            "link": None,
            "locked": False
        })
        return elem_id
    
    def add_rect(x, y, w, h, stroke="#333", bg="#fff", sw=2):
        elem_id = f"rect-{uuid.uuid4().hex[:8]}"
        elements.append({
            "id": elem_id,
            "type": "rectangle",
            "x": x, "y": y, "width": w, "height": h,
            "strokeColor": stroke,
            "backgroundColor": bg,
            "fillStyle": "solid",
            "strokeWidth": sw,
            "roughness": 1,
            "seed": len(elements) * 100,
            "version": 1,
            "versionNonce": len(elements) * 100,
            "isDeleted": False,
            "groupIds": [],
            "frameId": None,
            "roundness": None,
            "boundElements": [],
            "updated": 1,
            "link": None,
            "locked": False
        })
        return elem_id
    
    def add_ellipse(x, y, w, h, stroke="#333", bg="#fff", sw=2):
        elem_id = f"ellipse-{uuid.uuid4().hex[:8]}"
        elements.append({
            "id": elem_id,
            "type": "ellipse",
            "x": x, "y": y, "width": w, "height": h,
            "strokeColor": stroke,
            "backgroundColor": bg,
            "fillStyle": "solid",
            "strokeWidth": sw,
            "roughness": 1,
            "seed": len(elements) * 100,
            "version": 1,
            "versionNonce": len(elements) * 100,
            "isDeleted": False,
            "groupIds": [],
            "frameId": None,
            "roundness": None,
            "boundElements": [],
            "updated": 1,
            "link": None,
            "locked": False
        })
        return elem_id
    
    def add_diamond(x, y, w, h, stroke="#333", bg="#fff"):
        elem_id = f"diamond-{uuid.uuid4().hex[:8]}"
        elements.append({
            "id": elem_id,
            "type": "diamond",
            "x": x, "y": y, "width": w, "height": h,
            "strokeColor": stroke,
            "backgroundColor": bg,
            "fillStyle": "solid",
            "strokeWidth": 2,
            "roughness": 1,
            "seed": len(elements) * 100,
            "version": 1,
            "versionNonce": len(elements) * 100,
            "isDeleted": False,
            "groupIds": [],
            "frameId": None,
            "roundness": None,
            "boundElements": [],
            "updated": 1,
            "link": None,
            "locked": False
        })
        return elem_id
    
    def add_arrow(x1, y1, x2, y2):
        elem_id = f"arrow-{uuid.uuid4().hex[:8]}"
        elements.append({
            "id": elem_id,
            "type": "arrow",
            "x": x1, "y": y1,
            "width": max(1, x2 - x1),
            "height": max(1, y2 - y1),
            "strokeColor": "#333",
            "strokeWidth": 2,
            "roughness": 1,
            "points": [[0, 0], [x2 - x1, y2 - y1]],
            "seed": len(elements) * 100,
            "version": 1,
            "versionNonce": len(elements) * 100,
            "isDeleted": False,
            "groupIds": [],
            "frameId": None,
            "roundness": None,
            "boundElements": [],
            "updated": 1,
            "link": None,
            "locked": False,
            "fillStyle": "solid"
        })
        return elem_id
    
    # Swimlane headers
    add_rect(50, 20, 900, 35, "#333", "#e8f4f8")
    add_text(470, 28, "CLIENTE", 16, "#333", 60)
    
    add_rect(50, 280, 900, 35, "#333", "#fff3cd")
    add_text(470, 288, "BROKER", 16, "#333", 60)
    
    add_rect(50, 480, 900, 35, "#333", "#d4edda")
    add_text(430, 488, "BROKIA SYSTEM", 16, "#333", 140)
    
    add_rect(50, 720, 450, 35, "#333", "#e8f5e9")
    add_text(200, 728, "WHATSAPP API", 14, "#333", 100)
    
    add_rect(500, 720, 450, 35, "#333", "#e1f5fe")
    add_text(650, 728, "DATABASE", 14, "#333", 100)
    
    # === CLIENTE ===
    add_rect(80, 70, 120, 45, "#333", "#fff")
    add_text(110, 82, "Quote\nGenerada", 10, "#333", 60)
    
    add_rect(240, 70, 120, 45, "#333", "#fff")
    add_text(275, 82, "Recibe\nPropuesta WA", 10, "#333", 50)
    
    add_rect(400, 70, 120, 45, "#333", "#fff")
    add_text(435, 82, "Revisa\nPropuesta", 10, "#333", 50)
    
    add_diamond(570, 65, 90, 55, "#c62828", "#ffebee")
    add_text(590, 80, "Respuesta?", 9, "#c62828", 50)
    
    add_ellipse(720, 70, 95, 45, "#28a745", "#d4edda")
    add_text(745, 82, "ACEPTO\nSEGURO", 9, "#28a745", 50)
    
    add_ellipse(720, 140, 95, 45, "#dc3545", "#ffcccc")
    add_text(750, 155, "RECHAZO", 10, "#dc3545", 35)
    
    add_ellipse(720, 210, 95, 45, "#ffc107", "#fff3cd")
    add_text(745, 222, "PREGUNTA", 10, "#b8860b", 40)
    
    # Arrows - Client
    add_arrow(145, 92, 240, 92)
    add_arrow(295, 92, 400, 92)
    add_arrow(455, 92, 570, 92)
    add_arrow(615, 92, 720, 92)
    add_arrow(680, 115, 680, 140)  # to reject
    add_arrow(680, 115, 680, 210)  # to question
    
    # === BROKER ===
    add_rect(280, 310, 120, 45, "#ffc107", "#fff3cd", 2)
    add_text(315, 322, "Monitorea\nPendientes", 10, "#b8860b", 50)
    
    add_rect(440, 310, 120, 45, "#dc3545", "#ffcccc", 3)
    add_text(475, 322, "Interviene\nManual", 10, "#dc3545", 50)
    
    # Arrow broker
    add_arrow(335, 332, 440, 332)
    
    # Arrow from reject/question to broker
    add_arrow(767, 162, 767, 200)
    add_arrow(680, 255, 280, 255)  # from reject to broker
    add_arrow(767, 232, 767, 280)
    add_arrow(680, 280, 340, 280)  # from question to broker
    
    # === BROKIA SYSTEM ===
    # Step 1: Generate
    add_rect(80, 530, 130, 45, "#28a745", "#d4edda")
    add_text(120, 545, "1. Generar\nPropuesta", 10, "#28a745", 50)
    
    # Step 2: Prepare WA
    add_rect(240, 530, 130, 45, "#28a745", "#d4edda")
    add_text(280, 545, "2. Preparar\nMensaje WA", 10, "#28a745", 50)
    
    # Step 3: Send
    add_rect(400, 530, 130, 45, "#28a745", "#d4edda")
    add_text(440, 545, "3. Enviar\nWA API", 10, "#28a745", 50)
    
    # Step 4: Monitor response
    add_rect(560, 530, 130, 45, "#333", "#fff")
    add_text(595, 545, "4. Monitorear\nRespuesta", 10, "#333", 60)
    
    # Decision: Process response
    add_diamond(730, 525, 90, 55, "#c62828", "#ffebee")
    add_text(750, 540, "Procesar?", 9, "#c62828", 50)
    
    # Arrows system
    add_arrow(145, 552, 240, 552)
    add_arrow(305, 552, 400, 552)
    add_arrow(465, 552, 560, 552)
    add_arrow(625, 552, 730, 552)
    
    # === Value-add: Snapshot creation (highlighted) ===
    add_rect(820, 530, 130, 45, "#f5a623", "#fffaa0", 3)
    add_text(860, 545, "5. Crear\nSNAPSHOT", 10, "#f5a623", 50)
    
    add_arrow(775, 552, 820, 552)
    
    # === WHATSAPP API ===
    add_rect(80, 770, 130, 40, "#2e7d32", "#e8f5e9")
    add_text(120, 780, "Entregar\nMensaje", 10, "#2e7d32", 50)
    
    add_rect(240, 770, 130, 40, "#2e7d32", "#e8f5e9")
    add_text(280, 780, "Recibir\nRespuesta", 10, "#2e7d32", 50)
    
    # Arrow WA
    add_arrow(145, 790, 240, 790)
    
    # Arrow from send to WA deliver
    add_arrow(465, 552, 465, 770)
    # Arrow from WA receive to monitor
    add_arrow(305, 790, 560, 790)
    add_arrow(560, 575, 560, 600)
    add_arrow(560, 600, 560, 770)
    
    # === DATABASE ===
    # Save snapshot
    add_rect(520, 770, 130, 40, "#0277bd", "#e1f5fe", 2)
    add_text(555, 780, "Guardar\nSnapshot", 10, "#0277bd", 60)
    
    # Immutable record
    add_rect(680, 770, 130, 40, "#0277bd", "#e1f5fe", 2)
    add_text(715, 780, "Registro\nInmutable", 10, "#0277bd", 60)
    
    # Renewal comparison (value add)
    add_rect(840, 770, 110, 40, "#f5a623", "#fffaa0", 3)
    add_text(875, 778, "Renewal\nComparison", 9, "#f5a623", 40)
    
    # Arrow from snapshot to DB save
    add_arrow(885, 575, 885, 600)
    add_arrow(885, 600, 885, 650)
    add_arrow(885, 650, 885, 770)
    add_arrow(950, 552, 950, 600)
    add_arrow(950, 600, 520, 600)
    add_arrow(520, 790, 680, 790)
    add_arrow(745, 790, 840, 790)
    
    # Label for renewal
    add_text(800, 730, "RENEWAL", 12, "#f5a623", 60)
    add_arrow(840, 735, 840, 770)
    
    data = {
        "type": "excalidraw",
        "version": 2,
        "source": "https://excalidraw.com",
        "elements": elements
    }
    return data

if __name__ == "__main__":
    data = create_excalidraw_json()
    output_path = "/home/manpac/.openclaw/workspace/brokia/diagramas/formalizacion-proceso-propuesto.excalidraw.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print(f"Excalidraw JSON saved to: {output_path}")
