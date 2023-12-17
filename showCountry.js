async function showCountry() {
    const url = new URL(window.location);
    const id = (url.searchParams.get("id"));
    if(id === null) {
        window.location = "https://www.hola.com/";
    }
    try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${id}`);
        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.log(error);
    }
};
showCountry();
function showResult(result) {
    
};