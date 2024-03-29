var steps = [];
var arr = [
  {
    id: "first",
    attachTo: {
      element: "#createSecret",
      on: "bottom",
    },
    title: "Creating A New Secret",
    text:
      "Use this menu if you want to use a new secret. This menu will ask you for the secret name, the secret and the participants.",
  },
  {
    id: "second",
    attachTo: {
      element: "#yourSecrets",
      on: "bottom",
    },
    title: "Viewing Secrets Shared By You",
    text:
      "This menu contains all the sccrets that you have shared with others so you can keep track what you have shared or modify and reshare the secret.",
  },
  {
    id: "third",
    attachTo: {
      element: "#sharedWithYou",
      on: "bottom",
    },
    title: "Viewing Secrets Shared With You",
    text:
      "This menu contains all the secrets shared with you by others, you can also request recovery of a key from here.",
  },
  {
    id: "fourth",
    attachTo: {
      element: "#recoveryRequests",
      on: "bottom",
    },
    title: "Viewing All Pending Recovery Requests",
    text:
      "This menu shows all the recovery requests pending to be approved/rejected by you. These are keys that other people want to recover.",
  },
];
function createSteps(arr) {
  for (let i = 0; i < arr.length; i++) {
    let tmp = {
      id: arr[i].id,
      attachTo: arr[i].attachTo,
      beforeShowPromise: function () {
        return new Promise(function (resolve) {
          setTimeout(function () {
            window.scrollTo(0, 0);
            resolve();
          }, 250);
        });
      },
      buttons: [
        {
          classes: "shepherd-button-primary",
          text: "Back",
          type: "back",
        },
        {
          classes: "shepherd-button-primary",
          text: "Next",
          type: "next",
        },
      ],
      classes: "custom-class-name-1 custom-class-name-2",
      highlightClass: "highlight",
      scrollTo: false,
      cancelIcon: {
        enabled: true,
      },
      title: arr[i].title,
      text: arr[i].text,
      when: {
        show: () => {},
        hide: () => {},
      },
    };
    steps.push(tmp);
  }
}
createSteps(arr);
exports.dashboardSteps = steps;
