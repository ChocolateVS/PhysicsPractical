// ************************ Drag and drop ***************** //
let dropArea = document.getElementById("drop-area");
let uploadArea = document.getElementById("upload-area");
let setupArea = document.getElementById("setup-area");
let graphArea = document.getElementById("graph-area");

let continueDiv = document.getElementById("continue-button");
let generateDiv = document.getElementById("generate-button");
let downloadDiv = document.getElementById("download-button");

let dataArray = [];

let xData = [];
let yData = [];

let numLines = 0;
let trialsAvg = [];

continueDiv.style.display = "none";
downloadDiv.style.display = "none";
setupArea.style.display = "none";
graphArea.style.display = "none";

// Prevent default drag behaviors
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false)   
  document.body.addEventListener(eventName, preventDefaults, false)
})

// Highlight drop area when item is dragged over it
;['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false)
})

;['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false)
})

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false)

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}

function highlight(e) {
  dropArea.classList.add('highlight')
}

function unhighlight(e) {
  dropArea.classList.remove('active')
}

function handleDrop(e) {
  var dt = e.dataTransfer
  var files = dt.files

  handleFiles(files)
}

let uploadProgress = []
let progressBar = document.getElementById('progress-bar')

progressBar.style.display = "none";
function initializeProgress(numFiles) {
  progressBar.style.display = "inline-block";
  progressBar.value = 0
  uploadProgress = []

  for(let i = numFiles; i > 0; i--) {
    uploadProgress.push(0)
  }
}

function updateProgress(fileNumber, percent) {
  uploadProgress[fileNumber] = percent
  let total = uploadProgress.reduce((tot, curr) => tot + curr, 0) / uploadProgress.length
  console.debug('update', fileNumber, percent, total)
  progressBar.value = total
}

function handleFiles(files) {
  files = [...files]
  initializeProgress(files.length)
  files.forEach(uploadFile)
  files.forEach(previewFile)
}

function previewFile(file) {
  let reader = new FileReader()
  let readerText = new FileReader()
  reader.readAsDataURL(file)
  reader.fileName = file.name
  reader.onload = function(readerEvt) {
    console.log(readerEvt.target.fileName);
  };
  readerText.onload = function(e) {
    console.log(e.target.result);
    parseCSV(e.target.result, '\n', ';');
  }
  readerText.readAsText(file)
  reader.onloadend = function() {
    //let fileName = document.createElement('p')
    var fileNameDisplay = reader.fileName;
    document.getElementById('gallery').innerHTML = "File Uploaded: " + fileNameDisplay;
    
  }
  continueDiv.style.display = "block";
}

function uploadFile(file, i) {
  var url = '' //Can be used to upload file somewhere if i wanna
  var xhr = new XMLHttpRequest()
  var formData = new FormData()
  xhr.open('POST', url, true)
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

  // Update progress (can be used to show progress indicator)
  xhr.upload.addEventListener("progress", function(e) {
    updateProgress(i, (e.loaded * 100.0 / e.total) || 100)
  })

  xhr.addEventListener('readystatechange', function(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      updateProgress(i, 100) // <- Add this
    }
  })

  formData.append('upload_preset', 'ujpu6gyk')
  formData.append('file', file)
  xhr.send(formData)
}

function cont() {
    uploadArea.style.display = "none"; 
    continueDiv.style.display = "none";
    setupArea.style.display = "block";
}

function parseCSV(text, lineTerminator, cellTerminator) {
	  
		//break the lines apart
		var lines = text.split(lineTerminator);
        for(var j = 0; j<lines.length; j++){
            if (lines[j] != "") {
                dataArray.push(new Array());
                dataArray[j] = lines[j].split(',');  
                numLines += 1;
            }
        }
    sortData();
}

function sortData() {
    graphTitle.value = dataArray[0].join().replace(/,/g, '');   
    yAxisTitle.value = dataArray[2][0];
    xAxisTitle.value = "Average " + dataArray[1].join().replace(/,/g, '');
    
    
    for (i = 0; i < dataArray[2].length; i++) {
       if (dataArray[2][i] != ',' && dataArray[2][i] != " " && dataArray[2][i] != "") {
           
        var trials = document.getElementById('trials');
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = "name";
        checkbox.value = "";
        checkbox.id = "trialsCheck" + i;
           
        var label = document.createElement('label')
        label.htmlFor = "trialsCheck" + i;
        label.appendChild(document.createTextNode(dataArray[2][i]));
           
        trials.appendChild(checkbox);
        trials.appendChild(label);
        
        var selAvg = document.getElementById('averageSelect');
        var selX = document.getElementById('xAxisSelect');
        var selY = document.getElementById('yAxisSelect');
        var selAmoe = document.getElementById('amoeSelect');
        var selRmoe = document.getElementById('rmoeSelect');
           
        var opt = document.createElement('option');
        var opt2 = document.createElement('option');
        var opt3 = document.createElement('option');
        var opt4 = document.createElement('option');
        var opt5 = document.createElement('option');
           
        opt.appendChild(document.createTextNode(dataArray[2][i]));
        opt2.appendChild(document.createTextNode(dataArray[2][i]));
        opt3.appendChild(document.createTextNode(dataArray[2][i]));
        opt4.appendChild(document.createTextNode(dataArray[2][i]));
        opt5.appendChild(document.createTextNode(dataArray[2][i]));
           
        opt.value = i + 1; 
        opt2.value = i + 1; 
        opt3.value = i + 1; 
        opt4.value = i + 1; 
        opt5.value = i + 1; 
           
        selAvg.appendChild(opt);
        selX.appendChild(opt2);
        selY.appendChild(opt3); 
        selAmoe.appendChild(opt4); 
        selRmoe.appendChild(opt5);           
       } 
    }
    
}
let averages = [];
let xAxisTitle = "";
let yAxisTitle = "";
let graphName = "";
let dataLabel = "";
function generate() {
    setupArea.style.display = "none";
    var pointsArray = [];
    
    for (i = 0; i < dataArray[2].length; i++) {
        if (document.getElementById('trialsCheck' + i).checked) {
            //trialsAvg.push(dataArray[2][i]);
            trialsAvg.push(i);
        }
    }
    if(document.getElementById("averageSelect").value == 0) {
        for (i = 3; i < numLines; i++) {
            var total = 0;
            trialsAvg.forEach(el => {
                total += parseFloat(dataArray[i][parseInt(el)]);
                console.log(i, el, parseFloat(dataArray[i][el]));
            });
            let average = total / trialsAvg.length;
            averages.push(average); 
        }
    }
    else {
        let value = document.getElementById("averageSelect").value;  
        for (i = 3; i < numLines; i++) {          
            let average = parseFloat(dataArray[i][value - 1]);
            averages.push(average); 
        } 
    }
    
    if(document.getElementById("xAxisSelect").value == -1) {
        averages.forEach(element => {
            xData.push(element);
        });
    } 
    else {
        let value = document.getElementById("xAxisSelect").value;  
        for (i = 3; i < numLines; i++) {          
            let x = parseFloat(dataArray[i][value - 1]);
            xData.push(x); 
        }
    }
    
    if(document.getElementById("yAxisSelect").value == -1) {
        averages.forEach(element => {
            yData.push(element);
        });
    }
    else {
        let value = document.getElementById("yAxisSelect").value;  
        for (i = 3; i < numLines; i++) {          
            let y = parseFloat(dataArray[i][value - 1]);
            yData.push(y); 
        }
    }
    //var xAxisData = dataArray[document.getElementById("xAxisTitle")];
    //var yAxisData = 

    xAxisTitle = document.getElementById("xAxisTitle").value + " in (" + document.getElementById("xAxisUnit").value + ")";
    yAxisTitle = document.getElementById("yAxisTitle").value + " in (" + document.getElementById("yAxisUnit").value + ")";
    
    pointsArray.push([xAxisTitle, yAxisTitle]);
    
    for (i = 0; i < xData.length; i++) {
        //pointsArray.push({x:xData[i], y:yData[i]});
        pointsArray.push([xData[i], yData[i]]);
    }
    
    dataLabel = document.getElementById("yAxisTitle").value + " vs " + document.getElementById("xAxisTitle").value;
    graphName = document.getElementById("graphTitle").value;
    drawGraph(graphName, xAxisTitle, yAxisTitle, pointsArray, dataLabel);
}
/////////GRAPH//////////////

function drawGraph(graphName, xAxisTitle, yAxisTitle, pointsArray, dataLabel) {
    var data2 = pointsArray;
    graphArea.style.display = "block";
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {      
        var data = google.visualization.arrayToDataTable(data2)

        var options = {
          title: graphName,
          hAxis: {title: xAxisTitle},
          vAxis: {title: yAxisTitle},
          legend: 'none'
        };

        var chart = new google.visualization.ScatterChart(document.getElementById('graph-area'));

        chart.draw(data, options);
    }
   
    downloadDiv.style.display = "block";
}

function downloadGraph() {
    var node = document.getElementById('graph-area');
    console.log("DOWLOADING??");
    domtoimage.toBlob(document.getElementById('graph-area')).then(function(blob) {
        window.saveAs(blob, dataLabel + '.png');
    });
}
//TOP LINE MUST CONTAIN ONLY THE GRAPH TITLE S
//SECOND LINE MUST CONTAIN ONLY LABEL FOR Y AXIS
//THIRD LINE MUST CONTAIN A LABEL FOR EACH COLUMN, COLUMS CAN BE IN ANY ORDER
//FIRST COLUMN SHOULD CONTAIN X AXIS DATA
//THERE CAN BE AS MANY TRIALS AND X AXIS VALUES AS YOU LIKE
//DOESNT HAVE TO BE EVEN SCALE FOR X AXIS, ADJUSTED IN GRAPHER

