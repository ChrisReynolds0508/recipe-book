
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

                    const drinkNameElement = document.createElement('h3');
                    drinkNameElement.textContent = drink.strDrink;

                    const drinkImage = document.createElement('img');
                    drinkImage.src = drink.strDrinkThumb;
                    drinkImage.alt = drink.strDrink;
                    drinkImage.draggable = false;

                    const ingredientsList = document.createElement('ul');
                    ingredientsList.className = 'ingredients-list';
                    // Loop through ingredients and measures (up to 15 ingredients)
                    for (let i = 1; i <= 15; i++) {
                        const ingredient = drink[`strIngredient${i}`];
                        const measure = drink[`strMeasure${i}`];
                        if (ingredient && ingredient.trim() !== '') {
                            const listItem = document.createElement('li');
                            listItem.textContent = `${ingredient} - ${measure}`;
                            ingredientsList.appendChild(listItem);
                        } else {
                            break;
                        }
                    }

                    drinkCard.appendChild(drinkNameElement);
                    drinkCard.appendChild(drinkImage);
                    drinkCard.appendChild(ingredientsList);

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
}

function openModal(recipeItem) {
    const modal = document.getElementById('delete-modal');
    modal.style.display = 'block';
    document.getElementById('confirm-delete').onclick = function() {
        recipeItem.remove();
        saveFavoritesToLocalStorage(); // Save to local storage
        closeModal();
    };
}

function closeModal() {
    const modal = document.getElementById('delete-modal');
    modal.style.display = 'none';
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
    loadFavoritesFromLocalStorage();
});