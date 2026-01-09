export function loadFile(file) {
  if (!file) return "";
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      resolve(event.target.result);
    };

    reader.readAsDataURL(file);
  });
}

export function getValue(input) {
  if (!input) return;
  if (input.type === "radio") {
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

export function isAndroid() {
  if (navigator.userAgent.match(/Android.+Mobile/)) {
    return true;
  } else {
    return false;
  }
}
