document.addEventListener("DOMContentLoaded", function () {
    function onScroll() {
        const howOrderSection = document.querySelector("#howorder");
        if (!howOrderSection) return;
        
        const sectionTop = howOrderSection.getBoundingClientRect().top;
        const triggerPoint = window.innerHeight * 0.75; 

        if (sectionTop < triggerPoint) {
            howOrderSection.classList.add("show");
            window.removeEventListener("scroll", onScroll);
        }
    }

    window.addEventListener("scroll", onScroll);
    onScroll();
});
