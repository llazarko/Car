// car-loader.js – Lexon të dhënat e makinës nga atributet HTML dhe përditëson faqen
(function() {
    // Merr ID-në e makinës nga URL
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get('id') || 'bmw-x5';
    
    // Gjej div-in me të dhënat e makinës
    const carDataDiv = document.getElementById('car-' + carId);
    
    if (!carDataDiv) {
        console.warn('Makina nuk u gjet: ' + carId);
        return;
    }
    
    // Lexo të dhënat nga atributet data-*
    const name = carDataDiv.getAttribute('data-name');
    const subtitle = carDataDiv.getAttribute('data-subtitle');
    const description = carDataDiv.getAttribute('data-description');
    const price = carDataDiv.getAttribute('data-price');
    const specs = JSON.parse(carDataDiv.getAttribute('data-specs') || '{}');
    const equipment = JSON.parse(carDataDiv.getAttribute('data-equipment') || '[]');
    const images = JSON.parse(carDataDiv.getAttribute('data-images') || '[]');
    
    // Përditëso titullin
    document.getElementById('carTitle').textContent = name;
    document.getElementById('carSubtitle').textContent = subtitle;
    document.getElementById('carDescription').innerHTML = '<p>' + description + '</p>';
    document.getElementById('pricePerDay').textContent = '€' + price;
    
    // Përditëso specifikimet
    const specsGrid = document.getElementById('specsGrid');
    specsGrid.innerHTML = '';
    for (const [key, value] of Object.entries(specs)) {
        const specItem = document.createElement('div');
        specItem.className = 'spec-item';
        specItem.innerHTML = '<span>' + key + '</span><strong>' + value + '</strong>';
        specsGrid.appendChild(specItem);
    }
    
    // Përditëso pajisjet
    const equipmentList = document.getElementById('equipmentList');
    equipmentList.innerHTML = '';
    equipment.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        equipmentList.appendChild(li);
    });
    
    // Inicializo galerinë me fotot
    if (typeof window.initDetailsGallery === 'function') {
        window.initDetailsGallery(images);
    }
})();