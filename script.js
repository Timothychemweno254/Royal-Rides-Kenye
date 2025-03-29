document.addEventListener('DOMContentLoaded', () => {
    const carList = document.getElementById('car-list');
    const carSelection = document.getElementById('car-selection');
    const searchInput = document.getElementById('search');
    const purchaseForm = document.getElementById('purchase-form');
    const loginForm = document.getElementById('login-form');
    const logoutButton = document.getElementById('logout-button');
    const authMessage = document.getElementById('auth-message');

    let currentUser = JSON.parse(localStorage.getItem('user')) || null;
    updateAuthUI();

    // Fetch car data
    fetch('https://royal-rides-kenye.onrender.com/cars')
        .then(response => response.json())
        .then(cars => {
            const transformedCars = cars.map(car => ({
                ...car,
                formattedPrice: `Ksh ${car.price.toLocaleString()}`
            }));
            displayCars(transformedCars);
            
            searchInput.addEventListener('input', () => {
                const searchTerm = searchInput.value.toLowerCase();
                const filteredCars = transformedCars.filter(car => 
                    car.brand.toLowerCase().includes(searchTerm) ||
                    car.model.toLowerCase().includes(searchTerm)
                );
                displayCars(filteredCars);
            });
        });

    function displayCars(carArray) {
        carList.innerHTML = '';
        carSelection.innerHTML = '<option value="">Select a car</option>';

        carArray.forEach(car => {
            const carCard = document.createElement('div');
            carCard.classList.add('car-card');

            const carImage = document.createElement('img');
            carImage.src = car.imageExterior;
            carImage.alt = `${car.brand} ${car.model}`;

            const carDetails = document.createElement('div');
            carDetails.innerHTML = `
                <h3>${car.brand} ${car.model}</h3>
                <p>Price: ${car.formattedPrice}</p>
                <button class="buy-button" data-id="${car.id}">Buy</button>
            `;

            carImage.addEventListener('click', () => alert(`Car: ${car.brand} ${car.model}\nPrice: ${car.formattedPrice}`));
            carDetails.querySelector('.buy-button').addEventListener('click', () => showPurchaseForm(car.id));

            carCard.appendChild(carImage);
            carCard.appendChild(carDetails);
            carList.appendChild(carCard);
        });
    }

    function showPurchaseForm(carId) {
        if (!currentUser) {
            alert("Please log in to purchase a car.");
            return;
        }
        document.getElementById('car-selection').value = carId;
        purchaseForm.scrollIntoView({ behavior: 'smooth' });
    }

    purchaseForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!currentUser) {
            alert("You must be logged in to purchase.");
            return;
        }
        
        const purchaseData = {
            name: currentUser.name,
            userId: currentUser.id,
            carId: parseInt(document.getElementById('car-selection').value)
        };

        fetch('https://royal-rides-kenye.onrender.com/purchases', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(purchaseData)
        })
        .then(response => response.json())
        .then(() => {
            alert("✅ Purchase successful!");
            purchaseForm.reset();
        })
        .catch(() => alert("❌ Error processing purchase."));
    });

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('https://royal-rides-kenye.onrender.com/users')
            .then(response => response.json())
            .then(users => {
                const user = users.find(u => u.username === username && u.password === password);
                if (user) {
                    localStorage.setItem('user', JSON.stringify(user));
                    currentUser = user;
                    updateAuthUI();
                } else {
                    authMessage.textContent = "❌ Invalid credentials";
                }
            });
    });

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('user');
        currentUser = null;
        updateAuthUI();
    });

    function updateAuthUI() {
        if (currentUser) {
            authMessage.textContent = `Logged in as ${currentUser.name}`;
            loginForm.style.display = 'none';
            logoutButton.style.display = 'block';
        } else {
            authMessage.textContent = '';
            loginForm.style.display = 'block';
            logoutButton.style.display = 'none';
        }
    }
});
