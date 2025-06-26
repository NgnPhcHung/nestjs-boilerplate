import { UserPlayground } from "@/app/(components)/model/playgroundModel";
import { Application, Container, Sprite, Texture } from "pixi.js";

export const setupPixi = async (
  containerEl: HTMLDivElement,
  players: UserPlayground[],
) => {
  const app = new Application();
  await app.init({
    background: "#202020",
    resizeTo: containerEl,
    width: containerEl.offsetWidth,
    height: containerEl.offsetHeight,
  });
  app.canvas.style.borderRadius = "16px";
  app.canvas.style.width = `${containerEl.offsetWidth}px`;
  app.canvas.style.height = `${containerEl.offsetHeight}px`;
  app.canvas.id = "game-space";

  containerEl.appendChild(app.canvas);

  const container = new Container();
  app.stage.addChild(container);

  const sprites: Record<string, Sprite> = {};

  for (const player of players) {
    console.log("player", player);

    const img = new Image();
    img.src = player.avatarImg;
    await new Promise((r) => (img.onload = r));
    const tex = Texture.from(img);
    const sprite = new Sprite(tex);
    sprite.x = player.position.x;
    sprite.y = player.position.y;
    container.addChild(sprite);
    sprites[player.userId] = sprite;
  }

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
      if (sprites[id]) {
        console.warn(
          `Player with ID ${id} already exists. Not adding duplicate.`,
        );
        return;
      }
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
