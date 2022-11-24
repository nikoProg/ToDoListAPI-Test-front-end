// deletes any task based on id.
function deleteTask(id){
    fetch(`${baseUrl}/TableTasksList/${id}`, {
        method: 'DELETE'
    })
    .then(function (response) {
        console.log(response);
        if (response.ok) {
            return response.json();
        } else {
            throw 'error in fetch delete!';
        }
    })
    .then(function (array) {
        console.log(array);
        //let fetchedData = array;
        allTasks.length--;
    })
    .catch(function (error) {
        console.log(error);
    })
}


