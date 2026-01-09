import { getValue } from "./util.module.js";
import {
  createRoundRect,
  calculateTextHeight,
  drawTextWithBreak,
} from "./canvas.module.js";
import { WRAP, AREA, PROPERTY } from "./constants.module.js";

export function getRenderProps() {
  const inputs = {};
  [
    "style",
    "background",
    "jacket_src",
    "title",
    "artist",
    "lyric",
    "highlight",
  ].forEach((name) => {
    inputs[name] = document.getElementsByName(name);
  });

  const entries = Object.entries(inputs).map(([name, elms]) => {
    const val = getValue(elms[0]);
    return [name, val];
  });

  const props = Object.fromEntries(entries);
  return props;
}

export function renderImageByCurrentSetting() {
  const canvas = document.getElementById("canvas");
  const props = getRenderProps();
  renderImage(canvas, props, false);
}

export function renderImage(canvas, inputs, callRenderButton = true) {
  const {
    style,
    background,
    jacket_src: jacketSrc,
    title,
    artist,
    lyric,
    highlight,
  } = inputs;

  canvas.dataset.title = `${artist}-${title}-lyric`;

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
