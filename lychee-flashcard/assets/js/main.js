window.addEventListener("DOMContentLoaded", () => {
  /*----get elements---*/

  const main = document.getElementById("main-outer");
  const qWrapper = document.getElementById("question-wrapper");
  const aWrapper = document.getElementById("answer-wrapper");
  const rWrapper = document.getElementById("result-wrapper");
  const qOuter = document.getElementById("question-outer");
  const aOuter = document.getElementById("answer-outer");

  const helpButton = document.getElementById("help");

  const alertWrapper = document.getElementById("alert-wrapper");
  const alertControl = document.getElementById("alert-control");

  const qControl = document.getElementById("question-control");

  const aJudge = document.getElementById("answer-judge");

  const prevQ = document.getElementById("prevQ");
  const currentQ = document.getElementById("currentQ");
  const nextQ = document.getElementById("nextQ");

  const answerStatus = document.getElementById("answer-status").querySelector("span");
  const questionStatus = document.getElementById("question-status").querySelector("span");

  const qPrev = document.getElementById("question-prev");
  const qNext = document.getElementById("question-next");

  const answerCheck = document.getElementById("answer-check");
  const answerMark = document.getElementById("answer-marked");

  const qmode = document.getElementById("q-mode");
  const qlist = document.getElementById("q-list");
  const qsetting = document.getElementById("q-setting");

  const aInput = document.getElementById("question-control").querySelector(".mode-input").querySelector("input");

  const raCloser = document.getElementById("result-answer-closer");

  /*-------*/

  if (!localStorage.getItem("checked_member")) {
    localStorage.setItem("checked_member", JSON.stringify([]));
  }
  if (!localStorage.getItem("marked_member")) {
    localStorage.setItem("marked_member", JSON.stringify([]));
  }

  /*-------*/
  document.addEventListener("keydown", (event) => {
    if (
      !document.body.classList.contains("js-keyboard-active") &&
      !isIMEActive &&
      questionControl.getAttribute("data-phase") === "answer" &&
      event.code === "Enter"
    ) {
      qNext.dispatchEvent(new Event("click"));
    }
  });

  aInput.addEventListener("focus", () => {
    document.body.classList.add("js-keyboard-active");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  });
  aInput.addEventListener("blur", () => {
    document.body.classList.remove("js-keyboard-active");
  });

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", () => {
      const viewportHeight = window.visualViewport.height;
      const windowHeight = window.innerHeight;

      if (viewportHeight < windowHeight) {
        qControl.style.bottom = windowHeight - viewportHeight + "px";
        document.querySelector("main").style.height = viewportHeight + "px";

        document.addEventListener("touchmove", noscroll, { passive: false });
        document.addEventListener("wheel", noscroll, { passive: false });
      } else {
        qControl.style.bottom = "";
        document.removeEventListener("touchmove", noscroll);
        document.removeEventListener("wheel", noscroll);
        document.querySelector("main").style.height = "";
      }
    });
  }

  let usingList = initializeRandomArray("all");
  document.getElementById("q-list").addEventListener("change", (e) => {
    usingList = initializeRandomArray(e.target.value);
  });

  qOuter.addEventListener("click", () => {
    if (qmode.value === "memory") {
      showAnswer();
    }
  });
  aOuter.addEventListener("click", (e) => {
    const currentSession = getSessionData();
    if (currentSession.questioned === currentSession.questioning) {
      showResult();
    } else {
      showQuestion(e);
    }
  });

  qNext.addEventListener("click", (e) => {
    console.log("qNext click");
    if (qNext.classList.contains("js-hidePrev")) {
      hidePrevQuestion();
    } else if (qNext.classList.contains("js-showA")) {
      showAnswer();
    } else if (qNext.classList.contains("js-showQ")) {
      showQuestion(e);
    } else if (qNext.classList.contains("js-showResult")) {
      showResult();
    }
  });

  helpButton.addEventListener("click", (e) => {
    if (!alertControl.checked) {
      e.preventDefault();
      showAlert("", "help", false);
    }
  });

  qPrev.addEventListener("click", () => {
    showPrevQuestion();
  });

  answerCheck.addEventListener("click", () => {
    console.log("answer check");
    const gm = currentQ.value.split("-");

    if (answerCheck.classList.contains("js-removing")) {
      addMember(gm[0], gm[1], usingList);
      answerCheck.classList.remove("js-removing");
      answerStatus.classList.remove("check");
    } else {
      removeMember(gm[0], gm[1], usingList);
      answerCheck.classList.add("js-removing");
      answerMark.classList.remove("js-removing");

      if (answerStatus.classList.contains("marked")) {
        answerStatus.classList.remove("marked");
        unmarkMember(gm[0], gm[1]);
      }

      answerStatus.classList.add("check");
    }
  });
  answerMark.addEventListener("click", () => {
    const gm = currentQ.value.split("-");

    if (answerMark.classList.contains("js-removing")) {
      unmarkMember(gm[0], gm[1]);
      answerMark.classList.remove("js-removing");
      answerStatus.classList.remove("marked");
    } else {
      markMember(gm[0], gm[1]);
      answerMark.classList.add("js-removing");
      answerCheck.classList.remove("js-removing");
      if (answerStatus.classList.contains("check")) {
        answerStatus.classList.remove("check");
        addMember(gm[0], gm[1], usingList);
      }

      answerStatus.classList.add("marked");
    }
  });

  raCloser.addEventListener("click", () => {
    closeResultAnswer();
  });

  /* functions in window onload*/

  function showQuestion(e) {
    if (
      e.target.tagName.toLowerCase() != "a" &&
      e.target.parentNode.tagName.toLowerCase() != "a" &&
      e.target.parentNode.id != "sns" &&
      e.target.parentNode.parentNode.id != "sns"
    ) {
      console.log("showQuestion");

      aJudge.classList.remove("correct");
      aJudge.classList.remove("wrong");
      aInput.value = "";

      const currentSession = getSessionData();
      const nextData = JSON.parse(nextQ.value);

      currentSession.questioned += 1;
      setSessionData(currentSession);

      if (qlist.value === "all" && qmode.value === "memory") {
        setDisplayParameters(currentSession.questioned, "∞", qsetting.value, qlist.value);
      } else {
        setDisplayParameters(currentSession.questioned, currentSession.questioning, qsetting.value, qlist.value);
      }

      if (qmode.value === "select" || qmode.value === "input") {
        questionControl.setAttribute("data-phase", "question");
      }
      if (qmode.value === "input") {
        const targetInput = questionControl.querySelector(".mode-input").querySelector("input");
        targetInput.focus();
      }

      aWrapper.classList.remove("active");
      qWrapper.classList.add("active");
      currentQ.value = nextData.groupid + "-" + nextData.id;

      setTimeout(() => {
        setAnswer(nextData);
      }, 500);

      qNext.classList.remove("js-showQ");
      qNext.classList.add("js-showA");

      qPrev.classList.add("disabled");
    }
  }

  function showAnswer() {
    console.log("showAnswer");

    const currentSession = getSessionData();

    if (qmode.value === "select" || qmode.value === "input") {
      questionControl.setAttribute("data-phase", "answer");
    }

    const qshown = document.getElementById("q-shown");
    const shown_member = qshown.value != "" ? JSON.parse(qshown.value) : [];
    const nowShowingMember = JSON.parse(nextQ.value);

    shown_member.push(nowShowingMember.id);
    qshown.value = JSON.stringify(shown_member);
    console.log(shown_member);

    if (qmode.value != "memory" || qlist.value != "all") {
      usingList = initializeRandomArray(qlist.value);
    }

    const newQ = getDataRandom(usingList);
    prevQ.value = nextQ.value;
    nextQ.value = JSON.stringify(newQ);

    const oldPrev = document.getElementById("js-prevQuestion-wrapper");
    if (oldPrev) {
      oldPrev.remove();
    }
    const tmpWrapper = qWrapper.cloneNode(true);
    tmpWrapper.id = "js-prevQuestion-wrapper";
    tmpWrapper.classList.remove("active");
    main.appendChild(tmpWrapper);
    tmpWrapper.addEventListener("click", () => {
      hidePrevQuestion();
    });

    qWrapper.classList.remove("active");
    aWrapper.classList.add("active");

    setTimeout(() => {
      setQuestion(newQ);
    }, 500);

    if ((qlist.value != "all" || qmode.value != "memory") && currentSession.questioned === currentSession.questioning) {
      qNext.classList.remove("js-showA");
      qNext.classList.add("js-showResult");
      qPrev.classList.add("disabled");
    } else {
      qNext.classList.remove("js-showA");
      qNext.classList.add("js-showQ");
      qPrev.classList.remove("disabled");
    }
  }

  function showPrevQuestion() {
    const prev = document.getElementById("js-prevQuestion-wrapper");
    aWrapper.classList.remove("active");
    prev.classList.add("active");

    qNext.classList.remove("js-showQ");
    qNext.classList.add("js-hidePrev");

    qPrev.classList.add("disabled");
  }

  function hidePrevQuestion() {
    const prev = document.getElementById("js-prevQuestion-wrapper");
    prev.classList.remove("active");
    aWrapper.classList.add("active");

    qNext.classList.remove("js-hidePrev");
    qNext.classList.add("js-showQ");

    qPrev.classList.remove("disabled");
  }

  function showResult() {
    const currentSession = getSessionData();

    const questions = document.getElementById("result-questions").querySelector("tbody");
    const judgeElm = document.getElementById("display-judge");

    helpButton.classList.add("disabled");

    setDisplayParameters("Result", "", qsetting.value, qlist.value);

    if (currentSession.result) {
      judgeElm.classList.remove("correct");
      judgeElm.classList.remove("wrong");

      questions.innerHTML = "";
      currentSession.result.forEach((Q) => {
        const tr = document.createElement("tr");
        const groupElm = document.createElement("td");
        const memberElm = document.createElement("td");
        const judgeElm = document.createElement("td");

        const group = data[Q.group];
        const member = data[Q.group].members[Q.member];

        groupElm.textContent = group.name;
        memberElm.textContent = member.name;
        judgeElm.classList.add("result-judge");
        judgeElm.classList.add(Q.correct ? "correct" : "wrong");

        tr.appendChild(groupElm);
        tr.appendChild(memberElm);
        tr.appendChild(judgeElm);

        tr.setAttribute(
          "onclick",
          'setResultAnswer(event,data["' + Q.group + '"].members["' + Q.member + '"], "result-")',
        );

        questions.appendChild(tr);
      });
    }

    const scoreElms = document.getElementById("result-score").querySelectorAll("span");
    scoreElms[0].textContent = currentSession.correct ?? 0;
    scoreElms[1].textContent = "/" + currentSession.questioning;

    if (currentSession.result) {
      document.getElementById("result-wrapper").classList.add("active");
      aWrapper.classList.remove("active");
    }
    qNext.classList.add("disabled");
  }

  /* select mode */
  const questionControl = document.getElementById("question-control");
  const answerSelectButtons = questionControl.querySelector(".mode-select").querySelectorAll("button");

  answerSelectButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const answerId = button.getAttribute("data-id");

      showAnswer();
      judgeAnswer(answerId);
    });
  });

  function judgeAnswer(answer) {
    const currentSession = getSessionData();
    const currentGroupId = currentQ.value.split("-")[0];
    const currentMemberId = currentQ.value.split("-")[1];

    const dJudge = document.getElementById("display-judge");

    if (!currentSession["result"]) {
      currentSession["result"] = [];
    }

    console.log("input:", answer, "answer:", currentMemberId);
    if (answer === currentMemberId) {
      aJudge.classList.remove("wrong");
      aJudge.classList.add("correct");
      dJudge.classList.remove("wrong");
      dJudge.classList.add("correct");

      if (!currentSession["correct"]) {
        currentSession["correct"] = 1;
      } else {
        currentSession["correct"] += 1;
      }

      currentSession["result"].push({ group: currentGroupId, member: currentMemberId, correct: true });
    } else {
      aJudge.classList.remove("correct");
      aJudge.classList.add("wrong");
      dJudge.classList.remove("correct");
      dJudge.classList.add("wrong");

      if (!currentSession["wrong"]) {
        currentSession["wrong"] = 1;
      } else {
        currentSession["wrong"] += 1;
      }
      currentSession["result"].push({ group: currentGroupId, member: currentMemberId, correct: false });
    }

    setSessionData(currentSession);
  }

  /* input mode */

  const answerSend = document.getElementById("answerSend");

  answerSend.addEventListener("click", () => {
    const input = answerSend.parentNode.querySelector("input");

    console.log(sanitizeInput(input.value));

    const sanitized = sanitizeInput(input.value);
    if (sanitized != "") {
      showAnswer();
      judgeInputAnswer(sanitized);
    }
  });

  function judgeInputAnswer(inputAnswer) {
    judgeAnswer(convertInputAnswerToId(inputAnswer));
  }

  let isIMEActive = false;

  aInput.addEventListener("compositionstart", () => {
    isIMEActive = true;
  });

  aInput.addEventListener("compositionend", () => {
    isIMEActive = false;
  });

  aInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !isIMEActive) {
      event.preventDefault();
      answerSend.dispatchEvent(new Event("click"));
    }
  });
});

/*-----------------*/
/*    functions    */
/*-----------------*/

function initializeRandomArray(list) {
  const usingGroupList = [];
  const usingMemberList = {};

  const groups = Object.keys(data);
  const checked_member = JSON.parse(localStorage.getItem("checked_member"));
  const marked_member = JSON.parse(localStorage.getItem("marked_member"));

  const mode = document.getElementById("q-mode").value;

  const qshown = document.getElementById("q-shown");

  const groupChecks = document.getElementById("setting-checkboxes").querySelectorAll("input[name='setting-group']");
  const asignedGroups = [];
  groupChecks.forEach((group) => {
    if (group.checked) {
      asignedGroups.push(group.id.replace("setting-", ""));
    }
  });

  const shown_member = qshown.value != "" ? JSON.parse(qshown.value) : [];

  for (let i = 0; i < groups.length; i++) {
    usingGroupList.push(groups[i]);
    usingMemberList[groups[i]] = [];

    const members = Object.keys(data[groups[i]].members);
    for (let j = 0; j < data[groups[i]].n; j++) {
      if (list === "full") {
        usingMemberList[groups[i]].push(members[j]);
      } else if (list === "all" && checked_member.indexOf(members[j]) < 0 && asignedGroups.indexOf(groups[i]) >= 0) {
        if (mode === "memory") {
          usingMemberList[groups[i]].push(members[j]);
        } else {
          if (shown_member.indexOf(members[j]) < 0) {
            usingMemberList[groups[i]].push(members[j]);
          }
        }
      } else if (list === "random10") {
        if (shown_member.indexOf(members[j]) < 0 && asignedGroups.indexOf(groups[i]) >= 0) {
          usingMemberList[groups[i]].push(members[j]);
        }
      } else if (
        list === "checked" &&
        checked_member.indexOf(members[j]) >= 0 &&
        shown_member.indexOf(members[j]) < 0 &&
        asignedGroups.indexOf(groups[i]) >= 0
      ) {
        usingMemberList[groups[i]].push(members[j]);
      } else if (
        list === "marked" &&
        marked_member.indexOf(members[j]) >= 0 &&
        shown_member.indexOf(members[j]) < 0 &&
        asignedGroups.indexOf(groups[i]) >= 0
      ) {
        usingMemberList[groups[i]].push(members[j]);
      }
    }
  }

  for (let i = 0; i < groups.length; i++) {
    if (usingMemberList[groups[i]].length == 0) {
      const target = usingGroupList.indexOf(groups[i]);
      usingGroupList.splice(target, 1);
      delete usingMemberList[groups[i]];
    }
  }

  console.log({ groups: usingGroupList, members: usingMemberList });

  return { groups: usingGroupList, members: usingMemberList };
}

function listToOneArray(usingList) {
  const usingGroupList = usingList.groups;
  const usingMemberList = usingList.members;

  const result = [];
  usingGroupList.forEach((group) => {
    usingMemberList[group].forEach((member) => {
      result.push(group + "-" + member);
    });
  });
  return result;
}

function getDataRandom(usingList, avoidMember = []) {
  const sessionData = getSessionData();

  const usingGroupList = usingList.groups;
  const usingMemberList = usingList.members;

  const qNext = document.getElementById("question-next");

  if (!usingGroupList || !usingMemberList || sessionData.usingListSizeOnStart.m === 0) {
    showAlert("表示するメンバー情報がありません。", "error", true);
    return null_member;
  }

  const listArray = listToOneArray(usingList);

  if (sessionData.usingListSizeOnStart.m > 0 && listArray.length === 0) {
    if (sessionData.mode === "memory" && (sessionData.list === "checked" || sessionData.list === "marked")) {
      showAlert("リスト内のメンバーを全て表示しました。");
      qNext.classList.add("disabled");
    }
    return null_member;
  }

  const avoidedArray = [];

  listArray.forEach((member) => {
    if (avoidMember.indexOf(member) < 0) {
      avoidedArray.push(member);
    }
  });

  console.log(avoidedArray);

  const avoidedSize = avoidedArray.length;
  let m = Math.floor(Math.random() * avoidedSize);

  const group = avoidedArray[m].split("-")[0];
  const member = avoidedArray[m].split("-")[1];

  data[group].members[member].group = data[group].name;
  data[group].members[member].groupid = group;

  return data[group].members[member];
}

function getListSize(usingList) {
  const usingGroupList = usingList.groups;
  const usingMemberList = usingList.members;

  let m = 0;
  for (let i = 0; i < usingGroupList.length; i++) {
    m += usingMemberList[usingGroupList[i]].length;
  }

  return { g: usingGroupList.length, m: m };
}

function removeMember(group, member, usingList) {
  const usingGroupList = usingList.groups;
  const usingMemberList = usingList.members;
  const checked_member = JSON.parse(localStorage.getItem("checked_member"));

  console.log("remove", group, member, usingList, usingMemberList[group]);

  if (usingMemberList[group]) {
    const m = usingMemberList[group].indexOf(member);
    if (m >= 0) {
      usingMemberList[group].splice(m, 1);
    }

    if (usingMemberList[group].length === 0) {
      const g = usingGroupList.indexOf(group);
      if (g >= 0) {
        usingGroupList.splice(g, 1);
      }
    }
  }

  if (checked_member.indexOf(member) < 0) {
    checked_member.push(member);
    localStorage.setItem("checked_member", JSON.stringify(checked_member));
  }
}
function addMember(group, member, usingList) {
  const usingGroupList = usingList.groups;
  const usingMemberList = usingList.members;
  const checked_member = JSON.parse(localStorage.getItem("checked_member"));

  console.log("add", group, member);

  const g = usingGroupList.indexOf(group);
  if (g < 0) {
    usingGroupList.push(group);
  }

  if (usingMemberList[group]) {
    const m = usingMemberList[group].indexOf(member);

    if (m < 0) {
      usingMemberList[group].push(member);
    }
  }

  const c = checked_member.indexOf(member);
  if (c >= 0) {
    checked_member.splice(c, 1);
    localStorage.setItem("checked_member", JSON.stringify(checked_member));
  }
}

function markMember(group, member) {
  const marked_member = JSON.parse(localStorage.getItem("marked_member"));
  marked_member.push(member);
  localStorage.setItem("marked_member", JSON.stringify(marked_member));
}

function unmarkMember(group, member) {
  const marked_member = JSON.parse(localStorage.getItem("marked_member"));
  const c = marked_member.indexOf(member);
  if (c >= 0) {
    marked_member.splice(c, 1);
    localStorage.setItem("marked_member", JSON.stringify(marked_member));
  }
}

function setQuestion(member) {
  const checked_member = JSON.parse(localStorage.getItem("checked_member"));
  const marked_member = JSON.parse(localStorage.getItem("marked_member"));

  const questionControl = document.getElementById("question-control");

  const mode = questionControl.getAttribute("data-mode");

  const qImgElm = document.getElementById("question-image");
  const qTextElm = document.getElementById("question-text");
  qTextElm.innerHTML = "";

  const questionStatus = document.getElementById("question-status").querySelector("span");

  if (checked_member.includes(member.id)) {
    questionStatus.classList.add("check");
  } else {
    questionStatus.classList.remove("check");
  }
  if (marked_member.includes(member.id)) {
    questionStatus.classList.add("marked");
  } else {
    questionStatus.classList.remove("marked");
  }

  if (document.getElementById("setting-artist_photo").checked) {
    qImgElm.querySelector("img").setAttribute("src", member.visual);
    qTextElm.classList.remove("active");
  } else if (document.getElementById("setting-other_photo").checked) {
    if (member.images.length > 0) {
      const random_i = Math.floor(Math.random() * member.images.length);

      qImgElm.querySelector("img").setAttribute("src", imagePath + member.id + "/" + member.images[random_i]);
    } else {
      qImgElm.querySelector("img").setAttribute("src", member.visual);
    }
    qTextElm.classList.remove("active");
  } else {
    const p1 = document.createElement("p");
    const p2 = document.createElement("p");
    if (document.getElementById("setting-color").checked) {
      const colorcode = COLOR_CODES[member.colorName] ?? COLOR_CODES[member.color];
      qTextElm.style.borderColor = colorcode;
      qTextElm.style.color = colorcode;

      p1.textContent = member.group;
      p2.textContent = member.colorName;
      qTextElm.appendChild(p1);
      qTextElm.appendChild(p2);
      qTextElm.classList.remove("copy");
      qTextElm.classList.add("active");
    } else if (document.getElementById("setting-copy").checked) {
      p1.textContent = member.copy;
      qTextElm.appendChild(p1);
      qTextElm.classList.add("copy");
      qTextElm.classList.add("active");
    }
  }

  if (mode === "select") {
    const buttons = questionControl.querySelector(".mode-select").querySelectorAll("button");
    const random1in4 = Math.floor(4 * Math.random());
    const avoid = [];
    avoid.push(member.groupid + "-" + member.id);
    buttons.forEach((button, i) => {
      if (i === random1in4) {
        button.textContent = member.name;
        button.setAttribute("data-id", member.id);
      } else {
        const fullList = initializeRandomArray("full");

        console.log(fullList, avoid);

        const wrongMember = getDataRandom(fullList, avoid);
        button.textContent = wrongMember.name;
        button.setAttribute("data-id", wrongMember.id);
        avoid.push(wrongMember.groupid + "-" + wrongMember.id);
      }
    });
  }
}

function setAnswer(member, onResultDisplay = "") {
  const checked_member = JSON.parse(localStorage.getItem("checked_member"));
  const marked_member = JSON.parse(localStorage.getItem("marked_member"));
  const aImgElm = document.getElementById(onResultDisplay + "answer-image");
  const aTitleElm = document.getElementById(onResultDisplay + "answer-title");
  const aDetailElm = document.getElementById(onResultDisplay + "answer-detail");

  const aGroupElm = document.getElementById(onResultDisplay + "answer-group");

  const aPositionElm = document.getElementById(onResultDisplay + "position");
  const aColorElm = document.getElementById(onResultDisplay + "color");
  const aBirthdayElm = document.getElementById(onResultDisplay + "birthday");
  const aCopyElm = document.getElementById(onResultDisplay + "copy");
  const aSNSElms = document.getElementById(onResultDisplay + "sns").querySelectorAll("a");

  const answerStatus = document.getElementById("answer-status").querySelector("span");
  const answerCheck = document.getElementById("answer-check");
  const answerMark = document.getElementById("answer-marked");

  if (checked_member.includes(member.id)) {
    answerStatus.classList.add("check");
    answerCheck.classList.add("js-removing");
  } else {
    answerStatus.classList.remove("check");
    answerCheck.classList.remove("js-removing");
  }
  if (marked_member.includes(member.id)) {
    answerStatus.classList.add("marked");
    answerMark.classList.add("js-removing");
  } else {
    answerStatus.classList.remove("marked");
    answerMark.classList.remove("js-removing");
  }

  aImgElm.querySelector("img").setAttribute("src", member.visual);

  const span = document.createElement("span");

  aTitleElm.textContent = member.name;
  if (member.kana) {
    span.textContent = "（" + member.kana + "）";
    aTitleElm.appendChild(span);
  }

  if (member.position) {
    aPositionElm.textContent = member.position;
  } else {
    aPositionElm.textContent = "";
  }
  if (member.birthday) {
    aBirthdayElm.textContent = member.birthday;
  } else {
    aBirthdayElm.textContent = "";
  }
  if (member.colorName) {
    aColorElm.querySelector("span").textContent = member.colorName;
    aColorElm.querySelector("span").style.backgroundColor = COLOR_CODES[member.colorName] ?? COLOR_CODES[member.color];

    if (brightness(COLOR_CODES[member.colorName] ?? COLOR_CODES[member.color]) < 0.5) {
      aColorElm.querySelector("span").style.color = "#ffffff";
    } else {
      aColorElm.querySelector("span").style.color = "#000000";
    }
  } else {
    aColorElm.querySelector("span").textContent = "";
    aColorElm.querySelector("span").backgroundColor = "#888888";
  }
  if (member.copy) {
    aCopyElm.style.display = "block";
    aCopyElm.textContent = member.copy;
  } else {
    aCopyElm.style.display = "none";
  }

  const snsUrls = {
    xid: "https://x.com/",
    xsub: "https://x.com/",
    ig: "https://instagram.com/",
    tiktok: "https://tiktok.com/@",
  };

  Object.keys(snsUrls).forEach((key, i) => {
    if (member[key] && member[key] != "") {
      aSNSElms[i].classList.remove("disabled");
      aSNSElms[i].href = snsUrls[key] + member[key];
      aSNSElms[i].setAttribute("rel", "noopener noreferrer");
      aSNSElms[i].setAttribute("target", "blank_");
    } else {
      aSNSElms[i].href = "";
      aSNSElms[i].classList.add("disabled");
    }
  });

  aGroupElm.textContent = member.group ?? data[getGroupIDbyMemberID(member.id)].name;
}

function setResultAnswer(e, member, onResultDisplay) {
  const oldTarget = document.querySelector(".js-resultQuestion-active");

  if (oldTarget) {
    oldTarget.classList.remove("js-resultQuestion-active");
  }

  const target = e.target.closest("tr");
  target.classList.add("js-resultQuestion-active");

  setAnswer(member, onResultDisplay);

  if (onResultDisplay != "") {
    const targetTop = target.getBoundingClientRect().top;
    const targetHeight = target.getBoundingClientRect().height;
    const scrollTop = window.scrollY;
    const outer = document.getElementById(onResultDisplay + "answer-outer");

    outer.classList.remove("closed");

    console.log(targetTop, scrollTop, window.innerHeight);

    if (targetTop < window.innerHeight / 2) {
      outer.style.transform = "translateY(" + Number(scrollTop + targetTop - targetHeight / 2) + "px)";
    } else {
      outer.style.transform =
        "translateY(" +
        Number(scrollTop + targetTop - targetHeight * 1.5 - outer.getBoundingClientRect().height) +
        "px)";
    }
  }
}

function closeResultAnswer() {
  const outer = document.getElementById("result-answer-outer");

  outer.classList.add("closed");
}

function convertInputAnswerToId(inputA) {
  for (const group of Object.keys(data)) {
    for (const member of Object.keys(data[group].members)) {
      if (inputA.replaceAll(" ", "").replaceAll("･", "・") === data[group].members[member].name.replaceAll(" ", "")) {
        return data[group].members[member].id;
      }
    }
  }
  return "";
}

function setDisplayParameters(questioned, N, setting, list) {
  const display = document.getElementById("header-display");
  display.innerHTML = "";

  const icons = {
    all: "group",
    random10: "ten",
    checked: "check",
    marked: "marked",
    artist_photo: "profile",
    other_photo: "photo",
    color: "penlight",
    copy: "chat",
  };

  const iconsElm = document.createElement("div");
  const settingElm = document.createElement("span");
  const listElm = document.createElement("span");

  settingElm.classList.add("icon");
  settingElm.classList.add(icons[setting]);

  listElm.classList.add("icon");
  listElm.classList.add(icons[list]);

  iconsElm.appendChild(settingElm);
  iconsElm.appendChild(listElm);
  iconsElm.id = "display-icons";

  const counter = document.createElement("div");
  const span = document.createElement("span");

  counter.id = "display-counter";

  counter.textContent = questioned;
  if (N != "") {
    span.textContent = " / " + N;
    counter.appendChild(span);
  }

  const judgeElm = document.createElement("div");
  judgeElm.id = "display-judge";

  display.appendChild(iconsElm);
  display.appendChild(counter);

  display.appendChild(judgeElm);
}

function showAlert(message, type = "", gohome = false) {
  const alertControl = document.getElementById("alert-control");
  const alertController = document.getElementById("alert-controller");
  const alertWrapper = document.getElementById("alert-wrapper");
  const alertMessage = document.getElementById("alert-message");

  alertControl.checked = true;

  alertMessage.textContent = message;
  alertWrapper.classList.remove(...alertWrapper.classList);
  if (type != "") {
    alertWrapper.classList.add(type);
  }

  if (gohome) {
    alertControl.classList.add("js-go-home");
  } else {
    alertControl.classList.remove("js-go-home");
  }
  alertController.querySelector("label").focus();
}

function sanitizeInput(input) {
  const regex = /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uFF10-\uFF19\u3000-\u303F･・ー]+$/;
  if (input === "") {
    showAlert("解答が入力されていません", "error");
    return "";
  } else if (regex.test(input)) {
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  } else {
    showAlert("入力できない記号等が使用されています。", "error");
    return "";
  }
}

function brightness(hex) {
  if (!hex) {
    return 0;
  }
  const rgb = hex.substring(1);
  const r = parseInt(rgb.substring(0, 2), 16);
  const g = parseInt(rgb.substring(2, 4), 16);
  const b = parseInt(rgb.substring(4, 6), 16);
  const result = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return result;
}

function noscroll(e) {
  e.preventDefault();
}
