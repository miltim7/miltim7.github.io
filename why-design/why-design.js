document.addEventListener('DOMContentLoaded', function() {
    var whyDesignSection = document.getElementById('why-design');
    var itemsContainer = whyDesignSection.querySelector('.why-design-items');
    var observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if(entry.isIntersecting) {
                itemsContainer.classList.add('animate');
                observer.unobserve(whyDesignSection);
            }
        });
    }, { threshold: 0.5 });
    observer.observe(whyDesignSection);
});
