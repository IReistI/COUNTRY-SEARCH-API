const showFlags = () => fetch("data.json").then( response => response.json() );
// const flag = (id) => {
//     return fetch(`data.json.alpha3Code`)
// };
export const flagsService = {
    showFlags,
};
