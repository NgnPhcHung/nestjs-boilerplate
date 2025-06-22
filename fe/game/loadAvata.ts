import multiavatar from "@multiavatar/multiavatar";

async function svgToPng(svg: string): Promise<HTMLImageElement> {
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  const svgImg = new Image();
  svgImg.src = url;
  await new Promise((r) => (svgImg.onload = r));

  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(svgImg, 0, 0, 64, 64);

  const pngImg = new Image();
  pngImg.src = canvas.toDataURL("image/png");
  await new Promise((r) => (pngImg.onload = r));

  return pngImg;
}

export async function randomUserAva(): Promise<HTMLImageElement> {
  const seed = Math.random().toString(36).substring(2, 10);
  const svg = multiavatar(seed, true);
  return await svgToPng(svg);
}
