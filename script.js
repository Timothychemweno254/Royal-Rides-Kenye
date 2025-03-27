document.addEventListener('DOMContentLoaded', () => {
    const carList = document.getElementById('car-list');
    const carSelection = document.getElementById('car-selection');
    const searchInput = document.getElementById('search');
    const carDetails = document.getElementById('car-details');
    const purchaseModal = document.getElementById('purchase-modal');
    const purchaseForm = document.getElementById('purchase-form');

    // Fetch car data from db.json
    console.log('Fetching car data from db.json...');
    fetch('https://royal-rides-kenye.onrender.com/cars')
        .then(response => response.json())
        .then(cars => {
            // Transform car data using map to format price
            const transformedCars = cars.map(car => ({
                ...car,
                formattedPrice: `Ksh ${car.price.toLocaleString()}`
            }));
            
            displayCars(transformedCars);

            // Search functionality using filter also an event listener
            searchInput.addEventListener('input', () => {
                const searchTerm = searchInput.value.toLowerCase();
                const filteredCars = transformedCars.filter(car => 
                    car.brand.toLowerCase().includes(searchTerm) ||
                    car.model.toLowerCase().includes(searchTerm)
                );
                displayCars(filteredCars);
            });
        })
        .catch(error => console.error('Error fetching cars:', error));

    // Function to display cars using forEach
    function displayCars(carArray) {
        carList.innerHTML = '';
        carSelection.innerHTML = '<option value="">Select a car</option>';

        carArray.forEach(car => {
            const carCard = createCarCard(car);
            carList.appendChild(carCard);

            const option = document.createElement('option');
            option.value = car.id;
            option.textContent = `${car.brand} ${car.model} - ${car.formattedPrice}`;
            carSelection.appendChild(option);
        });




        // seccond event listener to Buy buttons
        document.querySelectorAll('.buy-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const carId = event.target.getAttribute('data-id');
                console.log('Buy button clicked for car ID:', carId);
                showPurchaseForm(carId);
            });
        });
    }

  // Function to create a car card
   function createCarCard(car) {
    const carCard = document.createElement('div');
    carCard.classList.add('car-card');

    // Create exterior image
    const carImage = document.createElement('img');
    carImage.src = car.imageExterior;
    carImage.alt = `${car.brand} ${car.model}`;
    carImage.classList.add('car-image');

    // Create interior image (smaller)
    const interiorImage = document.createElement('img');
    interiorImage.src = car.imageInterior;
    interiorImage.alt = `Interior of ${car.brand} ${car.model}`;
    interiorImage.classList.add('interior-image');

    // Create car details section
    const carDetails = document.createElement('div');
    carDetails.classList.add('car-details');
    carDetails.innerHTML = `
        <h3>${car.brand} ${car.model}</h3>
        <p>Price: ${car.formattedPrice}</p>
        <button class="buy-button" data-id="${car.id}">Buy</button>
    `;

    // Add event listener to show details when clicking exterior image
    carImage.addEventListener('click', () => {
        showCarDetails(car);
    });

    // Append images and details to the car card
    carCard.appendChild(carImage);
    carCard.appendChild(interiorImage);
    carCard.appendChild(carDetails);

    return carCard;



        // Mouseover event to show tooltip
        carImage.addEventListener('mouseover', () => {
            carImage.title = `Click to view details of ${car.brand} ${car.model}`;
        });

        carDetails.querySelector('.buy-button').addEventListener('click', () => {
            console.log('Buy button clicked inside car card:', car);
            showPurchaseForm(car);
        });

        carCard.appendChild(carImage);
        carCard.appendChild(carDetails);
        return carCard;
    }

    // Function to display car details when clicked
    function showCarDetails(car) {
        alert(`Car: ${car.brand} ${car.model}\nPrice: ${car.formattedPrice}\nClick Buy to purchase!`);
    }

    // Function to handle buy button click
    function showPurchaseForm(carId) {
        const purchaseForm = document.getElementById('purchase-form');
        document.getElementById('car-selection').value = carId;
        purchaseForm.scrollIntoView({ behavior: 'smooth' });
    }

    //third event listerner adds the purchase details to database
    document.getElementById('purchase-form').addEventListener('submit', (event) => {
        event.preventDefault();
    
        const name = document.getElementById('name').value;
        const idNo = document.getElementById('id-no').value;
        const phone = document.getElementById('phone').value;
        const carId = document.getElementById('car-selection').value;
    
        console.log('Form Submitted!');  
        console.log('Buyer Details:', { name, idNo, phone, carId });
    
        const purchaseData = {
            name,
            idNo,
            phone,
            carId: parseInt(carId)
        };
    
        fetch('https://royal-rides-kenye.onrender.com/purchases', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(purchaseData)
        })
        .then(response => response.json())
        .then(data => {
            
            console.log('Purchase Saved:', data);
    
            // Show a success message
            const messageDiv = document.getElementById('purchase-message');
            messageDiv.textContent = "✅ Purchase successful! Thank you for your order.";
            messageDiv.className = "purchase-success"; // Apply CSS class
    
            document.getElementById('purchase-form').reset();
        })
        .catch(error => {
            console.error('Error saving purchase:', error);
            
            // Show an error message
            const messageDiv = document.getElementById('purchase-message');
            messageDiv.textContent = "❌ Error processing purchase. Please try again.";
            messageDiv.className = "purchase-error"; // Apply CSS class
        });
    });
    


});
