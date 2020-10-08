import avatar from "./avatar.jpg";
// import "./index.scss";
import style from "./index.scss";
import createAvatar from "./createAvatar";
console.log(style, style.avatar);
createAvatar();

var img = new Image();
img.src = avatar;
img.classList.add(style.avatar);

var root = document.getElementById("root");
root.append(img);
