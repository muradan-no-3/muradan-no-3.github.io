window.addEventListener("DOMContentLoaded", () => {
  const action = document.getElementById("js-search-action");
  const idSearch = document.getElementById("idsearch-list");
  const checkAll = document.getElementById("idsearch-checkAll");

  Object.keys(data).forEach((groupid) => {
    const groupOuter = document.createElement("div");
    const ul = document.createElement("ul");
    const checkAllLabel = document.createElement("label");
    const checkAllInput = document.createElement("input");

    const group = data[groupid];

    groupOuter.classList.add("idSearch-group-outer");

    checkAllInput.setAttribute("type", "checkbox");
    checkAllInput.setAttribute("value", groupid);
    checkAllInput.classList.add("visually-hidden");

    checkAllInput.setAttribute("onchange", "toggleAll(event)");

    checkAllLabel.appendChild(checkAllInput);
    checkAllLabel.innerHTML += group.name;
    groupOuter.appendChild(checkAllLabel);

    Object.keys(group.members).forEach((memberid) => {
      const li = document.createElement("li");
      const label = document.createElement("label");
      const input = document.createElement("input");

      input.setAttribute("type", "checkbox");
      input.setAttribute("value", memberid);
      input.setAttribute("onchange", "setSearchID()");
      input.classList.add("visually-hidden");

      label.appendChild(input);
      label.innerHTML += group.members[memberid].name;

      li.appendChild(label);
      ul.appendChild(li);
    });
    groupOuter.appendChild(ul);
    idSearch.appendChild(groupOuter);
  });

  checkAll.addEventListener("change", (e) => {
    toggleAll(e);
  });
  action.addEventListener("click", () => {
    displaySearchResult();
  });

  const inputBirthMonth = document.getElementById("search-birthmonth");
  const sortToggle = document.getElementById("sort-by-birthday");

  inputBirthMonth.addEventListener("change", () => {
    if (inputBirthMonth.value != "") {
      sortToggle.checked = true;
    }
  });
});

function displaySearchResult() {
  const wrapper = document
    .getElementById("members-list-wrapper")
    .querySelector(".members-wrapper");
  wrapper.innerHTML = "";

  const isShowDetail = document.getElementById("setting-detail").checked;
  const isShowExMember = document.getElementById("setting-exmember").checked;

  const inputClasses = document.querySelectorAll("input[name='search-class']");
  const classes = [];
  inputClasses.forEach((ipt) => {
    if (ipt.checked) {
      classes.push(Number(ipt.value));
    }
  });
  const inputColors = document.querySelectorAll("input[name='search-color']");
  const colors = [];
  for (let ipt of inputColors) {
    if (ipt.checked) {
      if (ipt.value === "all") {
        break;
      } else if (ipt.value === "特殊") {
        colors.push(...["薔薇色", "灰色", "黒", "橙", "真紅", "桜色"]);
        break;
      } else {
        colors.push(ipt.value);
        break;
      }
    }
  }

  const inputBirthMonth = document.getElementById("search-birthmonth");
  const sortToggle = document.getElementById("sort-by-birthday");

  const inputID = document.getElementById("search-id").value;

  const members = [];
  Object.keys(data).forEach((groupid) => {
    const group = data[groupid];
    Object.keys(group.members).forEach((memberid) => {
      const birthArray = group.members[memberid].birthday.split("/");
      group.members[memberid]["birthkey"] =
        birthArray[0].padStart(2, "0") + birthArray[1].padStart(2, "0");

      group.members[memberid]["class"] = group.class;

      members.push(group.members[memberid]);
    });
  });

  if (!sortToggle.checked) {
    Object.keys(data).forEach((groupid) => {
      const group = data[groupid];
      Object.keys(group.members).forEach((memberid) => {
        const member = group.members[memberid];
        const birthMonth = member.birthday.split("/")[0];
        const IDs = inputID.split(",");
        if (inputID === "") {
          if (
            classes.indexOf(group.class) >= 0 &&
            (colors.length === 0 ||
              colors.indexOf(member.color) >= 0 ||
              colors.indexOf(member.colorName) >= 0) &&
            (inputBirthMonth.value === "" ||
              inputBirthMonth.value === birthMonth)
          ) {
            addMember(member.id, isShowDetail, isShowExMember);
          }
        } else {
          IDs.forEach((id) => {
            if (member.id === id) {
              addMember(member.id, isShowDetail, isShowExMember);
            }
          });
        }
      });
    });
  } else {
    const sortedByMonth = objectQuickSort(members, "birthkey");
    sortedByMonth.forEach((member) => {
      const birthMonth = member.birthday.split("/")[0];
      const IDs = inputID.split(",");
      if (inputID === "") {
        if (
          classes.indexOf(member.class) >= 0 &&
          (colors.length === 0 ||
            colors.indexOf(member.color) >= 0 ||
            colors.indexOf(member.colorName) >= 0) &&
          (inputBirthMonth.value === "" || inputBirthMonth.value === birthMonth)
        ) {
          addMember(member.id, isShowDetail, isShowExMember);
        }
      } else {
        IDs.forEach((id) => {
          if (member.id === id) {
            addMember(member.id, isShowDetail, isShowExMember);
          }
        });
      }
    });
  }
}

function addMember(id, isShowDetail = true, isShowExMember = true) {
  const wrapper = document
    .getElementById("members-list-wrapper")
    .querySelector(".members-wrapper");

  let memberid = "";
  let groupid = "";

  group: for (let group of Object.keys(data)) {
    for (let member of Object.keys(data[group].members)) {
      if (id === member) {
        memberid = member;
        groupid = group;
        break group;
      }
    }
  }

  if (memberid != "" && groupid != "") {
    const member = data[groupid].members[memberid];
    const memberOuter = document.createElement("div");
    memberOuter.classList.add("member-outer");

    const memberImgElm = document.createElement("div");
    memberImgElm.classList.add("member-img");
    const colorcode =
      COLOR_CODES[member.colorName] ?? COLOR_CODES[member.color];
    memberImgElm.style.borderColor = colorcode;

    const memberColorElm = document.createElement("span");
    memberColorElm.textContent = member.colorName;
    memberColorElm.style.backgroundColor = colorcode;
    memberImgElm.appendChild(memberColorElm);

    if (brightness(colorcode) < 0.5) {
      memberColorElm.style.color = "#ffffff";
    } else {
      memberColorElm.style.color = "#000000";
    }

    if (member.join || member.graduated) {
      const memberJoinElm = document.createElement("div");
      memberJoinElm.classList.add("member-join");
      memberJoinElm.innerHTML =
        (member.join ? member.join.replace("（", "<br>（") : "") +
        (member.join && member.graduated ? "<br>" : "") +
        "〜" +
        (member.graduated ? member.graduated.replace("（", "<br>（") : "");
      memberJoinElm.style.backgroundColor = colorcode;
      memberImgElm.appendChild(memberJoinElm);

      if (brightness(colorcode) < 0.5) {
        memberJoinElm.style.color = "#ffffff";
      } else {
        memberJoinElm.style.color = "#000000";
      }
    }

    const memberImg = document.createElement("img");
    memberImg.setAttribute("src", member.visual + "?ver=" + updated);

    memberImgElm.appendChild(memberImg);
    memberOuter.appendChild(memberImgElm);

    const memberNameElm = document.createElement("div");
    memberNameElm.classList.add("member-title");
    memberNameElm.textContent = member.name;

    if (member.kana) {
      const memberKanaElm = document.createElement("span");
      memberKanaElm.textContent = "（" + member.kana + "）";
      memberNameElm.appendChild(memberKanaElm);
    }

    memberOuter.appendChild(memberNameElm);

    if (member.position) {
      const memberPositionElm = document.createElement("div");
      memberPositionElm.classList.add("position");
      memberPositionElm.textContent = member.position;
      memberOuter.appendChild(memberPositionElm);
    }
    if (isShowDetail) {
      const memberDetail = document.createElement("div");
      memberDetail.classList.add("member-detail");

      const birthdayElm = document.createElement("div");
      birthdayElm.classList.add("icon");
      birthdayElm.classList.add("cake");
      birthdayElm.classList.add("member-birthday");
      birthdayElm.textContent = member.birthday;
      memberDetail.appendChild(birthdayElm);

      const copyElm = document.createElement("div");
      copyElm.classList.add("member-copy");
      copyElm.textContent = member.copy.replaceAll(" ", "");
      memberDetail.appendChild(copyElm);

      const snsListElm = document.createElement("ul");
      snsListElm.classList.add("member-sns");

      const SNSs = [
        { key: "xid", url: "https://x.com/", icon: "xsns-icon.svg" },
        { key: "xsub", url: "https://x.com/", icon: "xsub-icon.svg" },
        { key: "ig", url: "https://instagram.com/", icon: "ig-icon.svg" },
        { key: "tiktok", url: "https://tiktok.com/@", icon: "tiktok-icon.svg" },
      ];

      SNSs.forEach((sns) => {
        const snsElm = document.createElement("li");
        const aSnsElm = document.createElement("a");
        const icon = document.createElement("img");
        icon.src = "./assets/img/icons/" + sns.icon;

        aSnsElm.appendChild(icon);
        snsElm.appendChild(aSnsElm);

        if (member[sns.key] && member[sns.key] != "") {
          aSnsElm.href = sns.url + member[sns.key];
          aSnsElm.setAttribute("rel", "noopener noreferrer");
          aSnsElm.setAttribute("target", "blank_");
        } else {
          aSnsElm.href = "";
          aSnsElm.classList.add("disabled");
        }
        snsListElm.appendChild(snsElm);
      });
      memberDetail.appendChild(snsListElm);

      memberOuter.appendChild(memberDetail);
    }

    if (!member.isActive) {
      memberOuter.classList.add("ex-member");
    }

    memberOuter.addEventListener("animationend", () => {
      memberOuter.classList.add("active");
    });

    if (isShowExMember || (!isShowExMember && member.isActive))
      wrapper.appendChild(memberOuter);
  }
}

function objectQuickSort(data, key, DESCENDING = false) {
  if (data.length <= 1) {
    return data;
  }

  const pivot = data[Math.floor(data.length / 2)];
  const middle = data.filter((row) => row[key] === pivot[key]);

  if (DESCENDING) {
    const left = data.filter((row) => row[key] > pivot[key]);
    const right = data.filter((row) => row[key] < pivot[key]);
    return [
      ...objectQuickSort(left, key, true),
      ...middle,
      ...objectQuickSort(right, key, true),
    ];
  } else {
    const left = data.filter((row) => row[key] < pivot[key]);
    const right = data.filter((row) => row[key] > pivot[key]);
    return [
      ...objectQuickSort(left, key),
      ...middle,
      ...objectQuickSort(right, key),
    ];
  }
}

function toggleAll(e) {
  target = e.target.parentNode;

  const checkboxes = target.nextElementSibling.querySelectorAll(
    "input[type='checkbox']"
  );

  const checkAll = target.querySelector("input[type='checkbox']");

  checkboxes.forEach((ipt) => {
    if (checkAll.checked) {
      ipt.checked = true;
    } else {
      ipt.checked = false;
    }

    ipt.dispatchEvent(new Event("change"));
  });
}

function setSearchID() {
  const target = document.getElementById("search-id");
  const h3 = document.getElementById("idsearch-h3");
  let result = "";
  const checkboxList = document
    .getElementById("idsearch-list")
    .querySelectorAll("ul");

  h3.classList.remove("active");
  checkboxList.forEach((ul) => {
    const checkboxes = ul.querySelectorAll("input[type='checkbox']");

    checkboxes.forEach((ipt) => {
      if (ipt.checked) {
        result += ipt.value + ",";
        h3.classList.add("active");
      }
    });
  });

  target.value = result;
}
