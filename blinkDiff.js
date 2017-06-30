var fs = require('fs');
var BlinkDiff = require('blink-diff')

if (process.argv.length <= 4) {
    console.log("Usage: node " + __filename + " path/to/inputImageFolder" + " path/to/testImageFolder" + " path/to/outputImageFolder");
    process.exit(-1);
}
 
var inputImageFolder = process.argv[2];
var testImageFolder = process.argv[3];;
var outputImageFolder = process.argv[4];;

var imageName = '';

fs.readdir(inputImageFolder, function(err, items) {
    
    if (!fs.existsSync(outputImageFolder)){
    fs.mkdirSync(outputImageFolder);
}

    for (var i=0; i<items.length; i++) {
        imageName=items[i];
        blinkDiff(imageName, inputImageFolder, testImageFolder, outputImageFolder);
    }
});

function getExtension(filename) {
   //console.log(filename.substring(filename.indexOf('.')));
    return filename.substring(filename.indexOf('.')).toLowerCase();
}

function getDateTime() {
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }   
    if(hour.toString().length == 1) {
        var hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        var minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        var second = '0'+second;
    }   
    var dateTime = year+'_'+month+'_'+day+' '+hour+'_'+minute+'_'+second;   
     return dateTime;
}

function blinkDiff(imageName, inputImageFolder, testImageFolder, outputImageFolder){
    if(getExtension(imageName).toLowerCase()==='.png'){
        var diff = new BlinkDiff({
        imageAPath: inputImageFolder+'/'+imageName, // Use file-path
        imageBPath: testImageFolder+'/'+imageName,

        thresholdType: BlinkDiff.THRESHOLD_PERCENT,
        threshold: 0.0, // 1% threshold
             
        hideShift: true,

        imageOutputPath:outputImageFolder+'/'+imageName.replace(/\.[^/.]+$/, "") + "_" + getDateTime() + '.png',

        imageOutputLimit: BlinkDiff.OUTPUT_DIFFERENT

    });


    diff.run(function (error, result) {
        if (error) {
            throw error;
          } else {
            console.log(diff.hasPassed(result.code) ? imageName + ' Passed' : imageName + ' Failed');
                //console.log('\n');
          console.log('Found ' + result.differences + ' differences.');
          //console.log('\n');
        }
    });
    }
    else{
        console.error('Only png files should be pass, ' + imageName + ' is not a valid .PNG file')
    }
     
}