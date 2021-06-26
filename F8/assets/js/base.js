let wrapper = document.querySelector(".wrapper");
let musicImg = document.querySelector(".img-music");
let musicName = document.querySelector(".song-details .name");
let musicArtist = document.querySelector(".song-details .artist");
let mainAudio = document.querySelector(".main-audio");
let playPauseBtn = document.querySelector(".play-pause");
let playBtn = document.querySelector(".fa-play");

let prevBtn = document.querySelector(".fa-step-backward");
let nextBtn = document.querySelector(".fa-step-forward");

let progressBar = document.querySelector(".progress-bar");
let progressArea = document.querySelector(".progress-area");

let currentTimeSong = document.querySelector(".current-time");
let durationTimeSong = document.querySelector(".duration-time");

let repeatBtn = document.querySelector(".fas.fa-redo-alt");

let listMusic = document.querySelector('.music-list');
let showMoreBtn = document.querySelector(".fa-list");
let hideMoreBtn = document.querySelector("#close");

let cd = document.querySelector('.img-area');
let cdThumb = document.querySelector('.img-music');

let cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
    duration: 10000, // 10 seconds
    iterations: Infinity
});

let indexMusic = 4;

window.addEventListener("load", function() {
    loadMusic(indexMusic);
    handleEvents();
    playingNow();
})

// load music (show UI music app)
function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `./F8/assets/images/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `./F8/assets/audio/${allMusic[indexNumb - 1].src}.mp3`;
}

// check play, pause music when click button
playPauseBtn.addEventListener('click', () => {
    const isMusicPlay = playBtn.getAttribute('class');
    console.log('CHECK DIEU KIEN', isMusicPlay);
    if (isMusicPlay === 'fas fa-play material-icons') {
        playMusic();
    } else {
        pauseMusic();
    }
    playingNow();
})

// animate play song...
function handleEvents() {
    cdThumbAnimate.pause();
}

// play music when click button 'play'
function playMusic() {
    playBtn.setAttribute('class', 'fas fa-pause material-icons');
    cdThumbAnimate.play();
    mainAudio.play();
}

// pause music when click button 'pause'
function pauseMusic() {
    playBtn.setAttribute('class', 'fas fa-play material-icons');
    cdThumbAnimate.pause();
    mainAudio.pause();
}

// next music when click button 'next'
function nextMusic() {
    indexMusic++;
    indexMusic > allMusic.length ? indexMusic = 1 : indexMusic;
    loadMusic(indexMusic);
    playMusic();
    playingNow();
}

// prev music when click button 'prev'
function prevMusic() {
    indexMusic--;
    indexMusic < 1 ? indexMusic = allMusic.length : indexMusic;
    loadMusic(indexMusic);
    playMusic();
    playingNow();
}

nextBtn.addEventListener('click', () => {
    nextMusic();
})

prevBtn.addEventListener('click', () => {
    prevMusic();
})

// update progress bar (`curent time`)
mainAudio.addEventListener("timeupdate", (e) => {
    let currentTime = e.target.currentTime;
    let duration = e.target.duration;

    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    mainAudio.addEventListener("loadeddata", () => {
        // update current time & duration time when song runing
        // update duration time:
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);

        totalSec < 10 ? totalSec = `0${totalSec}` : totalSec;
        durationTimeSong.innerHTML = `${totalMin}:${totalSec}`;
    })

    // update current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    currentSec < 10 ? currentSec = `0${currentSec}` : currentSec;
    currentTimeSong.innerHTML = `${currentMin}:${currentSec}`;;
})

// update playing song current time according to the progress bar when `click`
progressArea.addEventListener('click', (e) => {
    let progressWidthValue = progressArea.clientWidth; // 280
    let clickedOffSetX = e.offsetX; // 0 - 280
    let songDuration = mainAudio.duration; // thời lượng của 1 bài

    mainAudio.currentTime = (clickedOffSetX / progressWidthValue) * songDuration;
    playMusic();
})

// repeat, shuffle song according to the icon
repeatBtn.addEventListener("click", () => {
    let iconRepeat = repeatBtn.getAttribute('class');

    switch (iconRepeat) {
        case "fas fa-redo-alt":
            repeatBtn.setAttribute('class', 'fas fa-asterisk');
            repeatBtn.setAttribute('title', 'song looped...');
            break;

        case "fas fa-asterisk":
            repeatBtn.setAttribute('class', 'fas fa-random');
            repeatBtn.setAttribute('title', 'playback shuffle...');
            break;

        case "fas fa-random":
            repeatBtn.setAttribute('class', 'fas fa-redo-alt');
            repeatBtn.setAttribute('title', 'playlist looped...');
            break;
    }
})

mainAudio.addEventListener('ended', () => {
    console.log(Math.random());
    let iconRepeat = repeatBtn.getAttribute('class');

    switch (iconRepeat) {
        case "fas fa-redo-alt":
            nextMusic();
            break;

        case "fas fa-asterisk":
            mainAudio.currentTime = 0;
            loadMusic(indexMusic);
            playMusic();
            break;

        case "fas fa-random":
            let randomIndex = Math.floor((Math.random() * allMusic.length) + 1);

            do {
                randomIndex = Math.floor((Math.random() * allMusic.length) + 1)
            } while (indexMusic == randomIndex)

            indexMusic = randomIndex;
            loadMusic(indexMusic);
            playMusic();
            playingNow();
            break;
    }
})

// show more music
showMoreBtn.addEventListener("click", () => {
    listMusic.setAttribute('class', 'music-list show')
})

// hide more music
// show more music
hideMoreBtn.addEventListener("click", () => {
    listMusic.setAttribute('class', 'music-list')
})

const ulList = document.querySelector('.ul-list');
const liItem = document.querySelector('.li-item');

for (let i = 0; i < allMusic.length; i++) {
    let music = allMusic[i];
    let html = `
    <li class="li-item" li-index="${i+1}">
        <div class="row">
            <span>${music.name}</span>
            <p>${music.artist}</p>
        </div>
        <audio id="${music.src}" src="./F8/assets/audio/${music.src}.mp3"></audio>
        <span class="audio-durition ${music.src}">3:40</span>
    </li>
    `;
    ulList.insertAdjacentHTML("beforeend", html);

    // update time child music
    let liAudioDuration = document.querySelector(`.${music.src}`);
    let liAudioTag = document.querySelector(`#${music.src}`);

    liAudioTag.addEventListener("loadeddata", () => {
        // update current time & duration time when song runing (p2)
        // update duration time:
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);

        totalSec < 10 ? totalSec = `0${totalSec}` : totalSec;
        liAudioDuration.innerHTML = `${totalMin}:${totalSec}`;

        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    })
}

// play musics detail
const allLiTags = document.querySelectorAll("li.li-item");

function playingNow() {
    for (let j = 0; j < allLiTags.length; j++) {
        let itemLiTag = allLiTags[j];
        let audioTag = itemLiTag.querySelector('.audio-durition');

        if (itemLiTag.getAttribute("class") === "li-item playing") {
            itemLiTag.setAttribute("class", "li-item");

            let addDuration = audioTag.getAttribute("t-duration");
            audioTag.innerHTML = addDuration;
        }

        if (itemLiTag.getAttribute("li-index") == indexMusic) {
            itemLiTag.setAttribute("class", "li-item playing");
            audioTag.innerText = "Playing"
        }

        itemLiTag.setAttribute("onclick", "clickedChildMusic(this)");
        console.log(itemLiTag)
    }
}

// play song when click detail
function clickedChildMusic(element) {
    let getLiIndex = element.getAttribute("li-index");
    indexMusic = getLiIndex;
    loadMusic(indexMusic);
    playMusic();
    playingNow();
}