console.log('working');

//http methods:
//get - obtener
//post - postear/enviar datos
//put - enviar datos para actualizar un objeto existente
//delete - eliminar
const headers = new Headers({
    'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJQb2xpbGxhIiwiaWF0IjoxNjQ5MDQ0OTM2LCJleHAiOjE2NDkxMzEzMzZ9.dSmLMvrocSCe_NgPtkRHQ7vvD53eWtiR24ZFVaNvTofmB4rxxod-nAHsOIMv8uzpPFqzwWn5KW5KqKPK6aI7BQ',
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
    button.disabled = true;
    loadingImg.style.visibility = 'visible';
    await startProcess();
    // button.disabled = false;
    await Promise.all(promises).then( r => fillTeamsDropdown());
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
    .then(data => showPlayers(data,teamName))
}

function showPlayers(playerList, teamName){
    const pList = buildListWithNameAndYear(playerList);
    const filteredList = filterPlayers(pList);

    for(let i = 0; i < matches; i++){
        const covidList = getCovidList(filteredList,covidPlayersQty);
        addToResults(teamName,i,covidList)
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

function fillTeamsDropdown(){
    const teams = results.map(r => r.teamName).filter((value, index, self) => self.indexOf(value) === index);
    const select = document.getElementById('teams');
    teams.forEach(team => { 
        var opt = document.createElement("option");
        opt.value= team;
        opt.innerHTML = team;
        select.appendChild(opt);
    })
}

function filterCovidPlayers(){
    const selectedValue = this.value;
    resultsToShow = results.filter(r => r.teamName == selectedValue);
    showResults();
}

function showResults(){
    resultsDiv.innerHTML = 'Jugadores con covid para el equipo '+ select.value + '<br>';
    resultsToShow.forEach(player => {
        resultsDiv.innerHTML += 'fecha: ' + player.matchNumber + ' nombre: ' + player.covidPlayerName + '<br>';
    });
}

var select = document.getElementById('teams');
select.onchange = filterCovidPlayers;

var button = document.getElementById('results-button');
button.onclick = buttonAction;

var loadingImg = document.getElementById('loading-image');

// startProcess();