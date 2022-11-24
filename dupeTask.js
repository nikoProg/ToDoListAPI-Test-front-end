function dupeTask(id){
    fetch(`${baseUrl}/TableTasksList/dupe=${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(arr => {
        console.log('successful duplicate!', arr);
        startPoint = allTasks.length - allTasks.length % 10;
        //setTimeout(getAllTasks(), 200); 
        allTasks.length++;
        setTimeout(getTasks(), 200);
    })
    .catch((error) => {
        console.error('error on duplicate!', error);
    });
}