window.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.getElementById("members-list-wrapper");
  Object.keys(data).forEach((group) => {
    const groupWrapper = document.createElement("div");
    const groupNameElm = document.createElement("div");

    const membersWrapper = document.createElement("div");

    groupWrapper.classList.add("group-wrapper");

    membersWrapper.classList.add("members-wrapper");

    groupNameElm.textContent = data[group].name;
    groupWrapper.appendChild(groupNameElm);

    Object.keys(data[group].members).forEach((member) => {
      const memberOuter = document.createElement("div");
      memberOuter.classList.add("member-outer");

      const memberImgElm = document.createElement("div");
      memberImgElm.classList.add("member-img");

      const memberImg = document.createElement("img");
      memberImg.setAttribute("src", data[group].members[member].visual);

      memberImgElm.appendChild(memberImg);

      const memberNameElm = document.createElement("div");
      memberNameElm.textContent = data[group].members[member].name;

      memberOuter.appendChild(memberImgElm);
      memberOuter.appendChild(memberNameElm);
      membersWrapper.appendChild(memberOuter);
    });

    groupWrapper.appendChild(membersWrapper);
    wrapper.appendChild(groupWrapper);
  });
});
