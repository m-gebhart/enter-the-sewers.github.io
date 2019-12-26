var titles = ['ABANDONMENT', 'GHOSTS', 'RESISTANCE'];
var displayed = false;
var progression = 1;
var highlightOpacity = '0.75';
var clickedOpacity = '0.5';
var popUpBGColor = 'rgba(0, 0, 0, 1)';
var textDelay = 2;
var closeVar;

function open_PopUp(clickbox, episodeInt) {
    if (episodeInt <= progression)
    {
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
    if (!displayed) {
        //Getting references from box / index.html
        var popUp = document.getElementById('popUpBox');
        var popUpBG = document.getElementById('popUpBackground');
        var popUpHeader = document.getElementById('popUpHeader');
        var popUpBody = document.getElementById('popUpBody');
        var popUpSearchBar = document.getElementById('popUpSearchBar');
        closeVar = document.getElementById('close');

        //Animating Creation of Box via css
        popUpHeader.innerHTML = '';
        popUp.style.display = 'block';
        popUpBG.style.backgroundColor = popUpBGColor;
        popUp.classList.toggle("openBox", true);
        displayed = true;

        sleep(textDelay * 1000).then(() => {
            //filling the box with content
            closeVar.style.display = 'block';
            popUpSearchBar.style.display = 'block';
            load_txtFile(String(episodeInt), popUpBody);
            popUpHeader.innerHTML = titles[episodeInt - 1];
            popUpHeader.appendChild(closeVar);
        })
    }
}

function check_Keyword(word) {
    if (word == 'example')
        progression++;
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

function check_searchBar() {
    progression++;
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
    document.getElementById('popUpBody').innerHTML = '';
}