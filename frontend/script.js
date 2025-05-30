document.querySelector('.menu').addEventListener('click', function() {
    var navbar = document.getElementById('navbar');
    if (navbar.style.display === 'block') {
        navbar.style.display = 'none';
    } 
    else {
        navbar.style.display = 'block';
    }
});