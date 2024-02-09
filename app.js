import { createCountrys, cleanHTML, search, showLoading, hideLoading, darkMode, verifyDarkMode, debouncearFunction } from "./assets/js/functions.js";
import { divCards, ulResults, searchInput, form, darkModeBtn } from "./assets/js/const.js";
let itemsPerPage = 20;
let currentPage = 1;
let totalPages;
let iterator;

document.addEventListener("DOMContentLoaded", () => {
    verifyDarkMode();
    const spinner = document.querySelector(".loader");  
    showLoading(spinner);
    fetchAndDisplay();

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
async function fetchCountries() {
    const spinner = document.querySelector(".loader");
    if(spinner) {
        hideLoading(spinner);
    }
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const result = await response.json();
        sessionStorage.setItem('result', JSON.stringify(result));
        return result;
    } catch (error) {
        console.log(error);
    }
};

function displayCountries(countries) {
    cleanHTML();

    const start = (currentPage - 1) * itemsPerPage;
    const end = currentPage * itemsPerPage;

    const displayedCountries = countries.slice(start, end);
    createCountrys(displayedCountries);
};

function displayPagination(totalPages) {
    const pagination = document.getElementById('pagination');
    while(pagination.firstChild) {
        pagination.removeChild(pagination.firstChild);
    }
    iterator = createPaginator(totalPages);
    while(true) {
        const {value, done} = iterator.next();
        if(done) return;
        const li = document.createElement('LI');
        li.classList.add('menu-item');

        if(currentPage === value) {
            li.classList.add('active');
        }

        const button = document.createElement('BUTTON');
        button.textContent = value;
        button.classList.add('page-link');
        button.onclick = () => {
            currentPage = value;

            fetchAndDisplay();
        }
        li.appendChild(button);
        pagination.appendChild(li);
    }
};

async function fetchAndDisplay() {
    const countries = await fetchCountries();
    const totalPages = Math.ceil(countries.length / itemsPerPage);
    displayCountries(countries);
    displayPagination(totalPages);
};

let debounceRequest = debouncearFunction( () => {
    showResults();
}, 300);
function *createPaginator(totalPages) {
    for (let i = 1; i <= totalPages; i++ ) {
        yield i;
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

