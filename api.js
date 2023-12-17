document.addEventListener("DOMContentLoaded", () => {
    callApi();
});

async function callApi() {
    try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const result = await response.json();
        createCountrys(result);
    } catch (error) {
        console.log(error);
    }
};

function createCountrys(result) {
    const section = document.querySelector("#cards");
    result.forEach( ({flags: {svg} ,name: {common}, population, region, capital, cca3 : id}) => {
        const article = document.createElement("ARTICLE");
        article.classList.add('card');
        const content = `
            <a href="country.html?id=${id}"><img loading="lazy" class="card__flag" src="${svg}" alt="flag ${common}"></a>
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
