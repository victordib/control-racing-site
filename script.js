const transition = document.querySelector(".page-transition");

/* ========================= */
/* LINKS NORMAIS */
/* ========================= */

document.querySelectorAll("a").forEach(link => {

  const href = link.getAttribute("href");

  if (
    href &&
    !href.startsWith("#") &&
    !href.startsWith("http")
  ){

    link.addEventListener("click", function(e){

      if(!transition) return;

      e.preventDefault();

      transition.classList.add("active");

      setTimeout(() => {

        window.location.href = href;

      }, 450);

    });

  }

});

/* ========================= */
/* ENTRADA SUAVE */
/* ========================= */

window.addEventListener("pageshow", () => {

  if(transition){

    transition.classList.remove("active");

  }

});

/* ========================= */
/* FADE LINKS */
/* ========================= */

const fadeLinks =
document.querySelectorAll(".fade-link");

fadeLinks.forEach((link) => {

  link.addEventListener("click", (e) => {

    const transition =
    document.querySelector(".page-transition");

    if(!transition) return;

    e.preventDefault();

    transition.classList.add("active");

    setTimeout(() => {

      window.location.href =
      link.href;

    }, 450);

  });

});