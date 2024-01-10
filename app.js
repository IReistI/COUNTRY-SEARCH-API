import { createCountrys, cleanHTML, search, showLoading, hideLoading, darkMode, verifyDarkMode, debouncearFunction } from "./assets/js/functions.js";
import { divCards, ulResults, searchInput, form, darkModeBtn } from "./assets/js/const.js";
document.addEventListener("DOMContentLoaded", () => {
    verifyDarkMode();
    const spinner = document.querySelector(".loader");  
    showLoading(spinner);
    callApi();

    searchInput.addEventListener('input', debounceRequest);
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
    darkModeBtn.addEventListener('click', darkMode);
});
let debounceRequest = debouncearFunction( () => {
    showResults();
}, 300);
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

