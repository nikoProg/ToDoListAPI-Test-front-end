//this function calls the special API method that only switches the "isCompleted" property, regardless if it's true or false.
function checkTask(id){
    fetch(`${baseUrl}/TableTasksList/check-uncheck=${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(arr => {
        console.log('successful check or uncheck!', arr);
        getTasks(); // if there is an error, nothing should change, so I call a new GET to refresh the page on success only
    })
    .catch((error) => {
        console.error('error on check or uncheck!', error);
    });
}
