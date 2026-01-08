const WRAP = 64;
const CANVAS_WIDTH = 750;
const AREA = {
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
const PROPERTY = {
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
      font: "500 36px 'Noto Sans',sans-serif",
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
      font: "500 64px 'Noto Sans',sans-serif",
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
      font: "400 45px 'Noto Sans',sans-serif",
      color: { default: "#000000", active: "#ffffff" },
      leading: 90,
      lineHeight: 68,
      x: AREA["spotify"].padding.inline,
      y: 224,
    },
  },
};

const DEFAULT_PROPS = {
  style: "apple",
  jacket: "../../sample2.jpg",
  title: "Blue days",
  artist: "Quubi",
  lyric: "君がいない日々\nそれこそが君を\n一番近くに感じさせている",
};
const DEFAULT_PROPS_ = {
  style: "apple",
  background: "#ffffff",
  jacket: "../../sample.jpg",
  title: "メロメロメロイック",
  artist: "LADYBABY",
  lyric: "メロメロメロイック!\nサブカルチャー沸かせ\nワールドワイド",
};

document.addEventListener("DOMContentLoaded", async () => {
  const controller = document.getElementById("controller");

  const inputs = {};
  ["style", "background", "jacket", "title", "artist", "lyric"].map((name) => {
    inputs[name] = controller.querySelectorAll(`[name="${name}"]`);
  });

  Object.entries(inputs).forEach(([name, ipts]) => {
    ipts.forEach((ipt) => {
      ipt.addEventListener("change", async () => {
        const props = await getRenderProps();
        renderImage(canvas, props);
      });
    });
  });

  const canvas = document.getElementById("canvas");
  canvas.width = CANVAS_WIDTH;

  const default_props = await getRenderProps();

  renderImage(canvas, default_props);
});

async function getRenderProps() {
  const inputs = {};
  [
    "style",
    "background",
    "jacket",
    "title",
    "artist",
    "lyric",
    "highlight",
  ].forEach((name) => {
    inputs[name] = document.getElementsByName(name);
  });

  console.log(inputs);

  const entries = await Promise.all(
    Object.entries(inputs).map(async ([name, elms]) => {
      const val = await getValue(elms[0]);
      return [name, val];
    })
  );

  const props = Object.fromEntries(entries);
  console.log(props);
  return props;
}

async function renderImageByCurrentSetting() {
  const canvas = document.getElementById("canvas");
  const props = await getRenderProps();
  renderImage(canvas, props, false);
}

function renderImage(canvas, inputs, callRenderButton = true) {
  const {
    style,
    background,
    jacket: jacketSrc,
    title,
    artist,
    lyric,
    highlight,
  } = inputs;

  const ctx = canvas.getContext("2d");
  ctx.font = PROPERTY[style].lyric.font;
  const textHeight = calculateTextHeight(
    ctx,
    lyric,
    canvas.width - AREA[style].padding.inline * 2,
    PROPERTY[style].lyric.lineHeight,
    PROPERTY[style].lyric.leading
  );

  canvas.height =
    AREA[style].padding.top +
    PROPERTY[style].lyric.y -
    PROPERTY[style].lyric.leading +
    textHeight +
    AREA[style].padding.bottom;

  canvas.style.width = `${canvas.width}px`;
  canvas.style.height = `${canvas.height}px`;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const jacketCanvas = document.createElement("canvas");
  jacketCanvas.width = PROPERTY[style].jacket.size;
  jacketCanvas.height = PROPERTY[style].jacket.size;
  const ctx_jacket = jacketCanvas.getContext("2d");

  const jacketImage = new Image();
  jacketImage.src = jacketSrc;

  jacketImage.onload = () => {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (style === "apple")
      ctx.filter = "saturate(180%) brightness(90%) contrast(150%) blur(120px)";

    /* 背景ぼかし */
    style === "apple" &&
      ctx.drawImage(
        jacketImage,
        -WRAP,
        -WRAP,
        canvas.width + WRAP * 2,
        canvas.height + WRAP * 2
      );
    ctx.filter = "none";

    /* ジャケット */
    createRoundRect(
      ctx_jacket,
      0,
      0,
      PROPERTY[style].jacket.size,
      PROPERTY[style].jacket.size,
      PROPERTY[style].jacket.radius
    );

    ctx_jacket.clip();
    ctx_jacket.drawImage(
      jacketImage,
      0,
      0,
      PROPERTY[style].jacket.size,
      PROPERTY[style].jacket.size
    );

    ctx.drawImage(
      jacketCanvas,
      PROPERTY[style].jacket.x,
      PROPERTY[style].jacket.y,
      PROPERTY[style].jacket.size,
      PROPERTY[style].jacket.size
    );

    ctx.textAlign = PROPERTY[style].title.textAlign ?? "left";
    ctx.font = PROPERTY[style].title.font;
    ctx.fillStyle = PROPERTY[style].title.color;
    ctx.fillText(title, PROPERTY[style].title.x, PROPERTY[style].title.y);

    ctx.textAlign = PROPERTY[style].artist.textAlign ?? "left";
    ctx.font = PROPERTY[style].artist.font;
    ctx.fillStyle = PROPERTY[style].artist.color;
    ctx.fillText(artist, PROPERTY[style].artist.x, PROPERTY[style].artist.y);

    ctx.textAlign = "left";
    ctx.font = PROPERTY[style].lyric.font;

    let renderedHeight = 0;
    lyric.split("\n").forEach((line, l) => {
      ctx.fillStyle =
        highlight && highlight.includes(l)
          ? PROPERTY[style].lyric.color.active
          : PROPERTY[style].lyric.color.default;
      drawTextWithBreak(
        ctx,
        line,
        PROPERTY[style].lyric.x,
        PROPERTY[style].lyric.y + renderedHeight,
        canvas.width - AREA[style].padding.inline * 2,
        PROPERTY[style].lyric.lineHeight
      );

      renderedHeight += calculateTextHeight(
        ctx,
        line,
        canvas.width - AREA[style].padding.inline * 2,
        PROPERTY[style].lyric.lineHeight,
        PROPERTY[style].lyric.leading
      );
    });
  };

  if (callRenderButton) renderLyricButton(canvas, inputs);
}

function renderLyricButton(canvas, inputs) {
  const old = document.getElementById("js-lyric-button");
  if (old) old.remove();

  const { style, lyric } = inputs;

  /* canvas相当のdivを用意 */
  const wrapper = document.createElement("div");
  wrapper.id = "js-lyric-button";
  wrapper.classList.add("lyricButtons");
  canvas.parentElement.appendChild(wrapper);
  wrapper.style.width = `${canvas.width}px`;
  wrapper.style.height = `${canvas.height}px`;
  wrapper.style.paddingTop = `${
    PROPERTY[style].lyric.y - PROPERTY[style].lyric.leading
  }px`;
  wrapper.style.paddingInline = `${AREA[style].padding.inline}px`;

  /* 歌詞を描画 */

  lyric.split("\n").forEach((line, l) => {
    const label = document.createElement("label");
    label.textContent = line;
    label.style.font = PROPERTY[style].lyric.font;
    label.style.lineHeight = `${PROPERTY[style].lyric.lineHeight}px`;
    label.style.marginTop = `${
      PROPERTY[style].lyric.leading - PROPERTY[style].lyric.lineHeight
    }px`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "highlight";
    checkbox.id = `lyric-line-${l}`;
    checkbox.value = l;
    checkbox.dataset.id = l;
    checkbox.setAttribute("onchange", "renderImageByCurrentSetting()");

    label.appendChild(checkbox);

    wrapper.appendChild(label);
  });
}

function loadFile(file) {
  if (!file) return DEFAULT_PROPS.jacket;
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      resolve(event.target.result);
    };

    reader.readAsDataURL(file);
  });
}

async function getValue(input) {
  if (!input) return;
  if (input.type === "file") {
    const url = await loadFile(input.files[0]);
    return url;
  } else if (input.type === "radio") {
    const radios = document.getElementsByName(input.name);
    return Array.from(radios)
      .filter((ipt) => ipt.checked)
      .map((ipt) => ipt.value)[0];
  } else if (input.type === "checkbox") {
    const checkboxes = document.getElementsByName(input.name);
    return Array.from(checkboxes)
      .filter((ipt) => ipt.checked)
      .map((ipt) => Number(ipt.value));
  } else {
    return input.value;
  }
}

/**
 * 角丸の四角を作り出す
 * @param context
 * @param x
 * @param y
 * @param width
 * @param height
 * @param radius
 */
function createRoundRect(context, x, y, width, height, radius) {
  // 左上移動
  context.moveTo(x + radius, y);
  // 右上に繋がる線
  context.lineTo(x + width - radius, y);
  // 弧
  context.arcTo(x + width, y, x + width, y + radius, radius);
  // 右下に繋がる線
  context.lineTo(x + width, y + height - radius);
  // 弧
  context.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  // 左下に繋がる線
  context.lineTo(x + radius, y + height);
  // 弧
  context.arcTo(x, y + height, x, y + height - radius, radius);
  // 右上に繋がる線
  context.lineTo(x, y + radius);
  // 弧
  context.arcTo(x, y, x + radius, y, radius);
  context.closePath();
}

function wrapTextByWidth(ctx, text, maxWidth) {
  const lines = [];
  let line = "";
  let lineWidth = 0;

  for (const char of text) {
    const w = ctx.measureText(char).width;

    if (lineWidth + w > maxWidth) {
      lines.push(line);
      line = char;
      lineWidth = w;
    } else {
      line += char;
      lineWidth += w;
    }
  }

  if (line) lines.push(line);
  return lines;
}

function calculateTextHeight(ctx, text, width, lh, leading) {
  const result = text
    .split("\n")
    .map((line) => {
      const lines = wrapTextByWidth(ctx, line, width);
      return (lines.length - 1) * lh;
    })
    .reduce((acc, l) => l + leading + acc, 0);

  return result;
}

function drawTextWithBreak(ctx, text, x, y, width, lh) {
  const lines = wrapTextByWidth(ctx, text, width);

  lines.forEach((line, i) => {
    ctx.fillText(line, x, y + i * lh);
  });
}
