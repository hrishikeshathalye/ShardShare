var steps = [];
var arr = [
  {
    id: "first",
    attachTo: {
      element: "#secret_texts",
      on: "bottom",
    },
    title: "Input shards",
    text:
      "Input all the shards you have received on email due to acceptance of your request by participants of the secret.",
  },
  {
    id: "second",
    attachTo: {
      element: "#generate",
      on: "bottom",
    },
    title: "Generate original secret.",
    text:
      "Using the shards you have entered, the original secret will be regenrated and you'll be able to view it!",
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
exports.recombineSteps = steps;
