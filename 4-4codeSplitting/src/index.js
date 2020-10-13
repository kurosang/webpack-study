// import _ from "lodash";

// console.log(_.join(["a", "b", "c"], "**"));
// // 此处省略10万行业务
// console.log(_.join(["a", "b", "c"], "**"));

function getComp() {
  return import("lodash").then(({ default: _ }) => {
    var elem = document.createElement("div");
    elem.innerHTML = _.join(["123", "456"], "-");
    return elem;
  });
}

getComp().then((elem) => {
  document.body.appendChild(elem);
});
