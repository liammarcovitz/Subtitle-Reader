var videoElement = document.getElementById("video");
var subtitlesEl = document.getElementById("subtitles");
var subs = "Refresh and add .srt file for subtitles.";
var secondsOfNextSub = 0;
var secondsOfEndSub = Number.MAX_SAFE_INTEGER;
var currentSubInt = 1;
var playing = false;
var lines;
var temp;
var hasFile = false;

function readFile(input) {
    let file = input.files[0];
  
    let reader = new FileReader();
  
    reader.readAsText(file);
  
    reader.onload = function() {
      temp = reader.result;
    };
  
    reader.onerror = function() {
      console.log(reader.error);
    };

    setTimeout(() => {
        lines = temp.split("\n");
        subtitlesEl.innerHTML = "";
    }, 50);

    hasFile = true;
}

function updateSubs() {
    if (!hasFile) {
        subtitlesEl.innerHTML = subs;
        return;
    }
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].startsWith(currentSubInt.toString() + "")) {

            // start sub time
            var hour = parseInt(lines[i + 1][0] + lines[i + 1][1]);
            var minute = parseInt(lines[i + 1][3] + lines[i + 1][4]);
            var second = parseFloat(lines[i + 1][6] + lines[i + 1][7] + "."
            + lines[i + 1][9] + lines[i + 1][10] + lines[i + 1][11]);

            var totalSeconds = (hour * 3600) + (minute * 60) + second;
            secondsOfNextSub = totalSeconds;
            currentSubInt += 1;
            
            // end sub time
            hour = parseInt(lines[i + 1][17] + lines[i + 1][18]);
            minute = parseInt(lines[i + 1][20] + lines[i + 1][21]);
            second = parseFloat(lines[i + 1][23] + lines[i + 1][24] + "."
            + lines[i + 1][26] + lines[i + 1][27] + lines[i + 1][28]);

            totalSeconds = (hour * 3600) + (minute * 60) + second;
            secondsOfEndSub = totalSeconds;

            // text subs
            if (lines[i + 3] != "") {
                subs = lines[i + 2] + "<br>" + lines[i + 3];
            }
            else {
                subs = lines[i + 2]
            }

            return;
        }
    }
    currentSubInt = 0;
    updateSubs();
}

function looper() {
    if (playing) {
        setTimeout(() => {
            if (videoElement.currentTime >= secondsOfEndSub) {
                subtitlesEl.innerHTML = " ";
                updateSubs();
            }
            else if (videoElement.currentTime >= secondsOfNextSub) {
                subtitlesEl.innerHTML = subs;
            }
            looper();
        }, 10);
    }
}

function resume() {
    videoElement.play();
    playing = true;
    updateSubs();
    looper();
}

function pause() {
    videoElement.pause();
    playing = false;
}