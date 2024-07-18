import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas';

async function WaifuLick(imageurl: string) {
  const template = await loadImage('./static/waifu-lick-template.png');
  const canvas = createCanvas(template.width, template.height);
  const ctx = canvas.getContext('2d');
  const image = await loadImage(imageurl);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();

  function rotateY(ctx: CanvasRenderingContext2D, degrees: number) {
    const radians = (degrees * Math.PI) / 180;
    ctx.transform(Math.cos(radians), 0, -Math.sin(radians), 1, 0, 0);
  }

  function rotateX(ctx: CanvasRenderingContext2D, degrees: number) {
    const radians = (degrees * Math.PI) / 180;
    ctx.transform(1, 0, 0, Math.cos(radians), 0, -Math.sin(radians));
  }

  function rotateZ(ctx: CanvasRenderingContext2D, degrees: number) {
    const radians = (degrees * Math.PI) / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);

    ctx.transform(cos, sin, -sin, cos, 0, 0);
  }

  rotateZ(ctx, -6);
  rotateY(ctx, -6);

  ctx.drawImage(image, -27, 277, 320, 320);

  ctx.restore();
  ctx.globalAlpha = 1;
  ctx.drawImage(template, 0, 0, template.width, template.height);

  return canvas.toBuffer('image/png');
}
export { WaifuLick };
