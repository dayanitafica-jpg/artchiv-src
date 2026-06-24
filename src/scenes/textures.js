import * as THREE from 'three';

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const test = line + words[n] + ' ';
    if (ctx.measureText(test).width > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, y);
  return y + lineHeight;
}

// Grano sutil de papel/film, reutilizado en varias texturas para dar sensación
// de archivo físico en vez de superficie digital plana.
function addGrain(ctx, w, h, amount = 10) {
  const imgData = ctx.getImageData(0, 0, w, h);
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * amount;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n;
  }
  ctx.putImageData(imgData, 0, 0);
}

export function makeInactiveTexture() {
  const c = document.createElement('canvas');
  c.width = 220;
  c.height = 300;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#121212';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.strokeStyle = '#262626';
  ctx.lineWidth = 5;
  ctx.strokeRect(2.5, 2.5, c.width - 5, c.height - 5);
  ctx.fillStyle = '#2a2a2a';
  let y = 32;
  while (y < c.height - 22) {
    const w = 40 + Math.random() * 130;
    ctx.fillRect(20, y, w, 5);
    y += 15 + Math.random() * 8;
  }
  addGrain(ctx, c.width, c.height, 8);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

export function makeActiveTexture(doc) {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 668;
  const ctx = c.getContext('2d');

  // Fondo papel con leve gradiente para evitar look de "card" plano.
  const bgGrad = ctx.createLinearGradient(0, 0, 0, c.height);
  bgGrad.addColorStop(0, '#F6F0E5');
  bgGrad.addColorStop(1, '#EDE6D6');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, c.width, c.height);

  ctx.strokeStyle = doc.tone;
  ctx.lineWidth = 7;
  ctx.strokeRect(4, 4, c.width - 8, c.height - 8);

  ctx.font = '700 21px "Space Mono", monospace';
  const tagText = doc.category.toUpperCase();
  const tagW = ctx.measureText(tagText).width + 30;
  ctx.fillStyle = doc.tone;
  ctx.fillRect(34, 34, tagW, 36);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(tagText, 49, 58);

  ctx.fillStyle = '#181410';
  ctx.font = '700 32px "Playfair Display", serif';
  const afterTitle = wrapText(ctx, doc.title, 34, 130, 446, 38);

  ctx.strokeStyle = '#DDD5C0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(34, afterTitle + 8);
  ctx.lineTo(478, afterTitle + 8);
  ctx.stroke();

  ctx.fillStyle = '#5c5648';
  ctx.font = 'italic 400 17px "Playfair Display", serif';
  wrapText(ctx, doc.excerpt, 34, afterTitle + 42, 446, 25);

  ctx.fillStyle = doc.tone;
  ctx.font = '700 14px "Space Mono", monospace';
  ctx.fillText('VER EPISODIO →', 34, c.height - 38);

  addGrain(ctx, c.width, c.height, 4);

  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  tex.anisotropy = 8;
  return tex;
}

export function makeFloorTexture(corridorLength) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#0e0d0b';
  ctx.fillRect(0, 0, 256, 256);
  const tiles = 4;
  const ts = 256 / tiles;
  for (let ty = 0; ty < tiles; ty++) {
    for (let tx = 0; tx < tiles; tx++) {
      const shade = 13 + Math.floor(Math.random() * 9);
      ctx.fillStyle = `rgb(${shade},${shade},${shade + 1})`;
      ctx.fillRect(tx * ts + 1, ty * ts + 1, ts - 2, ts - 2);
      if (Math.random() > 0.7) {
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        ctx.fillRect(tx * ts + 4, ty * ts + 4, ts * 0.5, ts * 0.4);
      }
    }
  }
  ctx.strokeStyle = 'rgba(0,0,0,0.55)';
  ctx.lineWidth = 2;
  for (let i = 0; i <= tiles; i++) {
    ctx.beginPath();
    ctx.moveTo(i * ts, 0);
    ctx.lineTo(i * ts, 256);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * ts);
    ctx.lineTo(256, i * ts);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4.6, corridorLength * 0.95);
  return tex;
}

// Pared de estantería con lomos de libros — usada por el Archivo (tonos fríos/rojos)
// y, con otra paleta, por la Biblioteca (tonos cálidos/dorados).
export function makeShelfWallTexture(huePalette = 'archive') {
  const c = document.createElement('canvas');
  c.width = 900;
  c.height = 760;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#0b0b0a';
  ctx.fillRect(0, 0, c.width, c.height);

  const bands = 5;
  const bandHeight = c.height / bands;

  for (let b = 0; b < bands; b++) {
    const bandTop = b * bandHeight;
    let x = 0;
    while (x < c.width) {
      const w = 7 + Math.random() * 17;
      const shade = 18 + Math.random() * 58;
      const spineH = bandHeight * (0.5 + Math.random() * 0.46);
      const topY = bandTop + bandHeight - spineH - 5;

      let r = shade;
      let g = shade;
      let bl = shade;
      if (huePalette === 'library') {
        // Sesgo cálido/dorado para lomos de la Biblioteca.
        const warm = Math.random() > 0.5 ? 10 + Math.random() * 14 : 0;
        r = shade + warm;
        g = shade + warm * 0.55;
        bl = shade - warm * 0.4;
      } else {
        const warmTint = Math.random() > 0.82 ? 4 : 0;
        r = shade + warmTint;
        bl = shade - warmTint;
      }

      ctx.fillStyle = `rgb(${r},${g},${bl})`;
      ctx.fillRect(x, topY, w, spineH);
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fillRect(x, topY, 1.4, spineH);
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(x + w - 1.4, topY, 1.4, spineH);
      if (Math.random() > 0.55) {
        ctx.fillStyle = 'rgba(0,0,0,0.32)';
        const markY = topY + spineH * 0.15 + Math.random() * spineH * 0.65;
        ctx.fillRect(x + 1, markY, w - 2, 2);
      }
      x += w + 0.7;
    }
    ctx.fillStyle = '#1d1a15';
    ctx.fillRect(0, bandTop + bandHeight - 4, c.width, 4);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

export function makeGlowTexture(colorStops = ['rgba(255,232,190,1)', 'rgba(255,205,140,0.45)', 'rgba(255,205,140,0)']) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, colorStops[0]);
  g.addColorStop(0.4, colorStops[1]);
  g.addColorStop(1, colorStops[2]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

// Textura de "página de libro" para los libros flotantes de la Sala Central.
export function makeBookCoverTexture(seed = 0) {
  const palette = ['#7A2E2E', '#2E4A3F', '#3E3A6B', '#6B4A2E', '#33312B'];
  const color = palette[seed % palette.length];
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 192;
  const ctx = c.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.strokeStyle = 'rgba(255,220,170,0.55)';
  ctx.lineWidth = 3;
  ctx.strokeRect(8, 8, c.width - 16, c.height - 16);
  ctx.fillStyle = 'rgba(255,220,170,0.7)';
  ctx.fillRect(20, 30, c.width - 40, 3);
  ctx.fillRect(20, 40, c.width - 60, 3);
  addGrain(ctx, c.width, c.height, 12);
  const tex = new THREE.CanvasTexture(c);
  return tex;
}

export { wrapText, addGrain };
