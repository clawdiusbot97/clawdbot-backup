#!/usr/bin/env python3
"""
Valida que un Google Sheet de procesos Brokia esté correctamente creado en español.
"""

import subprocess
import sys
import json
import re

def run_gog(command):
    """Ejecuta comando gog y devuelve salida como texto."""
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    return result.stdout.strip(), result.stderr.strip(), result.returncode

def main():
    if len(sys.argv) != 2:
        print("Uso: python validar_sheet_procesos.py <sheet_id>")
        print("Ejemplo: python validar_sheet_procesos.py 1dK6DFYY_IQxi2fG31Ed6ARcYSrSJFb8GUu-dcTZgAic")
        sys.exit(1)
    
    sheet_id = sys.argv[1]
    account = "tachipachi9797@gmail.com"
    
    print(f"🔍 Validando sheet {sheet_id}...")
    
    # 1. Obtener encabezados
    cmd = f'gog sheets get {sheet_id} "A1:M1" --account {account} --plain'
    headers_out, headers_err, rc = run_gog(cmd)
    if rc != 0:
        print(f"❌ Error obteniendo encabezados: {headers_err}")
        sys.exit(1)
    
    headers = headers_out.split('\t')
    print(f"   Encabezados encontrados: {len(headers)} columnas")
    
    # 2. Verificar encabezados en español
    spanish_headers = [
        "ID Proceso",
        "Nombre/Descripción",
        "Categoría",
        "Duración Estimada (min)",
        "Frecuencia",
        "Importancia (1-10)",
        "Pain Points (qué lo hace lento/erróneo)",
        "Potencial de Automatización",
        "Dependencias",
        "Riesgo de Automatización",
        "Tiempo Estimado Ahorrado (min)",
        "Prioridad Rank",
        "Estado"
    ]
    
    errors = []
    for i, (expected, actual) in enumerate(zip(spanish_headers, headers)):
        if expected != actual:
            errors.append(f"Columna {i+1}: esperado '{expected}', encontrado '{actual}'")
    
    if errors:
        print("❌ Errores en encabezados:")
        for err in errors:
            print(f"   - {err}")
        # No salir, solo advertir
    else:
        print("✅ Encabezados en español correctos")
    
    # 3. Contar filas de datos
    cmd = f'gog sheets get {sheet_id} "A2:A20" --account {account} --plain'
    data_out, data_err, rc = run_gog(cmd)
    if rc == 0:
        rows = [r for r in data_out.split('\n') if r.strip()]
        print(f"✅ Filas de datos: {len(rows)}")
        if len(rows) < 5:
            print("⚠️  Pocas filas de datos (menos de 5)")
    else:
        print("⚠️  No se pudieron contar filas de datos")
    
    # 4. Verificar datos completos (primeras 3 filas)
    cmd = f'gog sheets get {sheet_id} "A2:M4" --account {account} --plain'
    sample_out, sample_err, rc = run_gog(cmd)
    if rc == 0:
        lines = sample_out.split('\n')
        for i, line in enumerate(lines[:3], start=2):
            cells = line.split('\t')
            if len(cells) < 13:
                print(f"⚠️  Fila {i} incompleta ({len(cells)} columnas en lugar de 13)")
            else:
                # Verificar que ID Proceso sea numérico
                if not cells[0].isdigit():
                    print(f"⚠️  Fila {i}: ID Proceso no numérico: {cells[0]}")
    else:
        print("⚠️  No se pudo verificar datos de muestra")
    
    # 5. Verificar fórmula en columna L (Prioridad Rank)
    cmd = f'gog sheets get {sheet_id} "L2:L5" --account {account} --plain'
    formula_out, formula_err, rc = run_gog(cmd)
    if rc == 0:
        cells = formula_out.split('\n')
        empty = sum(1 for c in cells if c.strip() == '')
        if empty == len(cells):
            print("⚠️  Columna 'Prioridad Rank' vacía (fórmula no aplicada)")
        else:
            # Verificar si contiene fórmula
            if any('=' in c for c in cells):
                print("✅ Fórmula detectada en columna Prioridad Rank")
            else:
                print("⚠️  Columna Prioridad Rank tiene valores pero no fórmula")
    else:
        print("⚠️  No se pudo verificar columna Prioridad Rank")
    
    # 6. Resumen
    print("\n📋 RESUMEN DE VALIDACIÓN")
    print("=" * 40)
    print(f"Sheet ID: {sheet_id}")
    print(f"URL: https://docs.google.com/spreadsheets/d/{sheet_id}/edit")
    
    if errors:
        print("Estado: ⚠️  REQUIERE CORRECCIONES")
        print("Problemas encontrados:")
        for err in errors:
            print(f"  • {err}")
    else:
        print("Estado: ✅ APROBADO (estructura básica correcta)")
    
    print("\n🎯 Acciones recomendadas:")
    print("  1. Aplicar formato manual (colores, dropdowns) usando Apps Script")
    print("  2. Verificar fórmula de prioridad en columna L")
    print("  3. Revisar que las validaciones de datos funcionen")
    
    # Salir con código de error si hay errores graves
    if errors and any('esperado' in e for e in errors):
        sys.exit(1)
    else:
        sys.exit(0)

if __name__ == "__main__":
    main()