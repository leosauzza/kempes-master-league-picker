var results = [];
var resultsToShow = [];

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

function showResults(){
    resultsDiv.innerHTML = 'Jugadores con covid para el equipo '+ select.value + '<br>';
    resultsToShow.forEach(player => {
        let matchNumber = player.matchNumber +1
        resultsDiv.innerHTML += 'fecha: ' + matchNumber + ' nombre: ' + player.covidPlayerName + '<br>';
    });
}

function filterCovidPlayers(){
    const selectedValue = this.value;
    resultsToShow = results.filter(r => r.teamName == selectedValue);
    showResults();
}

function startProcess(){
    if(!textarea.value){
        alert('dale pelotudo');
        return;
    }

    try{
        const resultObj = JSON.parse(textarea.value);
        results = resultObj.results;
        fillTeamsDropdown();
        competitionTitle.innerText = resultObj.competition;
        select.style.visibility = 'visible';
        button.disabled = true;
    }
    catch (error){
        alert('dale pelotudo');
        console.log(error);
        textarea.value = '';
    }
}

var resultsDiv = document.getElementById('resultsDiv');

var select = document.getElementById('teams');
select.onchange = filterCovidPlayers;

var textarea = document.getElementById('jsonstring');
var button = document.getElementById('button');
button.onclick = startProcess;

var competitionTitle = document.getElementById('competitionTitle');
