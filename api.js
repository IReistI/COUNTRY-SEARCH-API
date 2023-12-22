const divCards = document.querySelector("#cards");
document.addEventListener("DOMContentLoaded", () => {
    const spinner = document.querySelector(".loader");  
    showLoading(spinner);
    callApi();

    const formSelect = document.querySelector("#country");
    formSelect.addEventListener('change', e => {
        callApiRegions(e.target.value);
    })
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

const showLoading = spinner => spinner.classList.add('hidden');
const hideLoading = spinner => spinner.classList.remove('hidden');