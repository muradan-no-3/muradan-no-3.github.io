export function canvasToBlob(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, "image/png");
  });
}

export async function downloadCanvas(canvas) {
  const blob = await canvasToBlob(canvas);
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${canvas.dataset.title}.png`;
  a.click();

  URL.revokeObjectURL(url);
}

export async function shareCanvas(canvas) {
  const blob = await canvasToBlob(canvas);
  const file = new File([blob], "image.png", { type: "image/png" });

  if (navigator.share) {
    await navigator.share({
      files: [file],
      title: "canvas image",
    });
  }
}

export function showRightClickMenu() {
  const menu = document.getElementById("rightClickMenu");
  menu.showModal();

  menu.addEventListener("click", (e) => modalClickHandler(e));
}

export function modalClickHandler(e) {
  if (e.target.closest(".dialog-container") === null) {
    e.target.closest("dialog").close();
  }
}
