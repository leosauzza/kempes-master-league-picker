console.log('working');

//http methods:
//get - obtener
//post - postear/enviar datos
//put - enviar datos para actualizar un objeto existente
//delete - eliminar
const headers = new Headers({
    'Authorization': 'Bearer token',
    'Content-Type': 'application/json'
});

const config = {
    method: 'get',
    headers: headers
};

const matches = 15;

const covidPlayersQty = 3;

const resultsDiv = document.getElementById('results');

var results = [];

function startProcess(){
    resultsDiv.innerHTML = '';
    results = [];

    fetch('https://futpal-backend-prod.herokuapp.com/api/obtener-equipos-aprobados', config)
    .then(response => response.json())
    .then(teams => getAllCovidPlayers(teams))
    .then(console.log(results));
}

function buttonAction(){
    startProcess();
    // var r =  startProcess().then(a => console.log(results));
    // r.then(a => console.log(results))
}

function getAllCovidPlayers(teams){
    teams.forEach(team => {
        getCovidPlayersByTeam(team.id, team.nombreEquipo);
    });
}
function getCovidPlayersByTeam(teamId, teamName){
    fetch('https://futpal-backend-prod.herokuapp.com/api/jugadores?equipoId='+teamId,config)
    .then(response => response.json())
    .then(data => showPlayers(data,teamName))
}

function showPlayers(playerList, teamName){
    const pList = buildListWithNameAndYear(playerList);
    const filteredList = filterPlayers(pList);

    for(let i = 0; i < matches; i++){
        const covidList = getCovidList(filteredList,covidPlayersQty);
        addToResults(teamName,i,covidList)
        // printList(covidList, i,teamName);
    }

}

function filterPlayers(list){
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


var button = document.getElementById('results-button');
button.onclick = buttonAction;
// startProcess();