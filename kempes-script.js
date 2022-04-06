console.log('working');

//http methods:
//get - obtener
//post - postear/enviar datos
//put - enviar datos para actualizar un objeto existente
//delete - eliminar
const headers = new Headers({
    'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJQb2xpbGxhIiwiaWF0IjoxNjQ5MjE1MTYwLCJleHAiOjE2NDkzMDE1NjB9.RSUWZrv0SdcbkKsLIRBitZQVJq1B0EcIZY3dZO_po1ehKoQsEsmDobNvHbrDO4fYeVyywD30knEDTcvLZB7t7w',
    'Content-Type': 'application/json'
});

const config = {
    method: 'get',
    headers: headers
};

var matches = 15;

const covidPlayersQty = 3;

const resultsDiv = document.getElementById('results');

var results = [];

var promises = [];

var resultsToShow = [];

async function startProcess(){
    // resultsDiv.innerHTML = '';
    results = [];

    await fetch('https://futpal-backend-prod.herokuapp.com/api/obtener-equipos-aprobados', config)
    .then(response => response.json())
    .then(teams => getAllCovidPlayers(teams))
    // .then(console.log(results));
}

async function buttonAction(){

    if(!matchQtyInput.value || !competitionInput.value){
        alert('Dale pelotudo');
        return;
    }

    if(isNaN(matchQtyInput.value)){
        alert('Dale pelotudo, pone bien la cantidad de partidos');
        matchQtyInput.value = null;
        return;
    }
    matches = matchQtyInput.value;
    
    button.disabled = true;
    loadingImg.style.visibility = 'visible';

    await startProcess();
    await Promise.all(promises).then( r => printJson());
    loadingImg.style.visibility = 'hidden';

}

function getAllCovidPlayers(teams){
    teams.forEach(team => {
        promises.push(getCovidPlayersByTeam(team.id, team.nombreEquipo));
    });
}
function getCovidPlayersByTeam(teamId, teamName){
    return fetch('https://futpal-backend-prod.herokuapp.com/api/jugadores?equipoId='+teamId,config)
    .then(response => response.json())
    .then(data => buildCovidPlayersList(data,teamName))
}

function buildCovidPlayersList(playerList, teamName){
    const pList = buildListWithNameAndYear(playerList);
    const filteredList = filterPlayersByYear(pList);

    for(let i = 0; i < matches; i++){
        const covidList = getCovidList(filteredList,covidPlayersQty);
        addToResults(teamName,i,covidList)
    }
}

function filterPlayersByYear(list){
    const newList = list.filter(p => p.year < 2000);
    return newList
}

function printList(list, matchNumber,teamName){
    var resultList = resultsDiv;
    resultList.innerHTML += '-- Equipo: '+ teamName + ' - Fecha: '+ matchNumber + ' -- <br>';
        list.forEach(player => {
        resultList.innerHTML += 'nombre: ' + player.name + ' year: ' + player.year + '<br>';
    });
    resultList.innerHTML += '<br>';
}

function buildListWithNameAndYear(list){
    const birthDateList = list.map(player => {
        // return new Date(Date.parse(player.fechaNacimiento));
        let year = player.fechaNacimiento.split('-')[0];
        return {
            name: player.nombre,
            year: parseInt(year)
        }
    });

    return birthDateList;
}

function getCovidList(playerList, covidPlayersQty){
    let resultList = [];
    for(let i = 0; i < covidPlayersQty; i++){
        const index = choseRandomPlayer(playerList,resultList);
        resultList.push(playerList[index])
    }
    return resultList;
}

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function choseRandomPlayer(playerList, resultList){
    const min = 0;
    const max = playerList.length;;
    let chosenIndex = getRandomArbitrary(min,max);
    let playerExists = resultList.some(p => p.name === playerList[chosenIndex].name);

    if(playerExists){
        return choseRandomPlayer(playerList, resultList);
    }
    else{
        return chosenIndex;
    }
}

function addToResults(teamName,matchNumber,covidList){
    covidList.forEach(covidPlayer => {
        results.push({
            teamName: teamName,
            matchNumber: matchNumber,
            covidPlayerName: covidPlayer.name
        });
    })

}

function printJson(){
    var objResult = {
        competition: competitionInput.value,
        results: results
    };
    
    resultsDiv.innerText = JSON.stringify(objResult);
}


var button = document.getElementById('results-button');
button.onclick = buttonAction;

var loadingImg = document.getElementById('loading-image');

var competitionInput = document.getElementById('competition');
var matchQtyInput = document.getElementById('matchQty')
// startProcess();