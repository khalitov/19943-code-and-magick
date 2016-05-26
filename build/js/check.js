function getMessage(a, b) {
  switch (typeof a) {
    case "boolean":
      return a ? ("Я попал в " + b) : ("Я никуда не попал");

    case "number":
      return "Я прыгнул на " + a * 100 + " сантиметров";

    case "number":
      return "Я прыгнул на " + a * 100 + " сантиметров";

    case "object":
      {
        if (typeof b === "object") {
          var length = 0;
          for (var i = 0; i < a.length; i++) {
            length += a[i] * b[i];
          }
          return "Я прошёл " + length + " шагов";
        }

        var sum = 0;
        for (var i = 0; i < a.length; i++) {
          sum += a[i];
        }
        return "Я прошёл " + sum + " шагов";
      }
  }

  // if (typeof a === "boolean") {
  //   return a ? ("Я попал в " + b) : ("Я никуда не попал");
  // };
  //
  // if (typeof a === "number") {
  //   return "Я прыгнул на " + a * 100 + " сантиметров";
  // };
  //
  // if ((typeof a === "object") && (typeof b !== "object")) {
  //   var sum = 0;
  //   for (var i = 0; i < a.length; i++) {
  //     sum += a[i];
  //   }
  //   return "Я прошёл " + sum + " шагов";
  // };
  //
  // if ((typeof a === "object") && (typeof b === "object")) {
  //   var length = 0;
  //   for (var i = 0; i < a.length; i++) {
  //     length += a[i] * b[i];
  //   }
  //   return "Я прошёл " + length + " шагов";
  // }
}
