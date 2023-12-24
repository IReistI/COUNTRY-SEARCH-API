const divCards = document.querySelector("#cards");
const ulResults = document.querySelector("#input__result");
const searchInput = document.querySelector(".input__search");
const form = document.querySelector(".form");
document.addEventListener("DOMContentLoaded", () => {
    const spinner = document.querySelector(".loader");  
    showLoading(spinner);
    callApi();

    searchInput.addEventListener('input', showResults);
    form.addEventListener('submit', e => {
        e.preventDefault();
        const value = searchInput.value;
        fetch(`https://restcountries.com/v3.1/name/${value}`)
            .then( response => response.json() )
            .then( result => search(result) )
            .catch( error => console.log(error) );
        
    });
    const formSelect = document.querySelector("#country");
    formSelect.addEventListener('change', e => {
        callApiRegions(e.target.value);
    });
});
async function callApi() {
    const spinner = document.querySelector(".loader");
    hideLoading(spinner);
    try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const result = await response.json();
        sessionStorage.setItem('result', JSON.stringify(result));
        createCountrys(result);
    } catch (error) {
        console.log(error);
    }
};
async function searchCountries(searchText) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${searchText}`);
        const data = await response.json();
        if(data.status === 404) {
            return [];
        } else {
            return data.map(country => country);
        }
    } catch (error) {
        ulResults.classList.remove('input__result');
        return [];
    }
};

async function callApiRegions(region) {
    cleanHTML();
    const loader = document.createElement("DIV");
    loader.classList.add("loader");
    divCards.appendChild(loader);
    showLoading(loader);
    if(region === "0") {
        const storage = sessionStorage.getItem('result');
        const data = JSON.parse(storage);
        hideLoading(loader);
        createCountrys(data);
        return;
    }
    try {
        const response = await fetch(`https://restcountries.com/v3.1/region/${region}`);
        const result = await response.json();
        hideLoading(loader);
        createCountrys(result);
    } catch (error) {
        console.log(error);
    }
};
async function showResults() {
    const searchText = searchInput.value.trim();

    if(searchText === '') {
        ulResults.innerHTML = '';
        ulResults.classList.remove('input__result');
        return;
    }
    const matchedCountries = await searchCountries(searchText);
    if(matchedCountries.length === 0) {
        ulResults.innerHTML = '';
        const listItem = document.createElement("LI");
        const listItemP = document.createElement("P");
        listItem.classList.add('input__alert');
        listItemP.textContent = `${searchText} not found`;
        
        listItem.appendChild(listItemP);
        ulResults.classList.add('input__result--alert');
        ulResults.appendChild(listItem);
        setTimeout(() => {
            listItem.remove();
        }, 5000);
        return;
    }
    ulResults.innerHTML = '';
    ulResults.classList.add('input__result');
    ulResults.classList.remove('input__result--alert');
    matchedCountries.forEach( ({flags: {svg}, name: {common}, cca3: id}) => {
        const listItem = document.createElement("LI");
        const listItemA = document.createElement("A");
        listItemA.classList.add('input__link');
        listItemA.textContent = common;
        listItemA.href = `country.html?id=${id}`;
        const listItemImg = document.createElement("IMG");
        listItemImg.src = svg;
        listItemImg.alt = `Flag: ${common}`;
        
        listItemA.appendChild(listItemImg);
        listItem.appendChild(listItemA);

        ulResults.appendChild(listItem);
    });
};
function createCountrys(result) {
    cleanHTML();
    result.forEach( ({flags: {svg, alt} ,name: {common}, population, region, capital, cca3 : id}) => {
        const article = document.createElement("ARTICLE");
        article.classList.add('card');
        const content = `
            <a href="country.html?id=${id}"><img loading="lazy" class="card__flag" src="${svg}" alt="flag ${alt ? alt : common}"></a>
            <div class="card__info">
                <h2 class="card__title">${common}</h2>
                <p class="card__text">Population: <span class="card__result">${population}</span></p>
                <p class="card__text">Region: <span class="card__result">${region}</span></p>
                <p class="card__text">Capital: <span class="card__result">${capital}</span></p>
            </div>
        `
        article.innerHTML = content;
        divCards.appendChild(article);
    });
};
function cleanHTML() {
    while(divCards.firstChild) {
        divCards.removeChild(divCards.firstChild);
    }
};
function search(result) {
    if(result.length > 0) {
        const value = result.map( value => value.cca3 );
        return window.location.href = `country.html?id=${value[0]}`;
    }
};
const showLoading = spinner => spinner.classList.add('hidden');
const hideLoading = spinner => spinner.classList.remove('hidden');