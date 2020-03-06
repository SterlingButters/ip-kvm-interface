var socketTx = io();
var socketRx = io.connect();

document.addEventListener("DOMContentLoaded", function(){

    var siofu = new SocketIOFileUpload(socketRx);
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

function refreshFiles() {

  fileDropdown = document.getElementById("fileDropdown");

  socketTx.emit('fileChannel', "RESET");
  socketRx.on('fileChannel', function(data) {
    if (data.Status) {
      // data is received [button press]x -- why?
      console.log(data);
      fileDropdown.innerHTML = '';

      for (var file in data.Files) {
        const option = document.createElement('option');
        option.value = data.Files[file];
        option.text = data.Files[file];
        fileDropdown.appendChild(option);
      }
    }
  });
}

function attachFile() {

        var file = document.getElementById('fileDropdown').value;
        var cdrom = document.getElementById('cdrom').checked;
        var removable = document.getElementById('removable').checked;
        var readonly = document.getElementById('read-only').checked;
        var stall = document.getElementById('stall').checked;
        var fua = document.getElementById('nofua').checked;

        var message = {Command: "Attach",
              File: file,
           CDRom: +cdrom,
       Removable: +removable,
         ReadOnly: +readonly,
            FUA: +fua};
        socketTx.emit('fileChannel', message);

        // Receive attached files or > 8 message
        socketRx.on('fileChannel', function(data){
  if(!data.Status) {
        console.log(data);
        alert('File Attached as Lun');
          // alert(data);

    var tbdy = document.createElement('tbody');

    for (var lun in data) {
    console.log(lun);
    var tr = document.createElement('tr');
    tr.appendChild(document.createElement('td').appendChild(document.createTextNode(lun)));

    for (var info in data[lun]) {
      var td = document.createElement('td');
      td.appendChild(document.createTextNode(data[lun][info]))
        tr.appendChild(td)
    }
    tbdy.appendChild(tr);
    }

    var table = document.getElementById('file-table')
    var old_tbdy = table.getElementsByTagName('tbody')[0];

    if (!old_tbdy) {
    table.appendChild(tbdy);
    } else {
    table.replaceChild(tbdy, old_tbdy)
    }
  };
        });
      };

      function detachFile() {
        alert('Detaching File');

var file = document.getElementById('fileDropdown').value;

        var message = {Command: "Detach", Argument: file};
        socketTx.emit('fileChannel', message);
      };
