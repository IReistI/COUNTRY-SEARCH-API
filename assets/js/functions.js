import {divCards, body} from "../js/const.js";
export function createCountrys(result) {
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
export function cleanHTML() {
    while(divCards.firstChild) {
        divCards.removeChild(divCards.firstChild);
    }
};
export function search(result) {
    if(result.length > 0) {
        const value = result.map( value => value.cca3 );
        return window.location.href = `country.html?id=${value[0]}`;
    }
};
export function darkMode() {
    if(body.classList.contains('darkModeBtn')) {
        body.classList.remove('darkModeBtn');
        localStorage.setItem('darkMode', 'disabled');
    } else {
        body.classList.add('darkModeBtn');
        localStorage.setItem('darkMode', 'activated');
    }
};
export function verifyDarkMode() {
    const darkMode = localStorage.getItem('darkMode');
    if(darkMode === 'activated') {
        body.classList.add('darkModeBtn');
        return;
    };
};
export const showLoading = spinner => spinner.classList.add('hidden');
export const hideLoading = spinner => spinner.classList.remove('hidden');