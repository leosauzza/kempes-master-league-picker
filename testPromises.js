var promises = [];

const headers = new Headers({
    'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJQb2xpbGxhIiwiaWF0IjoxNjQ5MDQ0OTM2LCJleHAiOjE2NDkxMzEzMzZ9.dSmLMvrocSCe_NgPtkRHQ7vvD53eWtiR24ZFVaNvTofmB4rxxod-nAHsOIMv8uzpPFqzwWn5KW5KqKPK6aI7BQ',
    'Content-Type': 'application/json'
});

const config = {
    method: 'get',
    headers: headers
};

function generatePromises(){
    for(let i = 0; i < 5; i++){
        promises.push(generateFetch(i))
    }
}

function generateFetch(i){
    return fetch('https://futpal-backend-prod.herokuapp.com/api/jugadores?equipoId='+i, config).then(response => console.log('promise '+ i + 'resuelta'));
}

function process(){
    generatePromises();
    // debugger;
    Promise.all(promises).then(r => console.log('juju'));
}

process();