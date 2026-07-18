(function() {
    const form = document.getElementById('bookingForm');
    if (!form) return;

    emailjs.init("YOUR_PUBLIC_KEY"); // <-- Replace with your EmailJS public key

    const pickupDate = document.getElementById('pickupDate');
    const returnDate = document.getElementById('returnDate');
    const gps = document.getElementById('gps');
    const childSeat = document.getElementById('childSeat');
    const additionalDriver = document.getElementById('additionalDriver');
    const insurance = document.getElementById('insurance');
    const couponCode = document.getElementById('couponCode');
    const pricePerDayEl = document.getElementById('pricePerDay');
    const summaryDays = document.getElementById('summaryDays');
    const summaryBase = document.getElementById('summaryBase');
    const summaryExtras = document.getElementById('summaryExtras');
    const summaryDiscount = document.getElementById('summaryDiscount');
    const summaryTax = document.getElementById('summaryTax');
    const summaryTotal = document.getElementById('summaryTotal');

    const basePrice = parseInt(pricePerDayEl.textContent.replace('€', '')) || 85;

    function calculate() {
        if (!pickupDate.value || !returnDate.value) return;
        const pickup = new Date(pickupDate.value);
        const returnD = new Date(returnDate.value);
        const diffTime = returnD - pickup;
        const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        summaryDays.textContent = days;
        const baseCost = days * basePrice;
        summaryBase.textContent = `€${baseCost}`;
        let extrasCost = 0;
        if (gps.checked) extrasCost += days * parseInt(gps.dataset.price);
        if (childSeat.checked) extrasCost += days * parseInt(childSeat.dataset.price);
        if (additionalDriver.checked) extrasCost += days * parseInt(additionalDriver.dataset.price);
        if (insurance.checked) extrasCost += days * parseInt(insurance.dataset.price);
        summaryExtras.textContent = `€${extrasCost}`;
        let discount = 0;
        if (couponCode.value.trim().toUpperCase() === 'LUXE10') discount = baseCost * 0.1;
        summaryDiscount.textContent = `-€${discount}`;
        const subtotal = baseCost + extrasCost - discount;
        const tax = Math.round(subtotal * 0.2);
        summaryTax.textContent = `€${tax}`;
        const total = subtotal + tax;
        summaryTotal.textContent = `€${total}`;
    }

    [pickupDate, returnDate, gps, childSeat, additionalDriver, insurance, couponCode].forEach(el => {
        el.addEventListener('change', calculate);
        el.addEventListener('input', calculate);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!form.checkValidity()) {
            alert('Ju lutemi plotësoni të gjitha fushat e detyrueshme.');
            return;
        }
        calculate();

        const formData = {
            car_name: document.getElementById('carTitle').textContent,
            first_name: document.getElementById('firstName').value,
            last_name: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            pickup_date: pickupDate.value,
            return_date: returnDate.value,
            pickup_time: document.getElementById('pickupTime').value,
            return_time: document.getElementById('returnTime').value,
            pickup_location: document.getElementById('pickupLocation').value,
            dropoff_location: document.getElementById('dropoffLocation').value,
            special_requests: document.getElementById('specialRequests').value,
            coupon: couponCode.value,
            extras_gps: gps.checked,
            extras_child_seat: childSeat.checked,
            extras_additional_driver: additionalDriver.checked,
            extras_insurance: insurance.checked,
            total_price: summaryTotal.textContent,
            days: summaryDays.textContent
        };

        emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", formData)
            .then(() => {
                const ref = 'LX-' + Math.random().toString(36).substr(2, 6).toUpperCase();
                document.getElementById('bookingRef').textContent = ref;
                document.getElementById('confirmationModal').style.display = 'flex';
            })
            .catch((error) => {
                alert('Pati një gabim në dërgimin e rezervimit. Ju lutemi provoni përsëri.');
                console.error(error);
            });
    });

    document.getElementById('closeModal').addEventListener('click', () => {
        document.getElementById('confirmationModal').style.display = 'none';
    });

    calculate();
})();