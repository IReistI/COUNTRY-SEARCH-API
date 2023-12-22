document.addEventListener("DOMContentLoaded", () => {
    callApi();

    const formSelect = document.querySelector("#country");
    formSelect.addEventListener('change', e => {
        callApiRegions(e.target.value);
    })
});

async function callApi() {
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
    if(region === "0") {
        const storage = sessionStorage.getItem('result');
        const data = JSON.parse(storage);
        createCountrys(data);
        return;
    }
    try {
        const response = await fetch(`https://restcountries.com/v3.1/region/${region}`);
        const result = await response.json();
        createCountrys(result);
    } catch (error) {
        console.log(error);
    }
};

function createCountrys(result) {
    cleanHTML();
    const section = document.querySelector("#cards");
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
        section.appendChild(article);
    });
};
function cleanHTML() {
    const section = document.querySelector("#cards");
    while(section.firstChild) {
        section.removeChild(section.firstChild);
    }
};