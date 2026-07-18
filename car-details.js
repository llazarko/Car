// details-gallery.js – Galeri e avancuar për faqen e detajeve të makinës
(function() {
    const slidesContainer = document.getElementById('gallerySlides');
    const dotsContainer = document.getElementById('galleryDots');
    const thumbnailsContainer = document.getElementById('galleryThumbnails');
    const counter = document.getElementById('galleryCounter');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    
    // Elementet e fullscreen
    const fullscreenModal = document.getElementById('fullscreenModal');
    const fullscreenImage = document.getElementById('fullscreenImage');
    const fullscreenClose = document.getElementById('fullscreenClose');
    const fullscreenPrev = document.getElementById('fullscreenPrev');
    const fullscreenNext = document.getElementById('fullscreenNext');
    
    let currentIndex = 0;
    let totalSlides = 0;
    let images = [];
    let startX = 0;
    let endX = 0;
    let isDragging = false;
    let autoPlayInterval;

    // Ky funksion thirret nga gallery.js pasi të jenë shtuar imazhet
    window.initDetailsGallery = function(imagesArray) {
        images = imagesArray;
        totalSlides = images.length;
        
        if (totalSlides === 0) return;
        
        // Pastro container-at
        slidesContainer.innerHTML = '';
        dotsContainer.innerHTML = '';
        thumbnailsContainer.innerHTML = '';
        
        // Shto imazhet në slides
        images.forEach((src, index) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = `Foto ${index + 1}`;
            img.loading = index === 0 ? 'eager' : 'lazy';
            slidesContainer.appendChild(img);
        });
        
        // Krijo dots
        images.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = 'gallery-dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        // Krijo thumbnails
        images.forEach((src, index) => {
            const thumb = document.createElement('img');
            thumb.src = src;
            thumb.className = 'gallery-thumb';
            thumb.alt = `Thumb ${index + 1}`;
            if (index === 0) thumb.classList.add('active');
            thumb.addEventListener('click', () => goToSlide(index));
            thumbnailsContainer.appendChild(thumb);
        });
        
        updateCounter();
        startAutoPlay();
    };

    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        
        currentIndex = index;
        slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Përditëso dots
        document.querySelectorAll('.gallery-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
        
        // Përditëso thumbnails
        document.querySelectorAll('.gallery-thumb').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === currentIndex);
            // Lëviz thumbnails për të mbajtur të dukshëm atë aktive
            if (i === currentIndex) {
                thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        });
        
        updateCounter();
        resetAutoPlay();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    function updateCounter() {
        counter.textContent = `${currentIndex + 1} / ${totalSlides}`;
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // Event listeners për butonat
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Swipe me touch
    slidesContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        stopAutoPlay();
    }, { passive: true });

    slidesContainer.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        endX = e.touches[0].clientX;
    }, { passive: true });

    slidesContainer.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        
        const diffX = startX - endX;
        const threshold = 50;
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) nextSlide();
            else prevSlide();
        }
        
        startAutoPlay();
    });

    // Swipe me mouse
    slidesContainer.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
        slidesContainer.style.cursor = 'grabbing';
        stopAutoPlay();
    });

    slidesContainer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        endX = e.clientX;
    });

    slidesContainer.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        slidesContainer.style.cursor = '';
        
        const diffX = startX - endX;
        const threshold = 50;
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) nextSlide();
            else prevSlide();
        }
        
        startAutoPlay();
    });

    slidesContainer.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            slidesContainer.style.cursor = '';
            startAutoPlay();
        }
    });

    // Fullscreen functionality
    fullscreenBtn.addEventListener('click', () => {
        openFullscreen(currentIndex);
    });

    fullscreenClose.addEventListener('click', closeFullscreen);
    fullscreenModal.addEventListener('click', (e) => {
        if (e.target === fullscreenModal) closeFullscreen();
    });

    fullscreenPrev.addEventListener('click', () => {
        navigateFullscreen(-1);
    });

    fullscreenNext.addEventListener('click', () => {
        navigateFullscreen(1);
    });

    function openFullscreen(index) {
        fullscreenImage.src = images[index];
        fullscreenImage.dataset.index = index;
        fullscreenModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        stopAutoPlay();
    }

    function closeFullscreen() {
        fullscreenModal.classList.remove('active');
        document.body.style.overflow = '';
        startAutoPlay();
    }

    function navigateFullscreen(direction) {
        let index = parseInt(fullscreenImage.dataset.index) + direction;
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        fullscreenImage.src = images[index];
        fullscreenImage.dataset.index = index;
    }

    // Navigim me tastierë
    document.addEventListener('keydown', (e) => {
        if (fullscreenModal.classList.contains('active')) {
            if (e.key === 'ArrowLeft') navigateFullscreen(-1);
            if (e.key === 'ArrowRight') navigateFullscreen(1);
            if (e.key === 'Escape') closeFullscreen();
        } else {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        }
    });

    // Ndal auto-play kur mouse është mbi galeri
    document.getElementById('carGalleryWrapper').addEventListener('mouseenter', stopAutoPlay);
    document.getElementById('carGalleryWrapper').addEventListener('mouseleave', startAutoPlay);

    // Fillo auto-play
    startAutoPlay();
})();