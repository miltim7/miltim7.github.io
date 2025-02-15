const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const icon = item.querySelector('.faq-icon');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
        // Закрываем все остальные, если нужно одно раскрытие за раз:
        faqItems.forEach(i => {
          if (i !== item) {
            i.classList.remove('active');
            i.querySelector('.faq-icon').textContent = '+';
            i.querySelector('.faq-answer').style.maxHeight = null;
          }
        });

        item.classList.toggle('active');
        if (item.classList.contains('active')) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            icon.textContent = '–';
        } else {
            answer.style.maxHeight = null;
            icon.textContent = '+';
        }
    });
});