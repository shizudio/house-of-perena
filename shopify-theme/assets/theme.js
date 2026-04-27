/* Nav scroll */
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60);
});

/* Hamburger */
let open = false;
document.getElementById('hbg').addEventListener('click', () => {
  open = !open;
  document.getElementById('hbg').classList.toggle('open', open);
  document.getElementById('drawer').classList.toggle('open', open);
});
