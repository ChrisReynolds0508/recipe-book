document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const drinkName = document.getElementById('drinkName').value.trim();
    if (drinkName === "") {
        alert("Please enter a drink name.");
        return;
    }
    searchDrinks(drinkName);
});

function searchDrinks(drinkName) {
    const resultsDiv = document.getElementById('recipe-list');
    resultsDiv.innerHTML = '';

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drinkName}`)
        .then(response => response.json())
        .then(data => {
            if (data.drinks) {
                data.drinks.forEach(drink => {
                    const drinkCard = document.createElement('div');
                    drinkCard.className = 'recipe-item';

                    const drinkName = document.createElement('h3');
                    drinkName.textContent = drink.strDrink;

                    const drinkImage = document.createElement('img');
                    drinkImage.src = drink.strDrinkThumb;
                    drinkImage.alt = drink.strDrink;

                    drinkCard.appendChild(drinkName);
                    drinkCard.appendChild(drinkImage);

                    drinkCard.setAttribute('draggable', 'true');
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
    const recipeItem = button.parentElement;
    openModal(recipeItem);
} // This function is used to remove a recipe from the favorite list with confirmation

function openModal(recipeItem) { 
    const modal = document.getElementById('delete-modal');
    modal.style.display = 'block';
    document.getElementById('confirm-delete').onclick = function() {
        recipeItem.remove();
        saveFavoritesToLocalStorage(); // Save to local storage
        closeModal();
    }; 
} // This function is used to open the modal when the delete button is clicked

function closeModal() {
    const modal = document.getElementById('delete-modal');
    modal.style.display = 'none';
} // This function is used to close the modal when the close button is clicked

function saveFavoritesToLocalStorage() {
    const favoriteItems = favoriteList.querySelectorAll('h3');
    const favorites = Array.from(favoriteItems).map(item => item.outerHTML);
    localStorage.setItem('favoriteDrinks', JSON.stringify(favorites));
} // This function is used to save the favorite drinks to local storage

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
} // This function is used to load the favorite drinks from local storage

document.addEventListener('DOMContentLoaded', function() {
    loadFavoritesFromLocalStorage(); // Load favorites from local storage when the page loads
});
