window.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("touchstart", () => {
    const target = document.querySelector(".js-fixed-size");
    target.classList.add("onmoving");
  });

  document.addEventListener("touchend", () => {
    const target = document.querySelector(".js-fixed-size");
    target.classList.remove("onmoving");
  });

  document.addEventListener("scroll", () => {
    fixTarget();
  });
  window.visualViewport.addEventListener("scroll", () => {
    fixTarget();
  });
  window.visualViewport.addEventListener("resize", () => {
    fixTarget();
  });

  function fixTarget() {
    const offsetX = window.visualViewport.offsetLeft;
    const offsetY = window.visualViewport.offsetTop;
    const scale = window.visualViewport ? 1 / window.visualViewport.scale : 1;

    const target = document.querySelector(".js-fixed-size");
    target.style.scale = scale;
    target.style.translate = Number(4 * scale + offsetX) + "px " + Number(16 * scale + offsetY) + "px";
  }
});
