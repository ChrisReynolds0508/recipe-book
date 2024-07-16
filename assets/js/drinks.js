document.getElementById('searchButton').addEventListener('click', searchDrinks);

function searchDrinks() {
    const drinkName = document.getElementById('drinkName').value;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drinkName}`)
        .then(response => response.json())
        .then(data => {
            if (data.drinks) {
                data.drinks.forEach(drink => {
                    fetchDrinkDetails(drink.idDrink);
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

function fetchDrinkDetails(drinkId) {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`)
        .then(response => response.json())
        .then(data => {
            const drink = data.drinks[0];
            const resultsDiv = document.getElementById('results');

            const drinkCard = document.createElement('div');
            drinkCard.className = 'drink-card';

            const drinkName = document.createElement('h2');
            drinkName.textContent = drink.strDrink;

            const drinkImage = document.createElement('img');
            drinkImage.src = drink.strDrinkThumb;
            drinkImage.alt = drink.strDrink;

            const drinkInstructions = document.createElement('p');
            drinkInstructions.textContent = drink.strInstructions;

            const drinkIngredients = document.createElement('ul');
            for (let i = 1; i <= 15; i++) {
                const ingredient = drink[`strIngredient${i}`];
                const measure = drink[`strMeasure${i}`];
                if (ingredient) {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${measure ? measure : ''} ${ingredient}`;
                    drinkIngredients.appendChild(listItem);
                }
            }

            drinkCard.appendChild(drinkName);
            drinkCard.appendChild(drinkImage);
            drinkCard.appendChild(drinkInstructions);
            drinkCard.appendChild(drinkIngredients);

            resultsDiv.appendChild(drinkCard);
        })
        .catch(error => {
            console.error('Error fetching drink details:', error);
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '<p>There was an error fetching the detailed drink data. Please try again later.</p>';
        });
}
