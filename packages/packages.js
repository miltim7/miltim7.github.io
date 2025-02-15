document.addEventListener('DOMContentLoaded', function() {
  const slider = document.querySelector('.slider');
  const sliderTrack = document.querySelector('.slider-track');
  const slides = Array.from(document.querySelectorAll('.slider-track .package'));
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  const dotsContainer = document.querySelector('.slider-dots');
  let currentSlide = 0;
  const totalSlides = slides.length;
  
  function updateSlider() {
    const sliderWidth = slider.offsetWidth;
    sliderTrack.style.transform = `translateX(-${currentSlide * sliderWidth}px)`;
    updateDots();
  }
  
  function updateDots() {
    dotsContainer.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
    dotsContainer.children[currentSlide].classList.add('active');
  }
  
  nextBtn.addEventListener('click', function() {
    if (currentSlide < totalSlides - 1) {
      currentSlide++;
      sliderTrack.style.transition = 'transform 0.5s ease';
      updateSlider();
    }
  });
  
  prevBtn.addEventListener('click', function() {
    if (currentSlide > 0) {
      currentSlide--;
      sliderTrack.style.transition = 'transform 0.5s ease';
      updateSlider();
    }
  });
  
  dotsContainer.querySelectorAll('.dot').forEach(dot => {
    dot.addEventListener('click', function() {
      currentSlide = parseInt(dot.getAttribute('data-index'));
      sliderTrack.style.transition = 'transform 0.5s ease';
      updateSlider();
    });
  });
  
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  
  sliderTrack.addEventListener('pointerdown', pointerDown);
  sliderTrack.addEventListener('pointermove', pointerMove);
  sliderTrack.addEventListener('pointerup', pointerUp);
  sliderTrack.addEventListener('pointerleave', pointerUp);
  
  function pointerDown(event) {
    isDragging = true;
    startPos = event.clientX;
    sliderTrack.style.transition = 'none';
  }
  
  function pointerMove(event) {
    if (!isDragging) return;
    const currentPosition = event.clientX;
    const delta = currentPosition - startPos;
    const sliderWidth = slider.offsetWidth;
    currentTranslate = -currentSlide * sliderWidth + delta;
    sliderTrack.style.transform = `translateX(${currentTranslate}px)`;
  }
  
  function pointerUp() {
    if (!isDragging) return;
    isDragging = false;
    const sliderWidth = slider.offsetWidth;
    const movedBy = currentTranslate + currentSlide * sliderWidth;
    if (movedBy < -sliderWidth * 0.2 && currentSlide < totalSlides - 1) {
      currentSlide++;
    }
    if (movedBy > sliderWidth * 0.2 && currentSlide > 0) {
      currentSlide--;
    }
    sliderTrack.style.transition = 'transform 0.5s ease';
    updateSlider();
  }
  
  window.addEventListener('resize', updateSlider);
  updateSlider();
});
