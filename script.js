let current = new Audio;
let h4Elements = [];
let play = document.getElementById("play")
let prev = document.getElementById("previous")
let next = document.getElementById("next")
let circle = document.querySelector(".circle")
let seekbar = document.querySelector(".seekbar")
let fillbar = document.querySelector(".fillbar")
let hamburger = document.getElementById("hamburger")
let volume_buttons = document.querySelectorAll(".volbutton")
const volumeControl = document.getElementsByClassName('volrange');
let currfolder;

let playlistsboxes = document.querySelector(".playlistsboxes")
// Array.from(playboxes).forEach(async(item) => {
//     item.addEventListener("click", async () => {
//         currfolder = await item.dataset.folder;
//     })
// })


async function getsongs(foldername) {
    currfolder = foldername;
    let song;
    let a = await fetch(`/songs/${foldername}/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {

            song = (element.href)
            songs.push(song)
        }

    }

    return songs
}
function playMusic(track, currfolder) {
    current.src = `/songs/${currfolder}/` + track
    

    current.play()
    play.src = "svgs/pause.svg"
    document.querySelector(".attributes1").getElementsByTagName("h4")[0].innerText = track;
    document.getElementsByClassName("attributes1")[0].getElementsByTagName("p")[0].innerHTML = "";

}


function pauseMusic(track) {
    current.src = `/songs/${currfolder}/` + track
    current.pause()
}
function formatTime(time) {
    // Convert the time string to seconds
    const totalSeconds = parseInt(time);

    // Calculate minutes and seconds
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Pad single-digit seconds with leading zero
    const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

    // Return the formatted time string
    return `${minutes}:${formattedSeconds}`;
}
function convertTimeFormat(timeString) {
    // Split the time string into current time and duration
    const [currentTime, duration] = timeString.split(" / ");

    // Convert current time and duration to proper format
    const formattedCurrentTime = formatTime(currentTime);
    const formattedDuration = formatTime(duration);

    // Return the formatted time string
    return `${formattedCurrentTime} / ${formattedDuration}`;
}
async function displayboxes(){
    let box = await fetch(`/songs`)
    let response = await box.text()
    
    let div = document.createElement("div")
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a")
    let folders = []
    for (let index = 0; index < anchors.length; index++) {
        const element = anchors[index];
        if (element.href.includes("songs")) {

            let folder = (element.href)
            folders.push(folder)
        }
}
for (let index = 0; index < folders.length; index++) {
    const element = folders[index];
    element_updated = element.split("/songs/")[1].slice(0, -1)
    
    let new_box = document.createElement("div")
    new_box.classList.add("box");
    new_box.dataset.folder = element_updated
    new_box.innerHTML = `<img class="play" src="svgs/play.svg" alt="">
    <div class="img"><img src="songs/${element_updated}/1.jpg" alt=""></div>
    <h3>${element_updated}</h3>
    <p>Lorem ipsum dolor sit amet consectetur jnadebcbie jncdbvujbeoibdujvjdn !</p>`
    playlistsboxes.appendChild(new_box)
}
}
async function main() {
    await displayboxes()
    let playboxes = document.querySelectorAll(".box");
    Array.from(playboxes).forEach((item) => {
        item.addEventListener("click", async () => {
            currfolder = await item.dataset.folder;
           
            let songs = await getsongs(currfolder)
            let ul = document.querySelector(".songnames")
            while (ul.firstChild) {
                ul.removeChild(ul.firstChild);
            }
            for (let index = 0; index < songs.length; index++) {
                let li = document.createElement("li")
                const element = songs[index];
                li.innerHTML = `<img class="invert" src="svgs/music.svg" alt="">
        <div class="attributes">
            <h4 class="ellipses">${element.split(`/${currfolder}/`)[1].replaceAll("%20", " ")}</h4>
            <p>Artist</p>
        </div>
        <div>
            <img class="play" src="svgs/play2.svg" alt="">
        </div>`


                ul.appendChild(li);
            }
            let liElements = document.querySelectorAll(".songnames li");

            // Create an empty array to store <h4> elements

            h4Elements = []

            // Loop through each <li> element
            liElements.forEach(li => {
                // Find the <h4> element within the current <li> element
                let h4 = li.querySelector("h4");
                // If <h4> element is found, push it to the array
                if (h4) {
                    h4Elements.push(h4);
                }

            });
            h4Elements.forEach(e => {
                e.addEventListener("click", () => {
                    playMusic(e.innerHTML, currfolder)
                  
                })
            })
            
           playMusic(h4Elements[0].innerHTML ,currfolder)
        })


    })

     //default music on reload
            
    //  current.src = `/songs/music1/` + "Hussain baant rahe hain nijat le jao..mp3"
    //  document.querySelector(".attributes1").getElementsByTagName("h4")[0].innerText = "Hussain baant rahe hain nijat le jao..mp3"
    //  document.getElementsByClassName("attributes1")[0].getElementsByTagName("p")[0].innerHTML = "00:00 / 00:00";


    // current.pause();
    // play.src = "svgs/play2.svg"
    Array.from(volumeControl).forEach(e=>{

        e.addEventListener('input', function () {
            // Convert the range value to a float between 0 and 1
            const volumeValue = parseFloat(this.value);
            // Set the volume of the audio element
            current.volume = volumeValue;
        });
    })

    //setting the play button
    play.addEventListener("click", () => {
        if (current.paused) {
            current.play()
            play.src = "svgs/pause.svg"
        }
        else {
            current.pause()
            play.src = "svgs/play2.svg"
        }

    })
    prev.addEventListener("click", () => {
        let currentIndex = -1;
        for (let index = 0; index < h4Elements.length; index++) {
            const element = h4Elements[index];
            if (current.src.split(`/${currfolder}/`)[1].replaceAll("%20", " ") == element.innerHTML) {
               
                currentIndex = index
                break;
                // playMusic(h4Elements[index-1].innerHTML)
            }

        }
        if (currentIndex !== -1 && currentIndex > 0) {
            playMusic(h4Elements[currentIndex - 1].innerHTML, currfolder);
        }
    })
    next.addEventListener("click", () => {
        currentIndex = h4Elements.length;
        for (let index = 0; index < h4Elements.length; index++) {
            const element = h4Elements[index];
            if (current.src.split(`/${currfolder}/`)[1].replaceAll("%20", " ") == element.innerHTML) {
                
                currentIndex = index
                break;
                // playMusic(h4Elements[index-1].innerHTML)
            }

        }
        if (currentIndex !== -1 && currentIndex < h4Elements.length) {
            playMusic(h4Elements[currentIndex + 1].innerHTML, currfolder);
        }

    })

    seekbar.addEventListener("click", (e) => {
        
        let newposition = e.offsetX
        let percent = (newposition / 350) * 100
        circle.style.left = percent + "%"
        fillbar.style.width = percent = "%"
        current.currentTime = (percent * current.duration) / 100
        // circle.style.left = (current.currentTime/current.duration)*100 + "%"

    })
    //getting the time and duration
    current.addEventListener("timeupdate", () => {
        document.getElementsByClassName("attributes1")[0].getElementsByTagName("p")[0].innerHTML = convertTimeFormat(`${current.currentTime} / ${current.duration}`)
        circle.style.left = (current.currentTime / current.duration) * 100 + "%"
        fillbar.style.width = (current.currentTime / current.duration) * 100 + "%"


    })
    seekbar.addEventListener("click", (e) => {
        
        let newposition = e.offsetX
        let percent = (newposition / 350) * 100
        circle.style.left = percent + "%"
        fillbar.style.width = percent + "%"
        if (!isNaN(current.duration) && current.duration !== 0) {
            current.currentTime = (percent / 100) * current.duration;
        }
        

    })
    let sideblockOpen = false; // Initialize a variable to track the state of the sideblock

    hamburger.addEventListener("click", () => {
        let sideblock = document.querySelector(".sideblock");

        // Toggle the sideblock's state
        if (!sideblockOpen) {
            // If sideblock is closed, open it
            sideblock.style.position = "fixed";
            sideblock.style.left = "0";
            sideblock.style.width = "60vw";

            sideblock.style.zIndex = "1";
            hamburger.src = "svgs/close.svg"
        } else {
            // If sideblock is open, close it
            hamburger.src = "svgs/hamburger.svg"
            sideblock.style.position = "";
            sideblock.style.left = "";
            sideblock.style.width = "";
            sideblock.style.zIndex = "";
        }

        // Update the sideblock's state
        sideblockOpen = !sideblockOpen;
    });
    let ismute = false
Array.from(volume_buttons).forEach(e=>{
    e.addEventListener("click", ()=>{
        if(!ismute){

            e.src = "svgs/volume.svg"
            current.volume = 1
            Array.from(volumeControl).forEach(e=>{
                e.value = 1
        })
    }
        else{
            e.src = "svgs/mute.svg"
            current.volume = 0
            Array.from(volumeControl).forEach(e=>{
                e.value = 0
        })

        }
        ismute = !ismute
    })
})

}
main()