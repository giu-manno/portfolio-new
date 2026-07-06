// Pixel-art sprite generation for the hero sky panel.
// Sprites are drawn to <canvas> at runtime and returned as data URLs —
// next/image cannot consume data URLs, so consumers render them as
// CSS background-image on divs with image-rendering: pixelated.
// Client-only: requires document.

export type Period = "dawn" | "day" | "sunset" | "night";

export const PALETTES: Record<
  Period,
  {
    sky: string; skyText: string;
    cloudW: string; cloudS: string;
    sunX: string; sunH: string; sunR: string;
    grassL: string; grassM: string; grassD: string;
    sparkle: string; tile: string; bird: string;
  }
> = {
  dawn:   { sky: "#c3a8d8", skyText: "#ffffff", cloudW: "#fdf6e6", cloudS: "#e0c7e6", sunX: "#ffd9a0", sunH: "#ffedd0", sunR: "#f2a65a", grassL: "#6fae57", grassM: "#3f8449", grassD: "#27573a", sparkle: "#f6e3b2", tile: "#d8c6ea", bird: "#4a3f55" },
  day:    { sky: "#8faae9", skyText: "#ffffff", cloudW: "#fffdf4", cloudS: "#cfe3f7", sunX: "#ffe259", sunH: "#fff3ae", sunR: "#f5b93d", grassL: "#86c85a", grassM: "#479c52", grassD: "#2c6b43", sparkle: "#f2dfae", tile: "#8faae9", bird: "#2b3355" },
  sunset: { sky: "#e5a184", skyText: "#ffffff", cloudW: "#fdf2dc", cloudS: "#eec0a8", sunX: "#ff9d5c", sunH: "#ffc98f", sunR: "#e8763a", grassL: "#6fa04f", grassM: "#3d7a44", grassD: "#265237", sparkle: "#fae6b4", tile: "#eec0ab", bird: "#5a3a2e" },
  night:  { sky: "#2b3260", skyText: "#eef0ff", cloudW: "#565f9e", cloudS: "#414876", sunX: "#f0eddc", sunH: "#fffef2", sunR: "#c9c4a8", grassL: "#2f5c38", grassM: "#1d4227", grassD: "#122b1a", sparkle: "#ece4bc", tile: "#9aa3d6", bird: "#c9cdf0" },
};

const BIRD_FRAMES = [
  [
    "X.....X",
    ".X...X.",
    "..X.X..",
    "...X...",
  ],
  [
    "...X...",
    "..X.X..",
    ".X...X.",
    "X.....X",
  ],
];

const CLOUD_GRIDS = {
  a: [
    ".......WWWW.............",
    ".....WWWWWWWW...WWW.....",
    "....WWWWWWWWWW.WWWWW....",
    "..WWWWWWWWWWWWWWWWWWW...",
    ".WWWWWWWWWWWWWWWWWWWWW..",
    "WWWWWWWWWWWWWWWWWWWWWWW.",
    "WWWSSWWWWWWWWWWWWWWWWWWW",
    "WSSSSSSWWWWWWWSSWWWWWWWW",
    ".SSSSSSSSSSSSSSSSSSSSSS.",
    "...SSSS..SSSSSSSSSS.....",
  ],
  b: [
    "....WWWWW.....",
    "..WWWWWWWWW...",
    ".WWWWWWWWWWWW.",
    "WWWWWWWWWWWWWW",
    "WSSWWWWWSSWWW.",
    ".SSSSSSSSSSS..",
  ],
  c: [
    ".....WWWW........WWWWW........",
    "...WWWWWWWW....WWWWWWWWW......",
    "..WWWWWWWWWWWWWWWWWWWWWWWW....",
    ".WWWWWWWWWWWWWWWWWWWWWWWWWWWW.",
    "WWWSSWWWWWWWWWWWWSSSWWWWWWWWWW",
    ".SSSSSSSSSSSSSSSSSSSSSSSSSSS..",
    "...SSSS....SSSSSSSSS..........",
  ],
};

const SUN_GRID = [
  "....XXXX....",
  "..XXXXXXXX..",
  ".XXXXXXXXXX.",
  ".XXXHHXXXXX.",
  "XXXHHHHXXXXX",
  "XXXHHHHXXXXX",
  "XXXXHHXXXXXX",
  "XXXXXXXXXXXX",
  ".XXXXXXXXXR.",
  ".XXXXXXXRRR.",
  "..XXXXRRRR..",
  "....RRRR....",
];

function drawGrid(grid: string[], colorMap: Record<string, string>, scale = 1): string {
  const h = grid.length;
  const w = grid[0].length;
  const canvas = document.createElement("canvas");
  canvas.width = w * scale;
  canvas.height = h * scale;
  const ctx = canvas.getContext("2d")!;
  grid.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const col = colorMap[row[x]];
      if (!col) continue;
      ctx.fillStyle = col;
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  });
  return canvas.toDataURL();
}

function drawSheet(frames: string[][], colorMap: Record<string, string>): string {
  const fh = frames[0].length;
  const fw = frames[0][0].length;
  const canvas = document.createElement("canvas");
  canvas.width = fw * frames.length;
  canvas.height = fh;
  const ctx = canvas.getContext("2d")!;
  frames.forEach((grid, f) => {
    grid.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        const col = colorMap[row[x]];
        if (!col) continue;
        ctx.fillStyle = col;
        ctx.fillRect(f * fw + x, y, 1, 1);
      }
    });
  });
  return canvas.toDataURL();
}

function drawGrass(p: (typeof PALETTES)[Period]): string {
  const W = 512;
  const H = 22;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const lightTop = (x: number) => 3 + [0, 1, 2, 1][Math.floor(x / 4) % 4];
  const midTop = (x: number) => 9 + [0, 2, 1, 0][Math.floor(x / 6) % 4];
  const darkTop = (x: number) => 15 + [1, 0, 2, 1][Math.floor(x / 5) % 4];
  for (let x = 0; x < W; x++) {
    const lt = lightTop(x);
    const mt = midTop(x);
    const dt = darkTop(x);
    ctx.fillStyle = p.grassL;
    ctx.fillRect(x, lt, 1, mt - lt);
    ctx.fillStyle = p.grassM;
    ctx.fillRect(x, mt, 1, dt - mt);
    ctx.fillStyle = p.grassD;
    ctx.fillRect(x, dt, 1, H - dt);
  }
  ctx.fillStyle = p.grassL;
  for (let x = 2; x < W; x += 16) {
    const lt = lightTop(x);
    ctx.fillRect(x, lt - 2, 1, 2);
    ctx.fillRect(x + 1, lt - 1, 1, 1);
  }
  return canvas.toDataURL();
}

export interface SpriteSet {
  a: string;
  b: string;
  c: string;
  sun: string;
  grass: string;
  bird: string;
}

const spriteCache: Partial<Record<Period, SpriteSet>> = {};

export function getSprites(period: Period): SpriteSet {
  const cached = spriteCache[period];
  if (cached) return cached;
  const p = PALETTES[period];
  const cloudMap = { W: p.cloudW, S: p.cloudS };
  const out: SpriteSet = {
    a: drawGrid(CLOUD_GRIDS.a, cloudMap),
    b: drawGrid(CLOUD_GRIDS.b, cloudMap),
    c: drawGrid(CLOUD_GRIDS.c, cloudMap),
    sun: drawGrid(SUN_GRID, { X: p.sunX, H: p.sunH, R: p.sunR }),
    grass: drawGrass(p),
    bird: drawSheet(BIRD_FRAMES, { X: p.bird }),
  };
  spriteCache[period] = out;
  return out;
}

export function periodForHour(hour: number): Period {
  return hour < 5 ? "night" : hour < 7 ? "dawn" : hour < 17 ? "day" : hour < 19 ? "sunset" : "night";
}
