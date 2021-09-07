const search = document.getElementById("search");
const submit = document.getElementById("submit");
const random = document.getElementById("random");
const mealsEl = document.getElementById("meals");
const resultHeading = document.getElementById(
  "result-heading"
);
const single_mealEl = document.getElementById(
  "single-meal"
);
var target=document.querySelector('#footer');
//SearchMeal from API
function searchMeal(e) {
  e.preventDefault();

  // Clear single Meal
  single_mealEl.innerHTML = "";

  //get search Term
  const term = search.value;

  //Check for empty
  if (term.trim()) {
    fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
    )
      .then((res) => res.json())
      .then((data) => {
        resultHeading.innerHTML = `<h2>Search Result For ${term} : </h2>`;

        if (data.meals === null) {
          resultHeading.innerHTML = `<h2> There are No Search results for ${term}</h2>`;
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `
                 <div class="meal">
                 <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                 <div class="meal-info" data-mealID="${meal.idMeal}">
                    <h3>${meal.strMeal}</h3>
                 </div>
                 </div>
                `
            )
            .join("");
            smoothScroll(mealsEl,1000);
        }
      });

    //Clear Search Term
    search.value = "";
  } else {
    alert("please enter a search value");
  }
}

//Fetch Meal By Id

function getMealById(mealID) {
  fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
  )
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
      smoothScroll(target,1000);
    });
    
}

//fetch Meal 
function randomMeal(){
    //Clear Meals and Heading
    mealsEl.innerHTML='';
    resultHeading.innerHTML='';

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
        const meal = data.meals[0];
        addMealToDOM(meal);
        smoothScroll(single_mealEl,1000);
    })
    
}

//Add meal to DOM

function addMealToDOM(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${
          meal[`strMeasure${i}`]
        }`
      );
    }else{
        break;
    }
  }

  single_mealEl.innerHTML = `
  <div class="single-meal">
  <h1>${meal.strMeal}</h1>
  <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
  <div class="single-meal-info">
  ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
  ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
  </div>
  <div class="main">
  <p>${meal.strInstructions}</p>
  <h2>Ingredients</h2>
  <ul>
  ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
  </ul>
  </div>
  </div>
  `
}

//Event Listerner
submit.addEventListener("submit", searchMeal);
random.addEventListener('click',randomMeal);
mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });
  if (mealInfo) {
    const mealID = mealInfo.getAttribute(
      "data-mealid"
    );
    getMealById(mealID);
  }
});


///smooth scroll

function smoothScroll(target,duration){
  // var target=document.querySelector(target);
  var targetPostion = target.getBoundingClientRect().top;
  var startingposion= window.pageYOffset;
  var distance=targetPostion-startingposion;
  var startTime=null;
  function animation(currenttime){
      if(startTime==null) startTime=currenttime
      var timeElapsed=currenttime-startTime;
      var run = ease(timeElapsed,startingposion,distance,duration);
      window.scrollTo(0,run);
      if(timeElapsed < duration) requestAnimationFrame(animation);
  }

  function ease(t,b,c,d){
      t /= d/2;
      if(t<1) return c/2 * t* t +b;
      t--;
      return -c/2 * (t * (t-2)-1 )+ b;
  }
  requestAnimationFrame(animation);
}