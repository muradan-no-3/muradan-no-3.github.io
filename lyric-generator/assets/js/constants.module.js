export const WRAP = 64;
export const CANVAS_WIDTH = 750;
export const AREA = {
  simple: {
    padding: {
      top: 44,
      bottom: 44,
      inline: 70,
    },
  },
  apple: {
    padding: {
      top: 44,
      bottom: 44,
      inline: 70,
    },
  },
  spotify: {
    padding: {
      top: 44,
      bottom: 44,
      inline: 32,
    },
  },
};
export const PROPERTY = {
  simple: {
    jacket: {
      size: 124,
      x: AREA["simple"].padding.inline,
      y: AREA["simple"].padding.top,
      radius: 10,
    },
    title: {
      font: "40px sans-serif",
      color: "#000000",
      x: 208,
      y: 96,
    },
    artist: {
      font: "32px sans-serif",
      color: "#000000",
      x: 208,
      y: 140,
    },
    lyric: {
      font: "500 36px 'Noto Sans','Roboto','Noto Sans CJK',sans-serif",
      color: { default: "#00000088", active: "#000000" },
      leading: 80,
      lineHeight: 64,
      x: AREA["simple"].padding.inline,
      y: 240,
    },
  },
  apple: {
    jacket: {
      size: 124,
      x: AREA["apple"].padding.inline,
      y: AREA["apple"].padding.top,
      radius: 10,
    },
    title: {
      font: "32px sans-serif",
      color: "#ffffff",
      x: 208,
      y: 96,
    },
    artist: {
      font: "32px sans-serif",
      color: "#ffffff88",
      x: 208,
      y: 136,
    },
    lyric: {
      font: "500 64px sans-serif",
      android: "700 64px sans-serif",
      color: { default: "#ffffffaa", active: "#ffffff" },
      leading: 120,
      lineHeight: 80,
      x: AREA["apple"].padding.inline,
      y: 280,
    },
  },
  spotify: {
    jacket: {
      size: 100,
      x: AREA["spotify"].padding.inline,
      y: AREA["spotify"].padding.top,
      radius: 10,
    },
    title: {
      font: "26px sans-serif",
      color: "#ffffff",
      x: CANVAS_WIDTH / 2,
      y: 86,
      textAlign: "center",
    },
    artist: {
      font: "24px sans-serif",
      color: "#ffffff",
      x: CANVAS_WIDTH / 2,
      y: 120,
      textAlign: "center",
    },
    lyric: {
      font: "400 45px 'Noto Sans','Roboto',sans-serif",
      color: { default: "#000000", active: "#ffffff" },
      leading: 90,
      lineHeight: 68,
      x: AREA["spotify"].padding.inline,
      y: 224,
    },
  },
};
