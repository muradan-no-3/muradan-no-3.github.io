/**
 * 角丸の四角を作り出す
 * @param context
 * @param x
 * @param y
 * @param width
 * @param height
 * @param radius
 */
export function createRoundRect(context, x, y, width, height, radius) {
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

export function calculateTextHeight(ctx, text, width, lh, leading) {
  const result = text
    .split("\n")
    .map((line) => {
      const lines = wrapTextByWidth(ctx, line, width);
      return (lines.length - 1) * lh;
    })
    .reduce((acc, l) => l + leading + acc, 0);

  return result;
}

export function drawTextWithBreak(ctx, text, x, y, width, lh) {
  const lines = wrapTextByWidth(ctx, text, width);

  lines.forEach((line, i) => {
    ctx.fillText(line, x, y + i * lh);
  });
}
