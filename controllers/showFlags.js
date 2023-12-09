import { flagsService } from "../service/services.js";

const createFlags = (flag, name, population, region, capital, id) => {
    const articleFlag = document.createElement("ARTICLE");
    articleFlag.classList.add("card");
    const content = `
        <a href="country.html?id=${id}"><img loading="lazy" class="card__flag" src="${flag}" alt="flag ${name}"></a>
        <div class="card__info">
            <h2 class="card__title">${name}</h2>
            <p class="card__text">Population: <span class="card__result">${population}</span></p>
            <p class="card__text">Region: <span class="card__result">${region}</span></p>
            <p class="card__text">Capital: <span class="card__result">${capital}</span></p>
        </div>
    `;
    articleFlag.innerHTML = content;
    return articleFlag;
};
const section = document.querySelector("#cards");
flagsService.showFlags()
            .then( result => {
                result.forEach(({flag, name, population, region, capital, alpha3Code}) => {
                    const newFlag = createFlags(flag, name, population, region, capital, alpha3Code);
                    section.appendChild(newFlag);
                });
            })
            .catch( error => console.log(error) );
