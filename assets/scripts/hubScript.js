var titles = ['Case A-02342', 'THE MAN IN THE PAINTING', 'SHEEP AMONG WOLVES'];
var keywords = [['I walk alone', 'i walk alone', 'I WALK ALONE'], ['Ghosts', 'ghosts'], ['Ghosts', 'ghosts'], ['Resistance', 'resistance']];

var displayed = false;
var inProcess = false;
var welcomeMessagePassed = false;
var progressionInt = 0;
var currentEpisodeInt = 0;
var animTimeFloat = 0.05;
var closePopUpAnimTime = 0.5;
var unlockedOpacity = 1.0;
var clickedOpacity = 0.85;
var messageTransitionDuration = "1s";
var textDelay = 1.5;
var closeVar;
var proceedVar;

window.onclick = function (event) {
    //start: clickAnywhere for welcomeMessage
    if (!welcomeMessagePassed && progressionInt == 0) 
            open_welcomeMessage(document.getElementById('welcomeMessage'));

    //closing popUp when clicking outside of it
    if (displayed && (event.target.classList.contains("map") || event.target.classList.contains("underground_map")) || event.target.classList.contains("background"))
        close_PopUp();
}

function proceed() {
    close_welcomeMessage(document.getElementById('welcomeMessage'));
    progressionInt = 1;
}

function open_welcomeMessage(message) {
    proceedVar = document.getElementById("proceed");
    document.getElementById("map").style.opacity = '0';
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
    document.getElementById("map").style.opacity = '1';
    sleep(messageTransitionDuration * 1000).then(() => {
        message.style.display = "none";
        welcomeMessagePassed = true;
        message.innerHTML = '';

        //unlocking episode 1
        unlock_arrow(1);
    })
}

function highlight_element(element, opacityFloat) {
    element.style.transitionDuration = '1s';
    element.style.opacity = opacityFloat;
}

function open_PopUp(episodeInt) {
    if (episodeInt <= progressionInt && progressionInt != 0) {
        currentEpisodeInt = episodeInt;
        create_episodePopUp(episodeInt);
    }
}

function create_episodePopUp(episodeInt){
    if (!displayed && !inProcess) {
        inProcess = true;

        //Getting references from box / index.html
        var popUp = document.getElementById('popUpBox');
        var popUpHeader = document.getElementById('popUpHeader');
        var popUpBody = document.getElementById('popUpBody');
        var popUpSearchBar = document.getElementById('popUpSearchBar');
        closeVar = document.getElementById('close');

        //Animating Creation of Box via css
        //Empty existing content
        popUpHeader.innerHTML = '';
        empty_innerHTML();

        popUp.style.display = 'block';
        popUp.classList.toggle("openBox", true);

        //filling the box with content (one after one)
        sleep(animTimeFloat * 1000).then(() => {
            closeVar.style.display = 'block';
            popUpHeader.innerHTML = titles[episodeInt - 1];
            popUpHeader.appendChild(closeVar);
            popUpBody.opacity = "0";
            popUpBody.transitionDuration= "0.5s";
            sleep(textDelay * 1000).then(() => {
                load_txtFile(String(episodeInt), popUpBody);
                popUpBody.display = "block";
                popUpBody.opacity = "1";
                popUpSearchBar.style.display = 'block';
                popUpSearchBar.focus();
                displayed = true;
                inProcess = false;
            })
        })
    }
}

function check_Keyword(event) {
    if (event.keyCode == 13) {
        var solution = document.getElementById('popUpSearchBar').value;
        for (var i = 0; i < keywords[currentEpisodeInt-1].length; i++)
            if (keywords[currentEpisodeInt-1][i] == solution) {
                change_map();
                sleep(closePopUpAnimTime * 1000).then(() => {
                    close_PopUp();

                    //case: episode 1 unlocking 2 and 3
                    if (progressionInt == 1 && currentEpisodeInt == 1) {
                        sleep(closePopUpAnimTime * 1000).then(() => {
                            show_stationIcon(progressionInt);
                            sleep(closePopUpAnimTime * 1000).then(() => {
                                progressionInt = progressionInt + 2;
                                unlock_arrow(progressionInt - 1);
                                unlock_arrow(progressionInt);
                            })
                        })
                    }

                    //case: episode 2 or 3 unlocking 4
                    else if (progressionInt == 3 && (currentEpisodeInt == 2 || currentEpisodeInt == 3)) {
                        sleep(closePopUpAnimTime * 1000).then(() => {
                            show_stationIcon(progressionInt - 1);
                            show_stationIcon(progressionInt);

                            sleep(closePopUpAnimTime * 1000).then(() => {
                                progressionInt++;
                                unlock_arrow(progressionInt);
                            })
                        })
                    }

                    //general case: unlocking next station (unlocking next arrow showing last station icon)
                    else if (progressionInt == currentEpisodeInt) {
                        sleep(closePopUpAnimTime * 1000).then(() => {
                            show_stationIcon(progressionInt);
                            sleep(closePopUpAnimTime * 1000).then(() => {
                                progressionInt++;
                                unlock_arrow(progressionInt);
                            })
                        })
                    }
                })
            }
    }
}


function unlock_arrow(arrowInt) {
    highlight_element(document.getElementById("arrow" + String(arrowInt)), unlockedOpacity);
}

function show_stationIcon(stationInt) {
    highlight_element(document.getElementById("box" + String(stationInt)), unlockedOpacity);
    fade_arrow(stationInt);
}

function fade_arrow(arrowInt) {
    highlight_element(document.getElementById("arrow" + String(arrowInt)), clickedOpacity);
}

function change_map() {
    document.getElementById("map").src = "assets/images/map" + String(progressionInt+1)+".png";
}

function close_PopUp() {
    if (displayed) {
        displayed = false;
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
        document.getElementById("welcomeMessage").appendChild(proceedVar);
    }
    txtFile.send(null);
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}