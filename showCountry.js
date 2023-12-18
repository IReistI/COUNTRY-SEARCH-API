async function showCountry() {
    const url = new URL(window.location);
    const id = (url.searchParams.get("id"));
    try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${id}`);
        const result = await response.json();
        showResult(result);
    } catch (error) {
        console.log(error);
    }
};
showCountry();
function showResult(result) {
    const countrySection = document.querySelector(".country");
    result.forEach( ({flags: {svg}, name: {common, nativeName}, population, region, subregion, capital, tld, currencies, languages, borders}) => {
        const native = Object.values(nativeName);
        const curr = Object.values(currencies);
        const lan = Object.values(languages);

        const content = `
            <img class="country__flag" src="${svg}" alt="${common}">
            <div>
                <h1 class="country__title">${common}</h1>
                <article>
                    <p class="country___text">Native Name: <span class="country__result">${native[0].common}</span></p>
                    <p class="country___text">Population: <span class="country__result">${population}</span></p>
                    <p class="country___text">Region: <span class="country__result">${region}</span></p>
                    <p class="country___text">Subregion: <span class="country__result">${subregion}</span></p>
                    <p class="country___text">Capital: <span class="country__result">${capital ? capital[0] : `does not have`}</span></p>
                </article>
                <article>
                    <p class="country___text country___text--margin">Top Level Domain: <span class="country__result">${tld[0]}</span></p>
                    <p class="country___text">Currencies: <span class="country__result">${curr[0].name}</span></p>
                    <p class="country___text">Lenguages: <span class="country__result">${createLanguage(lan)}</span></p>
                </article>
                <article>
                    <h2 class="country__borders-title">Border Countries:</h2>
                    <div class="country__borders">
                        ${borders ? createBorders(borders) : `<p class="country__border country__border--not" href="#">does not border any country</p>`}
                    </div>
                </article>
            </div>
        `
        console.log(content);
        countrySection.innerHTML = content;
    });
};
const createLanguage = languages => languages.join(', ');
function createBorders(borders) {
    let content = '';
    borders.forEach( border => content += `<a class="country__border" href="country.html?id=${border}">${border}</a>` );
    return content;
};