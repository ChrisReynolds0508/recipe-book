const apiKey = 'mdHdAxFSpW4kEbLGGYEfAg==IssRYpNGzW4852n5'; // Replace with your actual API key
document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const cuisine = document.getElementById('cuisine').value;
    const mealType = document.getElementById('meal-type').value;
    const ingredientType = document.getElementById('ingredient-type').value;
    let query = '';
    if (cuisine) {
        query += `cuisine=${cuisine}&`;
    }
    if (mealType) {
        query += `mealType=${mealType}&`;
    }
    if (ingredientType) {
        query += `ingredientType=${ingredientType}`;
    }
    searchRecipes(query);
});

function searchRecipes(query) {
    fetch(`https://api.api-ninjas.com/v1/recipe?${query}`, {
        method: 'GET',
        headers: {
            'X-Api-Key': apiKey
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        displayRecipes(data);
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
            <h3>${recipe.title}</h3>
            <p>${recipe.instructions}</p>
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
