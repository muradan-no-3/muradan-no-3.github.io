window.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.getElementById("members-list-wrapper");
  let prevClass = 0;
  let currentClass;

  const groupLinks = [
    { key: "xid", url: "https://x.com/", icon: "xsns-icon.svg" },
    { key: "ig", url: "https://instagram.com/", icon: "ig-icon.svg" },
    { key: "tiktok", url: "https://tiktok.com/@", icon: "tiktok-icon.svg" },
    { key: "timetree", url: "https://timetreeapp.com/public_calendars/", icon: "timetree-icon.svg" },
    { key: "youtube", url: "https://youtube.com/@", icon: "youtube-icon.svg" },
  ];

  Object.keys(data).forEach((group) => {
    const groupWrapper = document.createElement("div");
    const groupNameElm = document.createElement("div");

    const membersWrapper = document.createElement("div");

    groupWrapper.classList.add("group-wrapper");
    membersWrapper.classList.add("members-wrapper");

    groupNameElm.textContent = data[group].symbols[0] + " " + data[group].name + " " + data[group].symbols[1];
    groupNameElm.classList.add("group-title");

    const debutElm = document.createElement("span");
    debutElm.textContent = data[group].debut + "〜";

    groupNameElm.appendChild(debutElm);

    groupWrapper.appendChild(groupNameElm);

    const locationElm = document.createElement("div");
    locationElm.classList.add("icon");
    locationElm.classList.add("map-pin");
    locationElm.classList.add("group-location");
    locationElm.textContent = data[group].prefecture;
    groupWrapper.appendChild(locationElm);

    groupNameElm.appendChild(debutElm);

    const groupLinksElm = document.createElement("ul");
    groupLinksElm.classList.add("group-links");

    groupLinks.forEach((link) => {
      const linkElm = document.createElement("li");
      const aLinkElm = document.createElement("a");
      const icon = document.createElement("img");
      icon.src = "./assets/img/icons/" + link.icon;

      aLinkElm.appendChild(icon);
      linkElm.appendChild(aLinkElm);

      if (data[group][link.key] && data[group][link.key] != "") {
        aLinkElm.href = link.url + data[group][link.key];
        aLinkElm.setAttribute("rel", "noopener noreferrer");
        aLinkElm.setAttribute("target", "blank_");
        groupLinksElm.appendChild(linkElm);
      }
    });
    groupWrapper.appendChild(groupLinksElm);

    if (data[group].class != prevClass) {
      const classWrapper = document.createElement("div");
      classWrapper.classList.add("class-wrapper");
      classWrapper.setAttribute("data-class", data[group].class + "期生");
      classWrapper.id = "group-class-wrapper-" + data[group].class;
      classWrapper.appendChild(membersWrapper);
      currentClass = classWrapper;
    }
    prevClass = data[group].class;

    Object.keys(data[group].members).forEach((memberid) => {
      const member = data[group].members[memberid];
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

      membersWrapper.appendChild(memberOuter);
    });

    groupWrapper.appendChild(membersWrapper);

    currentClass.appendChild(groupWrapper);

    wrapper.appendChild(currentClass);
  });
});
