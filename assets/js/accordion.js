window.addEventListener("load", () => {
  const buttons = document.querySelectorAll(".js-accordion-button");

  console.log(buttons);
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      toggleAccordion(button);
    });
    button.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.code === "Space") {
        toggleAccordion(button);
      }
    });
  });
});

function toggleAccordion(button) {
  const target = button.nextElementSibling;

  if (target.classList.contains("open")) {
    target.style.height = "auto";
    const targetHeight = target.offsetHeight;
    target.style.height = targetHeight + "px";
    document.defaultView.getComputedStyle(target, null).height;
    target.style.height = "0px";

    target.classList.remove("open");
    target.classList.add("close");

    target.setAttribute("aria-hidden", "true");
    button.setAttribute("aria-expanded", "false");
  } else {
    target.style.height = "auto";
    const targetHeight = target.offsetHeight;
    target.style.height = "0px";
    document.defaultView.getComputedStyle(target, null).height;
    target.style.height = targetHeight + "px";

    target.addEventListener("transitionend", () => {
      if (target.style.height !== "0px") {
        target.style.height = "auto";
      }
    });

    target.classList.remove("close");
    target.classList.add("open");

    target.setAttribute("aria-hidden", "false");
    button.setAttribute("aria-expanded", "true");
  }
}
