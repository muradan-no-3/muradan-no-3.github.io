import { getAppleMusicData } from "./songlinksapi.module.js";
import { loadFile } from "./util.module.js";
import {
  getRenderProps,
  renderImageByCurrentSetting,
  renderImage,
} from "./render.module.js";

import { CANVAS_WIDTH } from "./constants.module.js";

document.addEventListener("DOMContentLoaded", async () => {
  const controller = document.getElementById("controller");

  /* 変更検知するinputを収集 */
  const inputs = {};
  ["style", "background", "jacket_src", "title", "artist", "lyric"].map(
    (name) => {
      inputs[name] = controller.querySelectorAll(`[name="${name}"]`);
    }
  );

  const inputJacketSrc = inputs["jacket_src"][0];
  const inputMusicUrl = document.querySelector(`[name="music_url"]`);

  /* ファイルAPIからの値 */
  controller
    .querySelector("[name='jacket']")
    .addEventListener("change", async (e) => {
      const url = await loadFile(e.target.files[0]);
      inputJacketSrc.value = url;
      inputJacketSrc.dispatchEvent(new Event("change"));
    });

  /* 入力の変更検出登録 */
  Object.entries(inputs).forEach(([name, ipts]) => {
    ipts.forEach((ipt) => {
      ipt.addEventListener("change", async () => {
        const props = getRenderProps();
        renderImage(canvas, props);
      });
    });
  });

  /* APIリクエストからの値 */
  inputMusicUrl.addEventListener("change", async (e) => {
    const apiData = await getAppleMusicData(e.target.value);

    inputs["title"][0].value = apiData.title;
    inputs["artist"][0].value = apiData.artistName;

    inputJacketSrc.value = apiData.thumbnailUrl;
    inputJacketSrc.dispatchEvent(new Event("change"));
  });

  /* 初回の既定値描画 */
  const canvas = document.getElementById("canvas");
  canvas.width = CANVAS_WIDTH;

  const default_props = getRenderProps();

  renderImage(canvas, default_props);
});

window.renderImageByCurrentSetting = renderImageByCurrentSetting;
