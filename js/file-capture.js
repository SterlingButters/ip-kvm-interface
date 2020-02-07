document.addEventListener("DOMContentLoaded", function(){

    // Initialize instances:
    var socket = io.connect();
    var siofu = new SocketIOFileUpload(socket);

    var fileDropdown = document.getElementById("fileDropdown");
    var fileProgress = document.getElementById("fileProgress");

    siofu.listenOnInput(document.getElementById("upload_input"));

    // Do something on upload progress:
    siofu.addEventListener("progress", function(event){
        var percent = event.bytesLoaded / event.file.size * 100;
        fileProgress.value = percent.toFixed(2);
        console.log("File is", percent.toFixed(2), "percent loaded");
    });

    // Do something when a file is uploaded:
    siofu.addEventListener("complete", function(event){
        fileProgress.value = 0;
        console.log(event.success);
        console.log(event.file);
        const option = document.createElement('option');
        option.value = event.file['name'];
        option.text = event.file['name'];
        fileDropdown.appendChild(option);
    });

}, false);
