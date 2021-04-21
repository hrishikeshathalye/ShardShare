var steps = [];
var arr = [
  {
    id: "first",
    attachTo: {
      element: "#secretName",
      on: "bottom",
    },
    title: "Name of a secret.",
    text: "This is the name set by creator of the secret.",
  },
  {
    id: "second",
    attachTo: {
      element: "#secretId",
      on: "bottom",
    },
    title: "Secret Id",
    text: "This is the unique identifier generated for each secret.",
  },
  {
    id: "third",
    attachTo: {
      element: "#participants",
      on: "bottom",
    },
    title: "Secret Participants.",
    text:
      "Hover here to look at emails of participants involved in the secret.",
  },
  {
    id: "fourth",
    attachTo: {
      element: "#date",
      on: "bottom",
    },
    title: "Date",
    text:
      "This is the date on which the secret was created by the owner of the secret.",
  },
  {
    id: "fifth",
    attachTo: {
      element: "#shard",
      on: "bottom",
    },
    title: "Type your shard.",
    text: "Copy paste the shard you received for this secret.",
  },
  {
    id: "sixth",
    attachTo: {
      element: "#accept",
      on: "bottom",
    },
    title: "Accept request.",
    text:
      "By accepting the request you will send the shard you typed to the recovery requester.",
  },
  {
    id: "seventh",
    attachTo: {
      element: "#reject",
      on: "bottom",
    },
    title: "Reject request.",
    text:
      "This will inform requester that you have rejected the request. Once rejected is forever rejected unless re-requested.",
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
exports.recoveryRequestSteps = steps;
