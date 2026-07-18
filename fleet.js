// fleet.js – Filtron automjetet pa e rindërtuar faqen
(function() {
    const cards = Array.from(document.querySelectorAll('#fleetGrid .car-card'));
    const searchInput = document.getElementById('searchInput');
    const brandFilter = document.getElementById('brandFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const transmissionFilter = document.getElementById('transmissionFilter');
    const fuelFilter = document.getElementById('fuelFilter');
    const seatsFilter = document.getElementById('seatsFilter');
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    const availabilityFilter = document.getElementById('availabilityFilter');
    const sortFilter = document.getElementById('sortFilter');
    const resetBtn = document.getElementById('resetFilters');
    const noResults = document.getElementById('noResults');
    const fleetGrid = document.getElementById('fleetGrid');

    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const brand = brandFilter.value;
        const category = categoryFilter.value;
        const transmission = transmissionFilter.value;
        const fuel = fuelFilter.value;
        const seats = seatsFilter.value;
        const maxPrice = parseInt(priceRange.value);
        const available = availabilityFilter.value;

        // Përditëso vlerën e çmimit maksimal në etiketë
        if (priceValue) {
            priceValue.textContent = maxPrice;
        }

        let visibleCount = 0;

        cards.forEach(card => {
            const name = card.dataset.name.toLowerCase();
            const cardBrand = card.dataset.brand;
            const cardCategory = card.dataset.category;
            const cardTransmission = card.dataset.transmission;
            const cardFuel = card.dataset.fuel;
            const cardSeats = card.dataset.seats;
            const cardPrice = parseInt(card.dataset.price);
            const cardAvailable = card.dataset.available;

            let show = true;
            if (searchTerm && !name.includes(searchTerm)) show = false;
            if (brand && cardBrand !== brand) show = false;
            if (category && cardCategory !== category) show = false;
            if (transmission && cardTransmission !== transmission) show = false;
            if (fuel && cardFuel !== fuel) show = false;
            if (seats && cardSeats !== seats) show = false;
            if (cardPrice > maxPrice) show = false;
            if (available === 'true' && cardAvailable !== 'true') show = false;

            card.style.display = show ? '' : 'none';
            if (show) visibleCount++;
        });

        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        sortCards();
    }

    function sortCards() {
        const sortBy = sortFilter.value;
        const visible = Array.from(fleetGrid.children).filter(c => c.style.display !== 'none');
        visible.sort((a, b) => {
            const priceA = parseInt(a.dataset.price);
            const priceB = parseInt(b.dataset.price);
            const yearA = parseInt(a.dataset.year);
            const yearB = parseInt(b.dataset.year);
            const popularA = a.dataset.popular === 'true' ? 1 : 0;
            const popularB = b.dataset.popular === 'true' ? 1 : 0;
            if (sortBy === 'price-asc') return priceA - priceB;
            if (sortBy === 'price-desc') return priceB - priceA;
            if (sortBy === 'newest') return yearB - yearA;
            if (sortBy === 'popular') return popularB - popularA;
            return 0;
        });
        visible.forEach(card => fleetGrid.appendChild(card));
    }

    // Ngjarjet
    [searchInput, brandFilter, categoryFilter, transmissionFilter, fuelFilter, seatsFilter, availabilityFilter].forEach(el => {
        if (el) {
            el.addEventListener('input', applyFilters);
            el.addEventListener('change', applyFilters);
        }
    });

    if (priceRange) {
        priceRange.addEventListener('input', applyFilters);
    }
    if (sortFilter) {
        sortFilter.addEventListener('change', applyFilters);
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            searchInput.value = '';
            brandFilter.value = '';
            categoryFilter.value = '';
            transmissionFilter.value = '';
            fuelFilter.value = '';
            seatsFilter.value = '';
            priceRange.value = 500;
            if (priceValue) priceValue.textContent = '500';
            availabilityFilter.value = '';
            sortFilter.value = 'default';
            cards.forEach(card => card.style.display = '');
            noResults.style.display = 'none';
        });
    }

    // Ekspozo funksionin globalisht për lang.js
    window.applyFilters = applyFilters;

    // Thirrja fillestare
    applyFilters();
})();