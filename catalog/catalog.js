function handleScroll() {
    const catalogContainer = document.querySelector('.catalog-container');
    const rect = catalogContainer.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top <= windowHeight * 0.75) {
        catalogContainer.classList.add('visible');
        window.removeEventListener('scroll', handleScroll);
    }
}

window.handleOrder = function (id) {
    const item = catalogItems.find(item => item.id === id);
    alert(`Оформление заказа: ${item.title}\nСтоимость: ${item.price}`);
};

window.addEventListener('scroll', handleScroll);
createCatalog();
handleScroll();