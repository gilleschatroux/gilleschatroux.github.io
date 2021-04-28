const mobileNavMenu = document.getElementById('mobile-nav-menu');
const navButton = document.getElementById('nav-button')

function toggleMobileNavMenu () {
    mobileNavMenu.classList.toggle('opened');
}

navButton.addEventListener('click', toggleMobileNavMenu)
mobileNavMenu.addEventListener('click', toggleMobileNavMenu)