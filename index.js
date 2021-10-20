const searchBtn = document.getElementById("search-btn");
searchBtn.addEventListener("click", () => {
    const userInput = document.getElementById("user-input").value;
    sendRequest(userInput).then(res => {
        const songs = JSON.parse(res);
        const singleSong = songs.data;
        showSongs(singleSong)
    })
    .catch(err => {
        const errorText = document.getElementById("error-text");
        const message = `Something Went Wrong Please Try Again Later! :( ${err}`
        errorText.style.display = "block";
        errorText.innerText = message;
    })
})
const toggleSpinner = () => {
    const spinner =  document.getElementById("loading-spinner");
    spinner.classList.toggle('d-none');
}

const sendRequest = async (song) => {
    toggleSpinner();
    const promise1 = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `https://api.lyrics.ovh/suggest/${song}`);
        xhr.onload = () => {
            const data = xhr.response;
            return resolve(data);
        }
        
        xhr.onerror =() => {
            const message = "Sorry Something went wrong";
            return reject(message);
        }
        xhr.send();
    })
    toggleSpinner();
    return promise1;
}

const showSongs = (data) => {
    const searchResult = document.getElementById("search-result");
    searchResult.innerText = "";
    data.forEach(song => {
        const newSong = document.createElement("div");
        newSong.innerHTML = `
        <div class="single-result row align-items-center my-3 p-3">
        <div class="col-md-9">
            <h3 class="lyrics-name">${song.title}</h3>
            <p class="author lead">Album by <span>${song.artist.name}</span></p>
            <audio controls src="${song.preview}"></audio>
        </div>
        <div class="col-md-3 text-md-right text-center">
            <button onclick="showLyrics('${song.artist.name}','${song.title}')" class="btn btn-success">Get Lyrics</button>
        </div>
    </div>
        `;
    searchResult.appendChild(newSong);
    })
}

document.getElementById("user-input")
.addEventListener("keypress", (event) => {
    // console.log("Working")
    // event.preventDefault();
    // console.log(event.key)
    if(event.key == "Enter"){
        document.getElementById("search-btn").click();
    }
})

const showLyrics = async (artist, title) => {
    const url = `https://api.lyrics.ovh/v1/${artist}/${title}`;
    const res = await fetch(url);
    const data = await res.json();
    try{
        showSingleLyrics(data.lyrics)
    }
    catch(error){
        alert(`Sorry Something Went Wrong ${error}`)
    }
}

const showSingleLyrics = (lyrics) => {
    const showLyric = document.getElementById("show-lyric");
    showLyric.innerText = lyrics;
}


