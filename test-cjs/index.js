import { createCanvas, loadImage } from 'canvas';
import { writeFileSync } from 'fs';

(async () => {
  const template = await loadImage(
    'C:\\Users\\enriq\\Desktop\\waifu-lick-template.png'
  );
  const canvas = createCanvas(template.width, template.height);
  const ctx = canvas.getContext('2d');
  const image = await loadImage('C:\\Users\\enriq\\Desktop\\CamelLogov2.jpg');

  // Limpiar el canvas y dibujar la imagen original
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Guardar el estado actual del contexto antes de aplicar las rotaciones
  ctx.save();

  // Función para aplicar rotación alrededor del eje Y
  function rotateY(ctx, degrees) {
    const radians = (degrees * Math.PI) / 180;
    ctx.transform(Math.cos(radians), 0, -Math.sin(radians), 1, 0, 0);
  }

  // Función para aplicar rotación alrededor del eje X
  function rotateX(ctx, degrees) {
    const radians = (degrees * Math.PI) / 180;
    ctx.transform(1, 0, 0, Math.cos(radians), 0, -Math.sin(radians));
  }

  function rotateZ(ctx, degrees) {
    const radians = (degrees * Math.PI) / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);

    // Aplicar la transformación manualmente
    ctx.transform(cos, sin, -sin, cos, 0, 0);
  }

  // Aplicar rotaciones: rotateY(50deg) seguido de rotateX(30deg)
  rotateZ(ctx, -6);
  rotateY(ctx, -6);

  // Dibujar la imagen con las transformaciones aplicadas
  ctx.drawImage(image, -27, 277, 300, 300); // Ajusta las coordenadas según sea necesario

  // Dibujar el template con opacidad reducida
  ctx.restore();
  ctx.globalAlpha = 1;
  ctx.drawImage(template, 0, 0, template.width, template.height);

  // Restaurar el estado del contexto

  // Guardar el resultado en un archivo de imagen PNG
  writeFileSync(
    'C:\\Users\\enriq\\Desktop\\output.png',
    canvas.toBuffer('image/png')
  );
})();
