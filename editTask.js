// this function finds an item by ID, takes its properties and then edits them, as written in the html.
function editTask(id, _isCompleted, taskText){
    // I will GET a certain ID, then PUT changes into that item 
    var fetchedData;
    fetch(`${baseUrl}/TableTasksList/${id}`, {
        method: 'GET'
    })
    .then(function (response) {
        console.log(response);
        if (response.ok) {
            return response.json();
        } else {
            throw 'error in fetch!';
        }
    })
    .then(function (array) {
        console.log(array);
        fetchedData = array;
        fetchedData.isCompleted = _isCompleted;
        fetchedData.task = taskText;
        fetch(`${baseUrl}/TableTasksList/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(fetchedData),
        })
        .then(response => response.json())
        .then(fetchedData => {
            console.log('successful edit!', fetchedData);
            getTasks(); 
        })
        .catch((error) => {
            console.error('error on edit!', error);
        });
    })
    .catch(function (error) {
        console.log(error);
    })
}