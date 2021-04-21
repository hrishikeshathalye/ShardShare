var steps = [];
var arr = [
  {
    id: "first",
    attachTo: {
      element: "#secretName",
      on: "bottom",
    },
    title: "Name of a secret.",
    text: "This is the name set by creator of secret.",
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
      "This is the date on which the secret was created by the onwer of the secret.",
  },
  {
    id: "fifth",
    attachTo: {
      element: "#recover",
      on: "bottom",
    },
    title: "State Of The Secret",
    text:
      "This is the state of this secret. This can be one of :  <br/> 1. <b>Recover</b> - Request all participants to send their part of the secret via email. <br/> 2. <b>Request Pending</b> - People are yet to accept or reject your request. <br/> 3. <b>Recombine</b> - Regenerate the secret using all the shards you received. This is enabled only if threshold number of people have accepted the request.",
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
exports.sharedWithUserSteps = steps;
