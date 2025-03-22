/* =============== INTERACTIVE EFFECTS JS =============== */
document.addEventListener('DOMContentLoaded', function() {
  // Animation for testimonial cards on scroll
  const animateCards = document.querySelectorAll('.animate-card');
  
  function checkIfInView() {
    animateCards.forEach(card => {
      const cardTop = card.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (cardTop < windowHeight - 100) {
        card.classList.add('visible');
      }
    });
  }
  
  // Initial check
  setTimeout(checkIfInView, 100);
  
  // Check on scroll
  window.addEventListener('scroll', checkIfInView);
  
  // Featured card interactive effects
  const featuredCards = document.querySelectorAll('.featured__card');
  
  featuredCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px)';
      this.style.boxShadow = '0 10px 25px rgba(244, 62, 92, 0.2)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    });
  });
  
  // Video card interactive effects
  const videoCards = document.querySelectorAll('.video-card');
  
  videoCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.querySelector('iframe').style.filter = 'brightness(1.1)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.querySelector('iframe').style.filter = 'brightness(1)';
    });
  });
}); 