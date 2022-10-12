const YOUTUBE_URL = "https://www.youtube.com/embed/";
let trailer;

// References to elements
const refs = {
        openTrailerBtn: document.querySelector(".modal-detail__trailer-btn"),
        backdropTrailer: document.querySelector(".backdrop_trailer"),
        youtubeLink: document.querySelector(".modal-detail__youtube-link"),
        youtubeIconOnPosetr: document.querySelector(".modal-detail__youtube-link"),
};

export function initTrailer(trailersList) {
        // Film trailer
        trailer = parseTrailers(trailersList);
        trailer && refs.youtubeLink.setAttribute("href", trailer);

        // YouTube link for video trailer
        refs.backdropTrailer.firstElementChild.src = trailer;

        // listeners for openTrailerBtn and backdrop
        refs.openTrailerBtn.addEventListener("click", openVideoTrailer);
        refs.backdropTrailer.addEventListener("click", closeTrailerWindow);
}

export function deattachTrailer() {
        // Deattach events        
        refs.openTrailerBtn.removeEventListener("click", openVideoTrailer);
        refs.backdropTrailer.removeEventListener("click", closeTrailerWindow);
}

// function that opens videoTrailer
function openVideoTrailer() {        
        refs.backdropTrailer.classList.remove("unshown");
        refs.backdropTrailer.firstElementChild.src = trailer;
}

// function that closes videoTrailer
function closeTrailerWindow() {        
        refs.backdropTrailer.classList.add("unshown");
        refs.backdropTrailer.firstElementChild.src = "";
}



// Get trailer video from videosList
function parseTrailers(trailersList) {
        let videoByOfficialTrailer, videoByTrailer, otherVideo;
        // Default button is disabled
        refs.openTrailerBtn.setAttribute("disabled", true);
        refs.youtubeIconOnPosetr.style.display = "none";

        if (trailersList.length === 0) {
                return;
        }

        for (const video of trailersList) {
                if (video.name.includes("Official Trailer")) {
                        videoByOfficialTrailer = video.key }

                 if (video.name.includes("Trailer")) {
                        videoByTrailer = video.key;
                 }
                 if (video.name) {
                        otherVideo = video.key;
                }      
        }

            if (videoByOfficialTrailer || videoByTrailer || otherVideo) {
        refs.openTrailerBtn.removeAttribute("disabled");
        refs.youtubeIconOnPosetr.style.display = "block";
            return  `${YOUTUBE_URL}${videoByOfficialTrailer || videoByTrailer || otherVideo}`
        }          
}
