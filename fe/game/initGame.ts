import { Application, Container, Sprite, Texture } from "pixi.js";

type Player = { x: number; y: number };

export const setupPixi = async (
  containerEl: HTMLDivElement,
  players: Record<string, Player>,
  avatars: Record<string, string>,
) => {
  const app = new Application();
  await app.init({
    background: "#202020",
    resizeTo: containerEl,
    width: 900,
    height: 640,
  });
  app.canvas.style.borderRadius = "16px"; // hoặc "1rem", "50%" nếu muốn tròn
  app.canvas.style.width = "900px";
  app.canvas.style.height = "640px";
  app.canvas.id = "game-space";

  containerEl.appendChild(app.canvas);

  const container = new Container();
  app.stage.addChild(container);

  const sprites: Record<string, Sprite> = {};

  for (const id in players) {
    const img = new Image();
    img.src = avatars[id];
    await new Promise((r) => (img.onload = r));
    const tex = Texture.from(img);
    const sprite = new Sprite(tex);
    sprite.x = players[id].x;
    sprite.y = players[id].y;
    container.addChild(sprite);
    sprites[id] = sprite;
  }

  // store for external updates if needed
  return {
    updatePlayerPosition(id: string, x: number, y: number) {
      if (sprites[id]) {
        sprites[id].x = x;
        sprites[id].y = y;
      }
    },
    removePlayer(id: string) {
      if (sprites[id]) {
        container.removeChild(sprites[id]);
        delete sprites[id];
      }
    },
    addPlayer: async (id: string, avatarUrl: string, x: number, y: number) => {
      const img = new Image();
      img.src = avatarUrl;
      await new Promise((r) => (img.onload = r));
      const tex = Texture.from(img);
      const sprite = new Sprite(tex);
      sprite.x = x;
      sprite.y = y;
      container.addChild(sprite);
      sprites[id] = sprite;
    },
  };
};
