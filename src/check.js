function getMessage(a, b) {
  switch (typeof a) {
    case "boolean":
      return a ? ("Я попал в " + b) : ("Я никуда не попал");

    case "number":
      return "Я прыгнул на " + a * 1000 + " сантиметров";
  }
  if (Array.isArray(a)) {
    if (Array.isArray(b)) {
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
