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
                    drinkCard.className = 'drink-card';

                    const drinkName = document.createElement('h2');
                    drinkName.textContent = drink.strDrink;

                    const drinkImage = document.createElement('img');
                    drinkImage.src = drink.strDrinkThumb;
                    drinkImage.alt = drink.strDrink;

                    drinkCard.appendChild(drinkName);
                    drinkCard.appendChild(drinkImage);

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
