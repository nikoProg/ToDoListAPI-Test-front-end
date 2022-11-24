//this function is mostly used for multiple selected items, using the 2nd parameter to determine if it will be true or false
function checkUncheckExplicit(id, _isCompleted){
    // I will GET a certain ID, then PUT changes that item 
    var fetchedData;
    fetch(`${baseUrl}/TableTasksList/${id}`, {
        method: 'GET'
    })
    .then(function (response) {
        console.log(response);
        if (response.ok) {
            return response.json();
        } else {
            throw 'error in get!';
        }
    })
    .then(function (array) {
        console.log(array);
        fetchedData = array;
        fetchedData.isCompleted = _isCompleted; //just changing the isCompleted property and sending it back to the API
        fetch(`${baseUrl}/TableTasksList/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(fetchedData),
        })
        .then(response => response.json())
        .then(fetchedData => {
            console.log('successful PUT!', fetchedData);
            getTasks(); // if there is an error, nothing should change, so I call a new GET to refresh the page on success only
        })
        .catch((error) => {
            console.error('error on PUT!', error);
        });
    })
    .catch(function (error) {
        console.log(error);
    })
    // I had some trouble here because of asynchronous function execution, so the fetchedData will try to do something before the GET request finishes
    // So I moved the entire PUT request nested inside the GET
}