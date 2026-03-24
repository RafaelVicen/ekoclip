#!/usr/bin/env python3
"""Cria arquivos placeholder para o template de download."""
import os
import shutil

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(BASE, "assets")
IMG_DIR = os.path.join(ASSETS, "images")
AUDIO_DIR = os.path.join(ASSETS, "audio")

def main():
    os.makedirs(IMG_DIR, exist_ok=True)
    os.makedirs(AUDIO_DIR, exist_ok=True)
    
    # Renomear capa-ultimo-poeta..png -> capa-ultimo-poeta.png
    old_img = os.path.join(IMG_DIR, "capa-ultimo-poeta..png")
    new_img = os.path.join(IMG_DIR, "capa-ultimo-poeta.png")
    if os.path.exists(old_img) and not os.path.exists(new_img):
        shutil.copy(old_img, new_img)
        print(f"Criado: {new_img} (cópia de capa-ultimo-poeta..png)")
    
    # placeholder-capa.jpg: copia capa1.jpg se existir
    capa_src = os.path.join(IMG_DIR, "capa1.jpg")
    capa_dst = os.path.join(IMG_DIR, "placeholder-capa.jpg")
    if os.path.exists(capa_src):
        shutil.copy(capa_src, capa_dst)
        print(f"Criado: {capa_dst} (cópia de capa1.jpg)")
    else:
        print(f"Aviso: {capa_src} não encontrado. Crie manualmente placeholder-capa.jpg")
    
    # placeholder-musica.mp3: copia primeiro mp3 disponível
    audio_src = None
    for f in os.listdir(AUDIO_DIR) if os.path.exists(AUDIO_DIR) else []:
        if f.endswith(".mp3"):
            audio_src = os.path.join(AUDIO_DIR, f)
            break
    audio_dst = os.path.join(AUDIO_DIR, "placeholder-musica.mp3")
    if audio_src:
        shutil.copy(audio_src, audio_dst)
        print(f"Criado: {audio_dst} (cópia de {os.path.basename(audio_src)})")
    else:
        print(f"Aviso: Nenhum .mp3 em {AUDIO_DIR}. Crie manualmente placeholder-musica.mp3")

if __name__ == "__main__":
    main()
