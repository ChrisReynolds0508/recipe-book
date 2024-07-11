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
        recipeItem.innerHTML = `
            <h3>${recipe.title}</h3>
            <p>${recipe.instructions}</p>
        `;
        recipeList.appendChild(recipeItem);
    });
}
