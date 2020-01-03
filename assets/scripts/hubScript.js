var titles = ['ALL BY MYSELF', 'THE MAN IN THE PAINTING', 'SHEEP AMONG WOLVES'];
var keywords = [['I walk alone', 'i walk alone', 'I WALK ALONE'], ['Ghosts', 'ghosts'], ['Ghosts', 'ghosts'], ['Resistance', 'resistance']];

var displayed = false;
var inProcess = false;
var welcomeMessagePassed = false;
var progressionInt = -2;
var currentEpisodeInt = 0;
var animTimeFloat = 0.15;
var unlockedOpacity = 1.0;
var clickedOpacity = 0.85;
var popUpBGColor = 'rgba(0, 0, 0, 1)';
var messageTransitionDuration = "1s";
var textDelay = 2.0;
var closeVar;

window.onclick = function (event) {
    //welcomeMessage
    if (!welcomeMessagePassed) {
        if (progressionInt == -2) {
            open_welcomeMessage(document.getElementById('welcomeMessage'));
            progressionInt++; //to -1
        }
        else if (progressionInt == -1) {
            close_welcomeMessage(document.getElementById('welcomeMessage'));
            progressionInt++; //to 0;
        }
    }

    //displaying first box (station)
    if (progressionInt == 0 && welcomeMessagePassed) {
        progressionInt++; //to 1 for box1
        highlight_station(progressionInt, unlockedOpacity);
    }

    //closing popUp when clicking outside of it
    if (displayed && (event.target.classList.contains("map")
        || event.target.classList.contains("underground_map")
        || event.target.classList.contains("popUpBackground")))
        close_PopUp();
}

function open_welcomeMessage(message) {
    load_welcomeTxtFile();
    message.style.transitionDuration = messageTransitionDuration;
    message.style.backgroundColor = "rgba(0, 0, 0, 1.0)";
    sleep(messageTransitionDuration * 1000).then(() => {
        message.style.display = "block";
        message.style.color = "rgba(255, 255, 0, 1.0)";
    })
}

function close_welcomeMessage(message) {
    message.style.backgroundColor = "rgba(0, 0, 0, 0.0)";
    message.style.color = "rgba(255, 255, 0, 0.0)";
    sleep(messageTransitionDuration * 1000).then(() => {
        message.style.display = "none";
        welcomeMessagePassed = true;
    })
}

function highlight_station(stationInt, opacityFloat) {
    highlight_element(document.getElementById("box" + String(stationInt)), unlockedOpacity);
    highlight_element(document.getElementById('arrow' + String(stationInt)), unlockedOpacity);
}

function highlight_element(element, opacityFloat) {
    element.style.transitionDuration = '1s';
    element.style.opacity = opacityFloat;
}

function open_PopUp(episodeInt) {
    if (episodeInt <= progressionInt && progressionInt != 0) {
        currentEpisodeInt = episodeInt;
        highlight_element(document.getElementById('box' + String(episodeInt)), clickedOpacity);
        create_episodePopUp(episodeInt);
    }
}

function create_episodePopUp(episodeInt){
    if (!displayed && !inProcess) {
        inProcess = true;

        //Getting references from box / index.html
        var popUp = document.getElementById('popUpBox');
        var popUpBG = document.getElementById('popUpBackground');
        var popUpHeader = document.getElementById('popUpHeader');
        var popUpBody = document.getElementById('popUpBody');
        var popUpSearchBar = document.getElementById('popUpSearchBar');
        closeVar = document.getElementById('close');

        //Animating Creation of Box via css
        //Empty existing content
        popUpHeader.innerHTML = '';
        empty_innerHTML();

        popUp.style.display = 'block';
        popUpBG.style.backgroundColor = popUpBGColor;
        popUp.classList.toggle("openBox", true);

        //filling the box with content (one after one)
        sleep(textDelay + animTimeFloat * 1000).then(() => {
            closeVar.style.display = 'block';
            popUpHeader.innerHTML = titles[episodeInt - 1];
            popUpHeader.appendChild(closeVar);
            load_txtFile(String(episodeInt), popUpBody);
            sleep(animTimeFloat * 1000).then(() => {
                popUpBody.display = "block";
                sleep(animTimeFloat*1000).then(() => {
                    popUpSearchBar.style.display = 'block';
                    popUpSearchBar.focus();
                    displayed = true;
                    inProcess = false;
                })
            })
        })
    }
}

function check_Keyword(event) {
    if (event.keyCode == 13) {
        var solution = document.getElementById('popUpSearchBar').value;
        for (var i = 0; i < keywords[currentEpisodeInt-1].length; i++)
            if (keywords[currentEpisodeInt-1][i] == solution) {
                close_PopUp();
                //progress, if the solution for the last unlocked episode is typed in (hardcoded: in case of episode 2, the two last unlocked episodes)
                if (progressionInt == currentEpisodeInt || (progressionInt == 3 && currentEpisodeInt == 2)) {
                    change_map();
                    sleep(animTimeFloat*2 * 1000).then(() => {
                        unlock_nextEpisode();
                        if (progressionInt == 2) {
                            //hardcoded, because two stations appear at the same time for episode 2
                            unlock_nextEpisode();
                        }
                    })
                }
            }
    }
}

function unlock_nextEpisode() {
    progressionInt++;
    highlight_station(progressionInt, unlockedOpacity);
    highlight_element(document.getElementById('arrow' + String(progressionInt - 1)), clickedOpacity);
}

function change_map() {
    document.getElementById("map").src = "assets/images/map" + String(progressionInt+1)+".png";
}

function close_PopUp() {
    if (displayed) {
        displayed = false;
        highlight_element(document.getElementById('box' + String(currentEpisodeInt)), unlockedOpacity);
        var popUp = document.getElementById('popUpBox');
        popUp.classList.toggle("openBox", false);
        popUp.classList.toggle("popUpBox", true);
        empty_innerHTML();
    }
}

function empty_innerHTML() {
    document.getElementById('popUpSearchBar').style.display = 'none';
    document.getElementById('popUpSearchBar').value = '';
    document.getElementById('popUpBody').innerHTML = '';
    document.getElementById('popUpBody').display = 'none';
}

function load_txtFile(episodeStr, target) {
    var txtFile = new XMLHttpRequest();
    txtFile.open("GET", "assets/txt/episode" + episodeStr + ".txt", true);
    txtFile.onreadystatechange = function () {
        if (txtFile.readyState === 4 && txtFile.status == 200) {
            content = txtFile.responseText;
        }
        target.innerHTML = content;
    }
    txtFile.send(null);
}

function load_welcomeTxtFile() {
    var txtFile = new XMLHttpRequest();
    txtFile.open("GET", "assets/txt/welcomeMessage.txt", true);
    txtFile.onreadystatechange = function () {
        if (txtFile.readyState === 4 && txtFile.status == 200) {
            content = txtFile.responseText;
        }
        document.getElementById("welcomeMessage").innerHTML = content;
    }
    txtFile.send(null);
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}