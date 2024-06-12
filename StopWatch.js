var hundredth = 0;
var seconds = 0;
var minutes = 0;
var hours = 0;
var run = false;
var timer;

var msecDisp = document.getElementById("msec");
var secDisp = document.getElementById("sec");
var minDisp = document.getElementById("min");
var hrDisp = document.getElementById("hr");
var playBtn = document.getElementsByClassName("material-symbols-rounded")[0];
var lapButton = document.getElementById("lapButton");

var lapCount = 0;
var timeStamps = [];
var timeDiff = [];
var lapRows = [];

function toggleTimer() {
    if (run) {
        clearInterval(timer);
        playBtn.innerHTML = "play_arrow";
        run = false;
    } else {
        if (timeStamps.length === 0) {
            timeStamps.push(performance.now());
        }
        timer = setInterval(count, 10);
        playBtn.innerHTML = "pause";
        run = true;
    }
}

function resetTimer() {
    clearInterval(timer);
    playBtn.innerHTML = "play_arrow";
    msecDisp.innerHTML = "00";
    secDisp.innerHTML = "00.";
    minDisp.innerHTML = "00:";
    hrDisp.innerHTML = "00:";
    hundredth = 0;
    seconds = 0;
    minutes = 0;
    hours = 0;
    run = false;

    lapCount = 0;
    timeStamps = [];
    timeDiff = [];
    lapRows = [];

    var parent = document.getElementById("recData");
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    document.getElementById("recTable").style.visibility = "hidden";
}

function count() {
    hundredth += 1;
    if (hundredth === 100) {
        hundredth = 0;
        seconds += 1;
    }
    if (seconds === 60) {
        seconds = 0;
        minutes += 1;
    }
    if (minutes === 60) {
        minutes = 0;
        hours += 1;
    }
    disp(hundredth, seconds, minutes, hours);
}

function disp(hun, sec, min, hr) {
    msecDisp.innerHTML = hun.toLocaleString(undefined, { minimumIntegerDigits: 2 });
    secDisp.innerHTML = sec.toLocaleString(undefined, { minimumIntegerDigits: 2 }) + ".";
    minDisp.innerHTML = min.toLocaleString(undefined, { minimumIntegerDigits: 2 }) + ":";
    hrDisp.innerHTML = hr.toLocaleString(undefined, { minimumIntegerDigits: 2 }) + ":";
}

function recordData() {
    if (!run) return;

    lapCount += 1;
    var currentTime = performance.now();
    var lapTime;

    if (lapCount === 1) {
        lapTime = currentTime - timeStamps[0];
    } else {
        lapTime = currentTime - timeStamps[timeStamps.length - 1];
    }

    timeStamps.push(currentTime);
    timeDiff.push(lapTime);

    var lapHours = Math.floor(lapTime / 3600000);
    lapTime %= 3600000;
    var lapMinutes = Math.floor(lapTime / 60000);
    lapTime %= 60000;
    var lapSeconds = Math.floor(lapTime / 1000);
    var lapHundredths = Math.floor((lapTime % 1000) / 10);

    var newRow = document.createElement("tr");
    var newLap = document.createElement("td");
    var newTime = document.createElement("td");
    var newTotal = document.createElement("td");

    newLap.innerHTML = lapCount;

    newTime.innerHTML =
        lapHours.toLocaleString(undefined, { minimumIntegerDigits: 2 }) +
        ":" + lapMinutes.toLocaleString(undefined, { minimumIntegerDigits: 2 }) +
        ":" + lapSeconds.toLocaleString(undefined, { minimumIntegerDigits: 2 }) +
        "." + lapHundredths.toLocaleString(undefined, { minimumIntegerDigits: 2 });

    newTotal.innerHTML = hours.toLocaleString(undefined, { minimumIntegerDigits: 2 }) +
        ":" + minutes.toLocaleString(undefined, { minimumIntegerDigits: 2 }) +
        ":" + seconds.toLocaleString(undefined, { minimumIntegerDigits: 2 }) +
        "." + hundredth.toLocaleString(undefined, { minimumIntegerDigits: 2 });

    newRow.appendChild(newLap);
    newRow.appendChild(newTime);
    newRow.appendChild(newTotal);

    lapRows.push(newRow);
    document.getElementById("recData").insertBefore(
        newRow,
        document.getElementById("recData").childNodes[0]
    );

    highlightLaps();
    document.getElementById("recTable").style.visibility = "visible";
}

function highlightLaps() {
    if (lapRows.length > 1) {
        var minIndex = 0;
        var maxIndex = 0;
        for (var i = 1; i < timeDiff.length; i++) {
            if (timeDiff[i] < timeDiff[minIndex]) {
                minIndex = i;
            }
            if (timeDiff[i] > timeDiff[maxIndex]) {
                maxIndex = i;
            }
        }

        for (var row of lapRows) {
            row.style.backgroundColor = "";
        }

        if (lapRows[minIndex]) lapRows[minIndex].style.backgroundColor = "green";
        if (lapRows[maxIndex]) lapRows[maxIndex].style.backgroundColor = "red";
    }
}
