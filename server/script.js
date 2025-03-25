document.addEventListener('DOMContentLoaded', () => {
    const carList = document.getElementById('car-list');
    const carSelection = document.getElementById('car-selection');
    
    // Fetch car data from db.json
    fetch('http://localhost:3000/cars') // Make sure json-server is running!
        .then(response => response.json())
        .then(cars => {
            carList.innerHTML = ''; // Clear previous content
            
            cars.forEach(car => {
                // Create a car card
                const carCard = document.createElement('div');
                carCard.classList.add('car-card');
                
                // Create car image
                const carImage = document.createElement('img');
                carImage.src = car.imageExterior;
                carImage.alt = `${car.brand} ${car.model}`;
                carImage.classList.add('car-image');
                
                // Create car details
                const carDetails = document.createElement('div');
                carDetails.classList.add('car-details');
                carDetails.innerHTML = `
                    <h3>${car.brand} ${car.model}</h3>
                    <p>Price: $${car.price}</p>
                    <button class="buy-button" data-id="${car.id}">Buy</button>
                `;

                // Append image and details
                carCard.appendChild(carImage);
                carCard.appendChild(carDetails);
                
                // Add click event to show details
                carImage.addEventListener('click', () => showCarDetails(car));

                // Append car card to the list
                carList.appendChild(carCard);

                // Add car to selection dropdown
                const option = document.createElement('option');
                option.value = car.id;
                option.textContent = `${car.brand} ${car.model} - $${car.price}`;
                carSelection.appendChild(option);
            });

            // Add event listener to Buy buttons
            document.querySelectorAll('.buy-button').forEach(button => {
                button.addEventListener('click', (event) => {
                    const carId = event.target.getAttribute('data-id');
                    showPurchaseForm(carId);
                });
            });
        })
        .catch(error => console.error('Error fetching cars:', error));
});

// Function to display car details when clicked
function showCarDetails(car) {
    alert(`Car: ${car.brand} ${car.model}\nPrice: $${car.price}\nClick Buy to purchase!`);
}

// Function to handle buy button click
function showPurchaseForm(carId) {
    document.getElementById('car-selection').value = carId;
    document.getElementById('purchase-form').scrollIntoView({ behavior: 'smooth' });
}
