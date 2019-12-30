var titles = ['ALL BY MYSELF', 'THE MAN IN THE PAINTING', 'SHEEP AMONG WOLVES'];
var keywords = [['I walk alone', 'i walk alone', 'I WALK ALONE'], ['Ghosts', 'ghosts'], ['Resistance', 'resistance']];

var displayed = false;
var inProcess = false;
var welcomeMessagePassed = false;
var progressionInt = -2;
var currentEpisodeInt = 0;
var animTimeFloat = 0.1;
var unlockedOpacity = 0.5;
var passedOpacity = 0.3;
var clickedOpacity = 0.9;
var popUpBGColor = 'rgba(0, 0, 0, 1)';
var messageTransitionDuration = "0.5s";
var textDelay = 2;
var closeVar;

function open_PopUp(episodeInt) {
    if (episodeInt <= progressionInt && progressionInt != 0)
    {
        currentEpisodeInt = episodeInt;
        highlight_box(document.getElementById('box' + String(episodeInt)), clickedOpacity);
        create_episodePopUp(episodeInt);
    }
}

function highlight_box(clickbox, opacityFloat) {
    clickbox.style.transitionDuration = '1s';
    clickbox.style.opacity = opacityFloat;
}

function create_episodePopUp(episodeInt)
{
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

        sleep(textDelay * 1000).then(() => {
            //filling the box with content (to-do, one after one anims)
            closeVar.style.display = 'block';
            popUpHeader.innerHTML = titles[episodeInt - 1];
            popUpHeader.appendChild(closeVar);
            load_txtFile(String(episodeInt), popUpBody);
            sleep(animTimeFloat*1000).then(() => {
                popUpSearchBar.style.display = 'block';
                popUpSearchBar.focus();
                displayed = true;
                inProcess = false;
            })
        })
    }
}

function load_txtFile(episodeStr, target) {
    var txtFile = new XMLHttpRequest();
    txtFile.open("GET", "assets/txt/episode"+episodeStr+".txt", true);
    txtFile.onreadystatechange = function () {
        if (txtFile.readyState === 4 && txtFile.status == 200) {
            content = txtFile.responseText;
        }
        target.innerHTML = content;
    }
    txtFile.send(null);
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function check_Keyword(event) {
    if (event.keyCode == 13) {
        var solution = document.getElementById('popUpSearchBar').value;
        for (var i = 0; i < keywords[currentEpisodeInt-1].length; i++)
            if (keywords[currentEpisodeInt-1][i] == solution) {
                close_PopUp();
                if (progressionInt == currentEpisodeInt) {
                    progressionInt++;
                    highlight_box(document.getElementById("box" + String(progressionInt)), unlockedOpacity);
                }
            }
    }
}

function open_welcomeMessage(message) {
    message.style.display = "block";
    sleep(messageTransitionDuration / 2 * 1000).then(() => {
        message.style.transitionDuration = '0.5s';
        message.style.backgroundColor = "rgba(0, 0, 0, 1.0)";
        message.style.color = "rgba(255, 255, 0, 1.0)";
    })
}

function close_welcomeMessage(message) {
    message.style.transitionDuration = '0.5s';
    message.style.backgroundColor = "rgba(0, 0, 0, 0.0)";
    message.style.color = "rgba(255, 255, 0, 0.0)";
    sleep(messageTransitionDuration / 2 * 1000).then(() => {
        message.style.display = "none";
        welcomeMessagePassed = true;
    })
}

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

    //display first box
    if (progressionInt == 0 && welcomeMessagePassed) {
        progressionInt++; //to 1 for box1
        highlight_box(document.getElementById("box1"), unlockedOpacity);
    }

    //closing popUp when clicking outside of it
    if (displayed && (event.target.classList.contains("map")
        || event.target.classList.contains("underground_map")
        || event.target.classList.contains("popUpBackground")))
            close_PopUp();
}

function close_PopUp() {
    if (displayed) {
        displayed = false;

        highlight_box(document.getElementById('box' + String(currentEpisodeInt)), unlockedOpacity);

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
}