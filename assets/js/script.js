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
    const newCard = document.createElement('div');
    newCard.className = 'recipe-item';
    newCard.setAttribute('draggable', 'true');
    newCard.innerHTML = data + '<button class="close-btn" onclick="removeCard(this)">x</button>';
    newCard.addEventListener('dragstart', handleDragStart);
    newCard.addEventListener('dragend', handleDragEnd);
    favoriteList.appendChild(newCard);
}

function removeCard(button) {
    button.parentElement.remove();
}

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

document.addEventListener('DOMContentLoaded', function() {
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });
});

window.onclick = function(event) {
    const modal = document.getElementById('delete-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};
