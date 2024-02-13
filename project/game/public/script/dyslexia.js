// Transfert entre pages de l'activation ou non du mode dyslexique
const isPressed = window.localStorage.getItem("dyslexic") === 'true';
if(isPressed) {
    document.body.classList.add("dyslexia-mode");
}
// Gestion du bouton en fonction du mode actif
const toggle = document.getElementById("dyslexia-toggle");
if(isPressed) {
    toggle.setAttribute('aria-pressed', 'true');
}
// Réaction à un appui sur le bouton
toggle.addEventListener('click', (e) => {
  let pressed = e.target.getAttribute('aria-pressed') === 'true';
  e.target.setAttribute('aria-pressed', String(!pressed));
  document.body.classList.toggle("dyslexia-mode");
  window.localStorage.setItem("dyslexic", String(!pressed));
});