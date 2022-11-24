//creates a new task, requires all properties, except id.
function createTask(){
    const data = {
        task: taskInputFieldCreate.value,
        isCompleted: !!(isCompletedCreateCheckbox.value), // this can convert the checkbox value into boolean that C# API will accept
        entryDate: moment(Date.now()).format("YYYY-MM-DDTHH:mm:ss.SSS")
    }
    fetch(`${baseUrl}/TableTasksList/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('successful POST!', data);
        startPoint = allTasks.length - allTasks.length % 10;
        //setTimeout(getAllTasks(), 200);
        allTasks.length++;
        setTimeout(getTasks(), 200);
    })
    .catch((error) => {
        console.error('error on POST!', error);
    });
}