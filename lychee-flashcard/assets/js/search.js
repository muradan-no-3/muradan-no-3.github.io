window.addEventListener("DOMContentLoaded", () => {
  const action = document.getElementById("js-search-action");

  action.addEventListener("click", () => {
    displaySearchResult();
  });

  const inputBirthMonth = document.getElementById("search-birthmonth");
  const sortToggle = document.getElementById("sort-by-birthday");

  inputBirthMonth.addEventListener("change", () => {
    console.log(inputBirthMonth.value);
    if (inputBirthMonth.value != "") {
      sortToggle.checked = true;
    }
  });
});

function displaySearchResult() {
  const wrapper = document.getElementById("members-list-wrapper").querySelector(".members-wrapper");
  wrapper.innerHTML = "";

  const isShowDetail = document.getElementById("setting-detail").checked;

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
      group.members[memberid]["birthkey"] = birthArray[0].padStart(2, "0") + birthArray[1].padStart(2, "0");

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
        if (
          classes.indexOf(group.class) >= 0 &&
          (colors.length === 0 || colors.indexOf(member.color) >= 0 || colors.indexOf(member.colorName) >= 0) &&
          (inputBirthMonth.value === "" || inputBirthMonth.value === birthMonth)
        ) {
          if (inputID === "") {
            addMember(member.id, isShowDetail);
          } else {
            IDs.forEach((id) => {
              if (member.id === id) {
                addMember(member.id, isShowDetail);
              }
            });
          }
        }
      });
    });
  } else {
    const sortedByMonth = objectQuickSort(members, "birthkey");
    sortedByMonth.forEach((member) => {
      const birthMonth = member.birthday.split("/")[0];
      if (
        classes.indexOf(member.class) >= 0 &&
        (colors.length === 0 || colors.indexOf(member.color) >= 0 || colors.indexOf(member.colorName) >= 0) &&
        (inputBirthMonth.value === "" || inputBirthMonth.value === birthMonth)
      ) {
        addMember(member.id, isShowDetail);
      }
    });
  }
}

function addMember(id, isShowDetail = true) {
  const wrapper = document.getElementById("members-list-wrapper").querySelector(".members-wrapper");

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
    const colorcode = COLOR_CODES[member.colorName] ?? COLOR_CODES[member.color];
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

    if (member.join) {
      const memberJoinElm = document.createElement("div");
      memberJoinElm.classList.add("member-join");
      memberJoinElm.innerHTML = member.join.replace("（", "<br>（") + "〜";
      memberJoinElm.style.backgroundColor = colorcode;
      memberImgElm.appendChild(memberJoinElm);

      if (brightness(colorcode) < 0.5) {
        memberJoinElm.style.color = "#ffffff";
      } else {
        memberJoinElm.style.color = "#000000";
      }
    }

    const memberImg = document.createElement("img");
    memberImg.setAttribute("src", member.visual);

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

    memberOuter.addEventListener("animationend", () => {
      memberOuter.classList.add("active");
    });

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
    return [...objectQuickSort(left, key, true), ...middle, ...objectQuickSort(right, key, true)];
  } else {
    const left = data.filter((row) => row[key] < pivot[key]);
    const right = data.filter((row) => row[key] > pivot[key]);
    return [...objectQuickSort(left, key), ...middle, ...objectQuickSort(right, key)];
  }
}
