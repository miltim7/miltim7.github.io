document.addEventListener('DOMContentLoaded', function () {
    var whousSection = document.getElementById('whous');
    var observer = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                whousSection.classList.add('in-view');
                observer.unobserve(whousSection);
            }
        });
    }, { threshold: 0.5 });
    observer.observe(whousSection);
});
    