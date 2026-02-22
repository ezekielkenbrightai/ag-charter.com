/* ========== NAVIGATION SCROLL SPY ========== */
const navLinks = document.querySelectorAll('.charter-nav .nav-link');
const sections = document.querySelectorAll('.section');

function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 120) current = section.id;
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
}
window.addEventListener('scroll', updateActiveNav);

/* ========== ACCORDION TOGGLE ========== */
function toggleDivision(header) {
    const body = header.nextElementSibling;
    const icon = header.querySelector('.toggle-icon');
    body.classList.toggle('open');
    if (body.classList.contains('open')) {
        icon.innerHTML = '&#9660;';
    } else {
        icon.innerHTML = '&#9654;';
    }
}

/* ========== SERVICE FILTER ========== */
function filterServices() {
    const divFilter = document.getElementById('divisionFilter').value;
    const search = document.getElementById('serviceSearch').value.toLowerCase();
    document.querySelectorAll('.service-division').forEach(div => {
        const matchesDivision = !divFilter || div.dataset.division === divFilter;
        if (!matchesDivision) {
            div.style.display = 'none';
            return;
        }
        if (!search) {
            div.style.display = '';
            return;
        }
        const text = div.textContent.toLowerCase();
        div.style.display = text.includes(search) ? '' : 'none';
    });
}

/* ========== SMOOTH SCROLL FOR NAV ========== */
navLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            const offset = document.querySelector('.header').offsetHeight + 10;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});
