var titles = ['Case A-02342', 'Case B-03945', 'Case C-03120'];
var encrypts = [['iu^hfZdfdZiuZcg#jHGg!'], ['hdpj]ihcc[^gghdpj]ihcc[^gg'], ['rdqfoo[g[\\f\o#hcgjZGf']];

var displayed = false;
var inProcess = false;
var welcomeMessagePassed = false;
var progressionInt = 0;
var currentEpisodeInt = 0;
var animTimeFloat = 0.05;
var closePopUpAnimTime = 0.5;
var unlockedOpacity = 1.0;
var clickedOpacity = 0.7;
var messageTransitionDuration = "1s";
var textDelay = 1.5;
var closeVar;
var proceedVar;
var popUpOpacity = 1;

window.onclick = function (event) {
    //start: clickAnywhere for welcomeMessage
    if (!welcomeMessagePassed && progressionInt == 0) 
            open_welcomeMessage(document.getElementById('welcomeMessage'));

    //closing popUp when clicking outside of it
    if (displayed && (event.target.classList.contains("map")
        || event.target.classList.contains("underground_map")
        || event.target.classList.contains("background")))
        close_PopUp();
}

//open welcomeMessage after clicking anywhere
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

function proceed() {
    close_welcomeMessage(document.getElementById('welcomeMessage'));
    progressionInt = 1;
}

window.onkeypress = function(event) {
    if (event.keyCode == 13 && progressionInt == 0)
        proceed();
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

        //Checking, whether case is already solved
        if (progressionInt > episodeInt) {
            popUpOpacity = 0.4;
            popUpSearchBar.style.pointerEvents = "none";
            popUpBody.style.pointerEvents = "none";
            var stamp = document.getElementById("stamp");
            stamp.style.zIndex = '3';
            sleep((textDelay + animTimeFloat) * 1500).then(() => {
                stamp.style.opacity = '1';
            })
        }
      else {	
      	    popUpOpacity = 1;
      	    popUpSearchBar.style.pointerEvents = "unset";
            popUpBody.style.pointerEvents = "unset";
    	}

        //filling the box with content (one after one)
        sleep(animTimeFloat * 1000).then(() => {
            closeVar.style.display = 'block';
            popUpBody.display = "block";
            popUpSearchBar.style.display = 'block';
            popUpHeader.innerHTML = titles[episodeInt - 1];
            popUpHeader.appendChild(closeVar);
            sleep(textDelay * 1000).then(() => {
                load_txtFile(String(episodeInt), popUpBody);
                popUpHeader.style.opacity = String(popUpOpacity);
                popUpBody.style.opacity = String(popUpOpacity);
                popUpSearchBar.style.opacity = String(popUpOpacity);
                if (progressionInt <= episodeInt)
                    put_inFocus(popUpSearchBar);
                displayed = true;
                inProcess = false;
            })
        })
    }
}


function put_inFocus(element) {
    element.focus();
    element.classList.toggle("textFieldInFocus", true);
}

//checking whether input from popUp's textfield is a valid keyword
function check_Keyword(event) {
    if (event.keyCode == 13) {
        var input = document.getElementById('popUpSearchBar').value.toLowerCase();
        for (var i = 0; i < encrypts[currentEpisodeInt - 1].length; i++)
            if (input == decrypt_fromKey(encrypts[currentEpisodeInt - 1][i], parseInt(String(new Date().getFullYear()).charAt(0)))) {
                change_map();
                fade_arrow(currentEpisodeInt);
                sleep(closePopUpAnimTime * 1000).then(() => {
                    close_PopUp();
                    //unlocking next station (unlocking next arrow showing last station icon)
                    if (progressionInt == currentEpisodeInt) {
                        sleep(closePopUpAnimTime * 1000).then(() => {
                            show_stationIcon(progressionInt);
                            sleep(closePopUpAnimTime * 1000).then(() => {
                                 unlock_nextEpisode();
                            })
                        })
                    }
                })
            }
    }
}
      
function unlock_nextEpisode() {
      progressionInt++;
      unlock_arrow(progressionInt);
}

//displaying arrow pointing at station on map
function unlock_arrow(arrowInt) {
    highlight_element(document.getElementById("arrow" + String(arrowInt)), unlockedOpacity);
}

//displaying station icon as solved episode on map
function show_stationIcon(stationInt) {
    highlight_element(document.getElementById("box" + String(stationInt)), unlockedOpacity);
}

//lowering opacity of arrow after solved episode
function fade_arrow(arrowInt) {
    highlight_element(document.getElementById("arrow" + String(arrowInt)), clickedOpacity);
}

//map decays after each solved episode
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
    var searchBar = document.getElementById('popUpSearchBar');
    searchBar.style.display = 'none';
    searchBar.value = '';
    searchBar.style.opacity = '0';

    var popUpBody = document.getElementById('popUpBody');
    popUpBody.display = 'none';
    popUpBody.innerHTML = '';
    popUpBody.style.opacity = '0';

    document.getElementById('popUpHeader').style.opacity = '0';
    document.getElementById("stamp").style.opacity = '0';
}

//loading txtFile for popUp-Content
function load_txtFile(episodeStr, target) {
    var txtFile = new XMLHttpRequest();
    txtFile.open("GET", "assets/txt/episode" + episodeStr + ".txt", true);
    txtFile.onreadystatechange = function () {
        if (txtFile.readyState === 4 && txtFile.status == 200)
            content = txtFile.responseText;
        target.innerHTML = content;
    }
    txtFile.send(null);
}

//loading welcome Message after clicking anywhere
function load_welcomeTxtFile() {
    var txtFile = new XMLHttpRequest();
    txtFile.open("GET", "assets/txt/welcomeMessage.txt", true);
    txtFile.onreadystatechange = function () {
        if (txtFile.readyState === 4 && txtFile.status == 200)
            content = txtFile.responseText;
        document.getElementById("welcomeMessage").innerHTML = content;
        document.getElementById("welcomeMessage").appendChild(proceedVar);
    }
    txtFile.send(null);
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

//decryption to make keywords less visible by Web Inspector, encrypt()-function on Spaces
function decrypt_fromKey(encrypt, key) {
    var decryption = '';
    for (var i = 0; i < encrypt.length / key; i++) {
        decryption += String.fromCharCode(encrypt.charCodeAt(i) + i);
    }
    return decryption;
}