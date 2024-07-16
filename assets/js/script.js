const apiKey = '85d9c434cfdee37725270068dabbb404'; 
const accessPoint = 'https://api.edamam.com/api/recipes/v2';
const appID = 'f1bceae0';
const type = 'public';

document.getElementById('search-form').addEventListener('submit', function(e) { 
    e.preventDefault();
    const cuisine = document.getElementById('cuisine').value; 
    const mealType = document.getElementById('meal-type').value; 
    const dishType = document.getElementById('dish-type').value; 
    let query = ''; // Initialize the query string
    if (cuisine) { 
        query += `&cuisineType=${cuisine}`; // Add the cuisine type to the query string
    }
    if (mealType) {
        query += `&mealType=${mealType}`; // Add the meal type to the query string
    }
    if (dishType) {
        query += `&dishType=${dishType}`; // Add the dish type to the query string
    }
    searchRecipes(query); // Call the searchRecipes function
}); // This function is used to search for recipes when the user submits the form

function searchRecipes(query) { // Function used to search for recipes
    const url = `${accessPoint}?app_id=${appID}&app_key=${apiKey}&type=${type}${query}`; // Construct the URL

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }) // Fetch the data
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }) // Parse the JSON data
    .then(data => {
        displayRecipes(data.hits); // Assuming 'hits' contains the recipe data
    }) 
    .catch(error => {
        console.error('Error fetching recipes:', error);
        const recipeList = document.getElementById('recipe-list');
        recipeList.innerHTML = '<p>Failed to fetch recipes. Please try again later.</p>';
    }); // Handle any errors
} // This function is used to search for recipes 

function displayRecipes(recipes) { // Function used to display recipes
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = ''; 
    if (!Array.isArray(recipes) || recipes.length === 0) { 
        recipeList.innerHTML = '<p>No recipes found.</p>';
        return; // Exit the function
    }
    recipes.forEach(recipe => { // Loop through the recipes
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
        recipeList.appendChild(recipeItem); // Append the div element to the recipe list
    });
} // This function is used to display the recipes on the page 

const favoriteList = document.getElementById('favorite-list');

function allowDrop(e) { 
    e.preventDefault();
} // This function is used to allow drop event

function handleDragStart(e) { 
    e.dataTransfer.setData('text/plain', e.target.querySelector('h3').outerHTML);
} // This function is used to handle the drag start event

function handleDragEnd(e) { 
    e.dataTransfer.clearData();
} // This function is used to handle the drag end event

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
} // This function is used to add a recipe to the favorite list

function removeCard(button) {
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

window.onclick = function(event) {
    const modal = document.getElementById('delete-modal');
    if (event.target === modal) {
        closeModal();
    }
};
function saveFavoritesToLocalStorage() {
    const favoriteItems = favoriteList.querySelectorAll('h3');
    const favorites = Array.from(favoriteItems).map(item => item.outerHTML);
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
} // This function is used to save the favorite recipes to local storage

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
} // This function is used to load the favorite recipes from local storage

document.addEventListener('DOMContentLoaded', function() {
    loadFavoritesFromLocalStorage(); 
}); // This function is used to close the modal when the user clicks outside the modal


