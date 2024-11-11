window.addEventListener("DOMContentLoaded", () => {
  /*DEVELOPER*/
  /*document.getElementById("setting-outer").classList.add("close");
  document.getElementById("result-wrapper").classList.add("active");
  document.getElementById("answer-wrapper").classList.remove("active"); */

  const isIOS = /iP(hone|(o|a)d)/.test(navigator.userAgent);

  /*HEADER*/
  const radios = document
    .getElementById("setting-radios")
    .querySelectorAll("input");
  const homeRadios = document
    .getElementById("home-setting-radios")
    .querySelectorAll("input");

  const checkboxes = document
    .getElementById("setting-checkboxes")
    .querySelectorAll("input");
  const groupClasses = document
    .getElementById("setting-checkboxes")
    .querySelectorAll("h3");
  const homeCheckboxes = document
    .getElementById("home-setting-checkboxes")
    .querySelectorAll("input");
  const homeGroupClasses = document
    .getElementById("home-setting-checkboxes")
    .querySelectorAll("h3");

  const groupIndicators = document.querySelectorAll(".setting-groups");

  const qsetting = document.getElementById("q-setting");
  const qmode = document.getElementById("q-mode");
  const qlist = document.getElementById("q-list");

  const aInput = document
    .getElementById("question-control")
    .querySelector(".mode-input")
    .querySelector("input");
  const alertController = document.getElementById("alert-controller");

  const homeButton = document.getElementById("home");
  const hamburger = document
    .querySelector("header")
    .querySelector(".hamburger");
  const helpButton = document.getElementById("help");
  const alertHelp = document.getElementById("alert-help");

  groupClasses.forEach((h3) => {
    h3.querySelector("input").addEventListener("change", (e) => {
      const childInputs = h3.nextElementSibling.querySelectorAll("input");
      childInputs.forEach((ipt) => {
        ipt.checked = e.target.checked;
        ipt.dispatchEvent(new Event("change"));
      });
    });
  });
  homeGroupClasses.forEach((h3) => {
    h3.querySelector("input").addEventListener("change", (e) => {
      const childInputs = h3.nextElementSibling.querySelectorAll("input");
      childInputs.forEach((ipt) => {
        ipt.checked = e.target.checked;
        ipt.dispatchEvent(new Event("change"));
      });
    });
  });

  homeButton.classList.add("disabled");
  hamburger.classList.add("disabled");
  helpButton.classList.add("disabled");

  const checkboxStates = {};

  checkboxes.forEach((check) => {
    const currentStates = JSON.parse(localStorage.getItem("checkboxStates"));
    if (currentStates) {
      check.checked = currentStates[check.id];
      setIndicator();
    }
    checkboxStates[check.id] = check.checked;
    check.addEventListener("change", () => {
      checkboxStates[check.id] = check.checked;
      const target = document
        .getElementById("home-setting-checkboxes")
        .querySelector("input[data-targetid='" + check.id + "']");
      if (check.checked) {
        target.checked = true;
      } else {
        target.checked = false;
      }
      setIndicator();
      localStorage.setItem("checkboxStates", JSON.stringify(checkboxStates));
    });

    function setIndicator() {
      groupIndicators.forEach((ul) => {
        if (
          check.getAttribute("name").replace("home-", "") === "setting-group"
        ) {
          const target = ul.querySelector(
            'li[data-group="' + check.id.replace("setting-", "") + '"]'
          );
          if (check.checked) {
            target.classList.remove("disabled");
          } else {
            target.classList.add("disabled");
          }
        }
      });
    }
  });

  localStorage.setItem("checkboxStates", JSON.stringify(checkboxStates));

  radios.forEach((radio) => {
    if (radio.checked) {
      qsetting.value = radio.id.replace("setting-", "");
    }
    radio.addEventListener("change", () => {
      if (radio.checked) {
        qsetting.value = radio.id.replace("setting-", "");
        document
          .getElementById("home-setting-radios")
          .querySelector(
            "input[data-targetid='" + qsetting.value + "']"
          ).checked = true;
      }

      const mode = qmode.value;
      const list = qlist.value;
      const setting = qsetting.value;
      const usingList = initializeRandomArray(list);

      const firstQ = getDataRandom(usingList);
      setQuestion(firstQ);
      setAnswer(firstQ);

      startSession(mode, list, setting);

      const qWrapper = document.getElementById("question-wrapper");
      const aWrapper = document.getElementById("answer-wrapper");
      const qNext = document.getElementById("question-next");

      aWrapper.classList.remove("active");
      qWrapper.classList.add("active");

      qNext.classList.remove("js-showQ");
      qNext.classList.add("js-showA");

      document.getElementById("header-nav-contoroller").checked = false;
    });
  });

  /*home setting*/

  homeCheckboxes.forEach((check) => {
    const currentStates = JSON.parse(localStorage.getItem("checkboxStates"));
    if (currentStates) {
      check.checked = currentStates[check.getAttribute("data-targetid")];
    }
    check.addEventListener("change", () => {
      const target = document.getElementById(
        check.getAttribute("data-targetid")
      );
      if (check.checked) {
        target.checked = true;
      } else {
        target.checked = false;
      }
      target.dispatchEvent(new Event("change"));
    });
  });
  homeRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.checked) {
        qsetting.value = radio.getAttribute("data-targetid");
        document.getElementById("setting-" + qsetting.value).checked = true;
      }
    });
  });

  /*MODE*/
  const navs = document.querySelectorAll("nav");
  const mainOuter = document.getElementById("main-outer");

  const questionControl = document.getElementById("question-control");

  navs.forEach((nav) => {
    const buttons = nav.querySelectorAll("button");

    const isHeader = nav.parentNode.tagName.toLowerCase() === "header";

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const mode = button.getAttribute("data-mode");
        const list = button.getAttribute("data-list");
        const setting = qsetting.value;

        const rWrapper = document.getElementById("result-wrapper");

        const alertOKAction = document.getElementById("alertOKAction");

        const okAction = {
          changeMode: {
            mode: mode,
            list: list,
            setting: setting,
          },
        };

        alertOKAction.value = JSON.stringify(okAction);

        alertController
          .querySelector(".ok")
          .setAttribute("data-action", "changeMode");

        if (isHeader) {
          if (
            rWrapper.classList.contains("active") ||
            qmode.value === "memory"
          ) {
            startSession(mode, list, setting);
          } else {
            document.getElementById("header-nav-contoroller").checked = false;
            showAlert("出題方法を変更しますか？", "yn", false);
          }
        } else {
          startSession(mode, list, setting);
        }
      });
    });
  });

  alertController.querySelector(".ok").addEventListener("click", () => {
    const alertOKAction = document.getElementById("alertOKAction");
    const okAction = JSON.parse(alertOKAction.value);
    const action = alertController
      .querySelector(".ok")
      .getAttribute("data-action");

    startSession(
      okAction[action].mode,
      okAction[action].list,
      okAction[action].setting
    );
  });

  function startSession(mode, list, setting) {
    sessionReset();

    const inputMode = document.getElementById("q-mode");
    inputMode.value = mode;
    const inputList = document.getElementById("q-list");
    inputList.value = list;

    const inputShown = document.getElementById("q-shown");
    inputShown.value = "";

    questionControl.setAttribute("data-mode", mode);

    homeButton.classList.remove("disabled");
    helpButton.classList.remove("disabled");
    hamburger.classList.remove("disabled");

    alertHelp.classList.remove(...alertHelp.classList);
    alertHelp.classList.add(mode);
    alertHelp.classList.add(list);

    inputMode.dispatchEvent(new Event("change"));
    inputList.dispatchEvent(new Event("change"));

    document.getElementById("setting-outer").classList.add("close");

    const usingList = initializeRandomArray(list);

    const listSize = getListSize(usingList);
    const N = list === "random10" && listSize.m >= 10 ? 10 : listSize.m;

    if (list === "random10" && listSize.m < 10) {
      showAlert(
        "対象メンバーが10に満たないため、対象メンバーを全て出題して終了します。",
        "error"
      );
    }

    setSessionData({
      usingListOnStart: usingList,
      usingListSizeOnStart: listSize,
      questioned: 0,
      questioning: N,
      mode: mode,
      list: list,
      setting: setting,
    });

    const nextQ = document.getElementById("nextQ");
    const firstQ = getDataRandom(usingList);
    setQuestion(firstQ);
    nextQ.value = JSON.stringify(firstQ);

    const aOuter = document.getElementById("answer-outer");
    aOuter.dispatchEvent(new Event("click"));

    const loading = document.getElementById("loading");
    loading.classList.add("nowloading");
    const alertWrapper = document.getElementById("alert-wrapper");
    alertWrapper.classList.add("js-wait-loading");

    alertWrapper.addEventListener("animationend", () => {
      alertWrapper.classList.remove("js-wait-loading");
    });

    loading.addEventListener("animationend", () => {
      loading.classList.remove("nowloading");
      alertWrapper.classList.remove("js-wait-loading");

      if (!isIOS && mode === "input") {
        const targetInput = questionControl
          .querySelector(".mode-input")
          .querySelector("input");
        targetInput.focus();
      }
    });

    document.getElementById("header-nav-contoroller").checked = false;
  }

  /*SETTING*/
  const alertControl = document.getElementById("alert-control");

  alertControl.addEventListener("change", (e) => {
    if (e.target.classList.contains("js-go-home") && !e.target.checked) {
      goHomeScreen();
    } else if (!isIOS && !e.target.checked && qmode.value === "input") {
      aInput.focus();
    }
  });

  document.getElementById("home").addEventListener("click", () => {
    const rWrapper = document.getElementById("result-wrapper");
    if (rWrapper.classList.contains("active") || qmode.value === "memory") {
      goHomeScreen();
    } else {
      showAlert("ホーム画面に戻りますか？", "gohome", false);
    }
  });

  alertController.querySelector(".home").addEventListener("click", () => {
    goHomeScreen();
  });
  document.getElementById("result-closer").addEventListener("click", () => {
    const mode = document.getElementById("q-mode").value;
    const list = document.getElementById("q-list").value;
    startSession(mode, list);
  });
});

function sessionReset() {
  const qWrapper = document.getElementById("question-wrapper");
  const aWrapper = document.getElementById("answer-wrapper");
  const rWrapper = document.getElementById("result-wrapper");
  const pQWrapper = document.getElementById("js-prevQuestion-wrapper");
  const raOuter = document.getElementById("result-answer-outer");

  const resultQuestionsList = document
    .getElementById("result-questions")
    .querySelector("tbody");

  const prevQ = document.getElementById("prevQ");
  const currentQ = document.getElementById("currentQ");
  const nextQ = document.getElementById("nextQ");

  const qPrev = document.getElementById("question-prev");
  const qNext = document.getElementById("question-next");

  const qshown = document.getElementById("q-shown");

  const session = document.getElementById("sessionData");

  const alertControl = document.getElementById("alert-control");

  const homeButton = document.getElementById("home");
  const hamburger = document
    .querySelector("header")
    .querySelector(".hamburger");
  const helpButton = document.getElementById("help");

  qWrapper.classList.remove("active");
  rWrapper.classList.remove("active");
  if (pQWrapper) {
    pQWrapper.classList.remove("active");
  }

  aWrapper.classList.add("active");
  raOuter.classList.add("closed");

  helpButton.classList.add("disabled");
  hamburger.classList.add("disabled");
  homeButton.classList.add("disabled");

  prevQ.value = "";
  currentQ.value = "";
  nextQ.value = "";

  qshown.value = "";

  session.value = "";

  resultQuestionsList.innerHTML = "";

  qPrev.classList.remove("disabled");
  qNext.classList.remove("js-showResult");
  qNext.classList.remove("disabled");

  alertControl.checked = false;

  setAnswer(null_member);
  setDisplayParameters("", "", "", "");
}

function goHomeScreen() {
  sessionReset();

  const settingOuter = document.getElementById("setting-outer");

  settingOuter.classList.remove("close");
}

function setSessionData(data) {
  const sessionData = document.getElementById("sessionData");
  sessionData.value = JSON.stringify(data);
}
function getSessionData() {
  const sessionData = document.getElementById("sessionData");
  return JSON.parse(sessionData.value);
}
