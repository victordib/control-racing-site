import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {

  apiKey: "AIzaSyDaOJQBbu-XwgLkcrsiTkoiCywq9u2mNlA",
  authDomain: "control-racing.firebaseapp.com",
  projectId: "control-racing",

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

window.login = async function(){

  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;

  try{

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    window.location.href = "painel.html";

  }catch(error){

    alert("Login inválido");

  }

}
