import overlayImg from "./assets/overlay.webp";
// WIP
const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

export async function mergeImages(src1) {
  const [img1, img2] = await Promise.all([
    loadImage(src1),
    loadImage(overlayImg),
  ]);

  // match canvas to overlay img size
  const canvas = document.createElement("canvas");
  canvas.width = img2.width;
  canvas.height = img2.height;

  const ctx = canvas.getContext("2d");

  //user img photo full size
  ctx.drawImage(img1, 0, 0, canvas.width, canvas.height);

  // blend overlay on top
  ctx.globalCompositeOperation = "multiply"; // blend
  ctx.drawImage(img2, 0, 0, canvas.width, canvas.height);

 return canvas.toDataURL("image/webp", 0.9); // 0.9 = 90% quality
 
}