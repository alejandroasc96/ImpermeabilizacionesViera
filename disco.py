import os
import sys

def formatear_tamano(bytes_size):
    """Convierte bytes en un formato legible (KB, MB, GB)."""
    for unidad in ['Bytes', 'KB', 'MB', 'GB', 'TB']:
        if bytes_size < 1024:
            return f"{bytes_size:.2f} {unidad}"
        bytes_size /= 1024

def escanear_unidad(ruta_unidad, top_n=10):
    print(f"\n[+] Escaneando {ruta_unidad}... Esto puede tardar un poco dependiendo del disco.")
    
    archivos_grandes = []
    carpetas_pesadas = {}
    
    # Carpetas del sistema que saltaremos activamente
    carpetas_sistema = {
        'windows', 'system volume information', '$recycle.bin', 
        'recovery', '$winreagent', 'programdata\\microsoft'
    }
    
    for raiz, directorios, archivos in os.walk(ruta_unidad):
        # Modificar 'directorios' en el lugar (in-place) permite a os.walk saltarse estas carpetas por completo
        directorios[:] = [d for d in directorios if d.lower() not in carpetas_sistema]
        
        # Filtro extra por si la ruta completa contiene alguna palabra prohibida
        if any(sp in raiz.lower() for sp in carpetas_sistema):
            continue
            
        for archivo in archivos:
            ruta_completa = os.path.join(raiz, archivo)
            try:
                # Ignoramos enlaces simbólicos para no duplicar tamaños
                if not os.path.islink(ruta_completa):
                    tamano = os.path.getsize(ruta_completa)
                    archivos_grandes.append((ruta_completa, tamano))
                    
                    # Agrupamos por "carpetas principales" (hasta nivel 3) para identificar programas/juegos
                    partes = raiz.split(os.sep)
                    if len(partes) > 1:
                        nivel_corte = 3 if len(partes) > 2 else len(partes)
                        carpeta_clave = os.sep.join(partes[:nivel_corte])
                        carpetas_pesadas[carpeta_clave] = carpetas_pesadas.get(carpeta_clave, 0) + tamano
                        
            except (PermissionError, FileNotFoundError):
                # Si Windows no nos deja leerlo, probablemente es del sistema o está bloqueado. ¡Siguiente!
                continue

    # Ordenar los resultados de mayor a menor
    archivos_grandes.sort(key=lambda x: x[1], reverse=True)
    carpetas_ordenadas = sorted(carpetas_pesadas.items(), key=lambda x: x[1], reverse=True)
    
    return archivos_grandes[:top_n], carpetas_ordenadas[:top_n]

if __name__ == "__main__":
    # Pedir unidad al usuario
    unidad = input("Introduce la unidad a escanear (ej. C:\\ o D:\\): ").strip()
    
    # Asegurar que termina en barra invertida si es una unidad raíz
    if len(unidad) == 2 and unidad.endswith(':'):
        unidad += '\\'
        
    if not os.path.exists(unidad):
        print(f"[-] La unidad o ruta '{unidad}' no existe.")
        sys.exit(1)
        
    top_archivos, top_carpetas = escanear_unidad(unidad)
    
    # --- MOSTRAR RESULTADOS ---
    print("\n" + "="*60)
    print(f" TOP 10 CARPETAS/PROGRAMAS MÁS PESADOS EN {unidad}")
    print("="*60)
    for ruta, tamano in top_carpetas:
        print(f"- [{formatear_tamano(tamano)}] -> {ruta}")
        
    print("\n" + "="*60)
    print(f" TOP 10 ARCHIVOS SUELTOS MÁS PESADOS EN {unidad}")
    print("="*60)
    for ruta, tamano in top_archivos:
        print(f"- [{formatear_tamano(tamano)}] -> {ruta}")