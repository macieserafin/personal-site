function toggleMenu() {
    var menu = document.getElementById("nav-list");
    menu.classList.toggle("show");}

//footer
document.getElementById("year").textContent = new Date().getFullYear();

document.querySelector('.certificate-img').addEventListener('click', function() {
  this.classList.toggle('active');
});