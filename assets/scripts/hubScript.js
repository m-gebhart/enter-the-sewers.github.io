var titles = ['ALL BY MYSELF', 'THE MAN IN THE PAINTING', 'SHEEP AMONG WOLVES'];
var keywords = [['Abandonment', 'abandonment', 'I walk alone', 'i walk alone', 'I WALK ALONE'], ['Ghosts', 'ghosts'], ['Resistance', 'resistance']];

var displayed = false;
var inProcess = false;
var progressionInt = 1;
var currentEpisodeInt = 0;
var animTimeFloat = 0.1;
var highlightOpacity = '0.75';
var clickedOpacity = '0.5';
var popUpBGColor = 'rgba(0, 0, 0, 1)';
var textDelay = 2;
var closeVar;

function open_PopUp(clickbox, episodeInt) {
    if (episodeInt <= progressionInt)
    {
        currentEpisodeInt = episodeInt-1;
        highlight_box(clickbox);
        create_episodePopUp(episodeInt);
        sleep(2000).then(() => {
            clickbox.style.opacity = clickedOpacity;
        })
    }
}

function highlight_box(clickbox) {
    clickbox.style.transitionDuration = '1s';
    clickbox.style.opacity = highlightOpacity;
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

function check_Progression(event) {
    if (event.keyCode == 13) {
        var solution = document.getElementById('popUpSearchBar').value;
        for (var i = 0; i < keywords[currentEpisodeInt].length; i++)
            if (keywords[currentEpisodeInt][i] == solution)
                close_PopUp();
    }
}

function check_Keyword(word) {
    if (word == 'example')
        progressionInt++;
}

window.onclick = function (event) {
    if (event.target.nodeName == "IMG")
        close_PopUp();
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
}