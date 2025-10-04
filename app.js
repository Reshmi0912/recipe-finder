const form = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const recipesContainer = document.getElementById('recipes');
const searchButton = document.getElementById('search-button');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;

  recipesContainer.innerHTML = '';
  const loadingMessage = document.createElement('p');
  loadingMessage.textContent = 'Loading...';
  loadingMessage.style.textAlign = 'center';
  loadingMessage.style.fontSize = '18px';
  loadingMessage.style.color = '#fff';
  recipesContainer.appendChild(loadingMessage);

  searchButton.disabled = true;

  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`);
    const data = await response.json();
    displayRecipes(data.meals);
  } catch (error) {
    recipesContainer.innerHTML = '<p style="text-align:center; font-size:18px; color:#fff;">Error fetching recipes.</p>';
    console.error(error);
  } finally {
    searchButton.disabled = false;
  }
});

function displayRecipes(meals) {
  recipesContainer.innerHTML = '';

  if (!meals) {
    recipesContainer.innerHTML = '<p style="text-align:center; font-size:18px; color:#fff;">No recipes found. Try another keyword.</p>';
    return;
  }

  meals.forEach(meal => {
    const card = document.createElement('div');
    card.classList.add('recipe-card');

    card.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="recipe-title">${meal.strMeal}</div>
      <button class="toggle-details-btn">Show Details</button>
      <div class="recipe-details">
        <h4>Ingredients</h4>
        <ul class="ingredients-list"></ul>
        <h4>Instructions</h4>
        <p class="instructions"></p>
        ${meal.strSource ? `<p><a href="${meal.strSource}" target="_blank" rel="noopener noreferrer">View Full Recipe Source</a></p>` : ''}
      </div>
    `;

    recipesContainer.appendChild(card);

    // Extract ingredients and measurements
    const ingredientsList = card.querySelector('.ingredients-list');
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        const li = document.createElement('li');
        li.textContent = `${ingredient} - ${measure}`;
        ingredientsList.appendChild(li);
      }
    }

    // Add instructions text
    card.querySelector('.instructions').textContent = meal.strInstructions;

    // Hide details by default
    const details = card.querySelector('.recipe-details');
    details.style.maxHeight = '0';
    details.style.opacity = '0';
    details.style.overflow = 'hidden';
    details.style.transition = 'max-height 0.5s ease, opacity 0.5s ease';

    const toggleBtn = card.querySelector('.toggle-details-btn');
    toggleBtn.addEventListener('click', () => {
      if (details.style.maxHeight === '0px' || details.style.maxHeight === '') {
        details.style.maxHeight = '500px'; // or large enough for content
        details.style.opacity = '1';
        toggleBtn.textContent = 'Hide Details';
      } else {
        details.style.maxHeight = '0';
        details.style.opacity = '0';
        toggleBtn.textContent = 'Show Details';
      }
    });
  });
}

