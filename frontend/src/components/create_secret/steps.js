var steps = [];
var arr = [
  {
    id: "first",
    attachTo: {
      element: "#test0",
      on: "bottom",
    },
    title: "Secret Name",
    text: "Give any name you like to your secret.",
  },
  {
    id: "second",
    attachTo: {
      element: "#test1",
      on: "bottom",
    },
    title: "Enter Secret",
    text:
      "Enter the secret you want to share here. We value your privacy and do not share any secret on our servers, the key shards are sent to participants directly through email.",
  },
  {
    id: "third",
    attachTo: {
      element: "#test2",
      on: "bottom",
    },
    title: "Enter Threshold Values",
    text:
      "'n' is the total number of people you want to add as participants of this secret and 'k' is the minimum number of people who have to accept the request in order to recover the secret.",
  },
  {
    id: "fourth",
    attachTo: {
      element: "#test3",
      on: "bottom",
    },
    title: "Add Participants",
    text:
      "Add the email ids of the people you want to share the secret with in this step.",
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
          action: () => {},
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
exports.createSecretSteps = steps;
