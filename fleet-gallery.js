// fleet-gallery.js – Galeri imazhesh për çdo kartë makine në faqen e flotës
(function() {
    document.querySelectorAll('.car-gallery-container').forEach(container => {
        const slides = container.querySelector('.car-gallery-slides');
        const images = slides.querySelectorAll('img');
        const totalSlides = images.length;
        const prevBtn = container.querySelector('.gallery-nav-btn.prev');
        const nextBtn = container.querySelector('.gallery-nav-btn.next');
        const dots = container.querySelectorAll('.gallery-dot');
        const thumbnails = container.parentElement.querySelectorAll('.gallery-thumb');
        
        let currentIndex = 0;
        let startX = 0;
        let endX = 0;
        let isDragging = false;

        function goToSlide(index) {
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;
            currentIndex = index;
            
            slides.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Përditëso dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
            
            // Përditëso thumbnails
            thumbnails.forEach((thumb, i) => {
                thumb.classList.toggle('active', i === currentIndex);
            });
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function prevSlide() {
            goToSlide(currentIndex - 1);
        }

        // Butonat e navigimit
        if (prevBtn) prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            prevSlide();
        });
        
        if (nextBtn) nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            nextSlide();
        });

        // Klikimi në dots
        dots.forEach((dot, i) => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                goToSlide(i);
            });
        });

        // Klikimi në thumbnails
        thumbnails.forEach((thumb, i) => {
            thumb.addEventListener('click', (e) => {
                e.stopPropagation();
                goToSlide(i);
            });
        });

        // Swipe për pajisje mobile
        slides.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });

        slides.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            endX = e.touches[0].clientX;
        }, { passive: true });

        slides.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            
            const diffX = startX - endX;
            const threshold = 50; // px
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    nextSlide(); // swipe majtas
                } else {
                    prevSlide(); // swipe djathtas
                }
            }
        });

        // Swipe me mouse për desktop (opsionale)
        slides.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            isDragging = true;
            slides.style.cursor = 'grabbing';
        });

        slides.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            endX = e.clientX;
        });

        slides.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            slides.style.cursor = '';
            
            const diffX = startX - endX;
            const threshold = 50;
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        });

        slides.addEventListener('mouseleave', () => {
            if (isDragging) {
                isDragging = false;
                slides.style.cursor = '';
            }
        });

        // Auto-play (opsionale – çdo 5 sekonda)
        // setInterval(nextSlide, 5000);
    });
})();