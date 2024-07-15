const apiKey = '85d9c434cfdee37725270068dabbb404'; 
const accessPoint = 'https://api.edamam.com/api/recipes/v2';
const appID = 'f1bceae0';
const type = 'public';

document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const cuisine = document.getElementById('cuisine').value;
    const mealType = document.getElementById('meal-type').value;
    const dishType = document.getElementById('dish-type').value;
    let query = '';
    if (cuisine) {
        query += `&cuisineType=${cuisine}`;
    }
    if (mealType) {
        query += `&mealType=${mealType}`;
    }
    if (dishType) {
        query += `&dishType=${dishType}`;
    }
    searchRecipes(query);
});

function searchRecipes(query) {
    const url = `${accessPoint}?app_id=${appID}&app_key=${apiKey}&type=${type}${query}`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        displayRecipes(data.hits); // Assuming 'hits' contains the recipe data
    })
    .catch(error => {
        console.error('Error fetching recipes:', error);
        const recipeList = document.getElementById('recipe-list');
        recipeList.innerHTML = '<p>Failed to fetch recipes. Please try again later.</p>';
    });
}

function displayRecipes(recipes) {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = ''; // Clear previous results
    if (!Array.isArray(recipes) || recipes.length === 0) {
        recipeList.innerHTML = '<p>No recipes found.</p>';
        return;
    }
    recipes.forEach(recipe => {
        const recipeItem = document.createElement('div');
        recipeItem.className = 'recipe-item';
        recipeItem.setAttribute('draggable', 'true');
        recipeItem.innerHTML = `
            <h3>${recipe.recipe.label}</h3>
            <p>${recipe.recipe.source}</p>
            <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}" />
            <p>Ingredients: ${recipe.recipe.ingredientLines.join(', ')}</p>
        `;
        recipeItem.addEventListener('dragstart', handleDragStart);
        recipeItem.addEventListener('dragend', handleDragEnd);
        recipeList.appendChild(recipeItem);
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
        newCard.innerHTML = data + '<button class="close-btn" onclick="removeCard(this)">x</button>';
        newCard.addEventListener('dragstart', handleDragStart);
        newCard.addEventListener('dragend', handleDragEnd);
        favoriteList.appendChild(newCard);
        saveFavoritesToLocalStorage(); // Save to local storage
    }
}

function removeCard(button) {
    button.parentElement.remove();
    saveFavoritesToLocalStorage(); // Save to local storage
}

function saveFavoritesToLocalStorage() {
    const favoriteItems = favoriteList.querySelectorAll('h3');
    const favorites = Array.from(favoriteItems).map(item => item.outerHTML);
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
}

function loadFavoritesFromLocalStorage() {
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    favorites.forEach(data => {
        const newCard = document.createElement('div');
        newCard.className = 'recipe-item';
        newCard.setAttribute('draggable', 'true');
        newCard.innerHTML = data + '<button class="close-btn" onclick="removeCard(this)">x</button>';
        newCard.addEventListener('dragstart', handleDragStart);
        newCard.addEventListener('dragend', handleDragEnd);
        favoriteList.appendChild(newCard);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });
    loadFavoritesFromLocalStorage(); // Load favorites from local storage when the page loads
});

function openModal(card) {
    const modal = document.getElementById('delete-modal');
    modal.style.display = 'block';
    document.getElementById('confirm-delete').onclick = function() {
        card.remove();
        closeModal();
    };
}

function closeModal() {
    const modal = document.getElementById('delete-modal');
    modal.style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('delete-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};
