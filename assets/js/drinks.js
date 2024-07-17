
document.getElementById('searchButton').addEventListener('click', searchDrinks);

function searchDrinks() {
    const drinkType = document.getElementById('drinkType').value;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${drinkType}`)
        .then(response => response.json())
        .then(data => {
            if (data.drinks) {
                data.drinks.forEach(drink => {
                    const drinkCard = document.createElement('div');
                    drinkCard.className = 'recipe-item';
                    drinkCard.setAttribute('draggable', 'true');

                    const drinkName = document.createElement('h3');
                    drinkName.textContent = drink.strDrink;

                    const drinkImage = document.createElement('img');
                    drinkImage.src = drink.strDrinkThumb;
                    drinkImage.alt = drink.strDrink;

                    drinkCard.appendChild(drinkName);
                    drinkCard.appendChild(drinkImage);

                    drinkCard.addEventListener('dragstart', handleDragStart);
                    drinkCard.addEventListener('dragend', handleDragEnd);

                    resultsDiv.appendChild(drinkCard);
                });
            } else {
                resultsDiv.innerHTML = '<p>No drinks found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching drinks:', error);
            resultsDiv.innerHTML = '<p>There was an error fetching the drink data. Please try again later.</p>';
        });
}

const favoriteList = document.getElementById('favorite-list');

function allowDrop(e) {
    e.preventDefault();
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.querySelector('h3').outerHTML);
}

function handleDragEnd(e) {
    e.dataTransfer.clearData();
}

function drop(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    const favoriteItems = favoriteList.querySelectorAll('h3');
    const titles = Array.from(favoriteItems).map(item => item.outerHTML);
    if (!titles.includes(data)) {
        const newCard = document.createElement('div');
        newCard.className = 'recipe-item';
        newCard.setAttribute('draggable', 'true');
        newCard.innerHTML = data + '<button class="close-btn" onclick="confirmRemoveCard(this)">x</button>';
        newCard.addEventListener('dragstart', handleDragStart);
        newCard.addEventListener('dragend', handleDragEnd);
        favoriteList.appendChild(newCard);
        saveFavoritesToLocalStorage(); // Save to local storage
    }
}

function confirmRemoveCard(button) {
    if (confirm('Are you sure you want to delete this drink from your favorites?')) {
        button.parentElement.remove();
        saveFavoritesToLocalStorage(); // Save to local storage
    }
}

function saveFavoritesToLocalStorage() {
    const favoriteItems = favoriteList.querySelectorAll('h3');
    const favorites = Array.from(favoriteItems).map(item => item.outerHTML);
    localStorage.setItem('favoriteDrinks', JSON.stringify(favorites));
}

function loadFavoritesFromLocalStorage() {
    const favorites = JSON.parse(localStorage.getItem('favoriteDrinks')) || [];
    favorites.forEach(data => {
        const newCard = document.createElement('div');
        newCard.className = 'recipe-item';
        newCard.setAttribute('draggable', 'true');
        newCard.innerHTML = data + '<button class="close-btn" onclick="confirmRemoveCard(this)">x</button>';
        newCard.addEventListener('dragstart', handleDragStart);
        newCard.addEventListener('dragend', handleDragEnd);
        favoriteList.appendChild(newCard);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    loadFavoritesFromLocalStorage(); // Load favorites from local storage when the page loads
});