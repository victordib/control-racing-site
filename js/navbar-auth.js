import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { firebaseConfig } from "./firebase-config.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* FIREBASE */

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

/* NAVBAR AUTH */

onAuthStateChanged(auth, (user) => {

  const authLink =
  document.getElementById("auth-link");

  if(!authLink) return;

  /* Detecta se está dentro da pasta /pilotos */

  const inPilotosFolder =
  window.location.pathname.includes("/pilotos/");

  const loginPath =
  inPilotosFolder
  ? "../login.html"
  : "login.html";

  const painelPath =
  inPilotosFolder
  ? "../painel.html"
  : "painel.html";

    if(user){

    authLink.innerText = "PAINEL";

    authLink.setAttribute(
        "href",
        painelPath
    );

    }else{

    authLink.innerText = "LOGIN";

    authLink.setAttribute(
        "href",
        loginPath
    );

    }

});

/* PAGE TRANSITION */

const authElement =
document.getElementById("auth-link");

if(authElement){

  authElement.addEventListener("click", (e) => {

    e.preventDefault();

    const target =
    authElement.getAttribute("href");

    const transition =
    document.querySelector(".page-transition");

    transition.classList.add("active");

    setTimeout(() => {

      window.location.href = target;

    }, 500);

  });

}