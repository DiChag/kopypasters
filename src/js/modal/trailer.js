const YOUTUBE_URL = "https://www.youtube.com/embed/";
let trailer;

// References to elements
const refs = {
        openTrailerBtn: document.querySelector(".modal-detail__trailer-btn"),
        backdropTrailer: undefined,
        youtubeIconOnPoster: document.querySelector(".modal-detail__youtube-link"),
        modalDetailElem: document.querySelector(".modal-detail"),
};

// Youtube component
function youtubePlayerComponent(trailer) {
        return `
                <div class="backdrop__trailer">
                        <iframe
                                class="iframe-window"
                                width="560"
                                height="315"
                                title="YouTube video player"
                                style="border: 0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen
                                src="${trailer}"
                        >
                        </iframe>
                </div>
        `;
}

// Init trailer
export function initTrailer(trailersList) {
        // Default buttons is disabled
        refs.openTrailerBtn.setAttribute("disabled", true);
        refs.youtubeIconOnPoster.style.display = "none";

        // Try get the film's trailer
        trailer = parseTrailers(trailersList);

        // Return
        if (!trailer) return;
        
        // Enable buttons if trailer is founded
        refs.openTrailerBtn.removeAttribute("disabled");
        refs.youtubeIconOnPoster.style.display = "block";

        // listener for trailer button
        refs.openTrailerBtn.addEventListener("click", openVideoTrailer);
}

// Check trailer window status
export function checkStatusTrailer() {        
        return refs.backdropTrailer;
}

// Deattach event
export function deattachTrailer() {        
        refs.openTrailerBtn.removeEventListener("click", openVideoTrailer);
}

// Handle to open trailer
export function openVideoTrailer() {
        // Add player components in DOM
        refs.modalDetailElem.insertAdjacentHTML("beforeend", youtubePlayerComponent(trailer));

        // Get ref to player
        refs.backdropTrailer = document.querySelector(".backdrop__trailer");

        // Set href to button on the poster
        trailer && refs.youtubeIconOnPoster.setAttribute("href", trailer);
}

// Close trailer
export function closeTrailerWindow() {
        refs.backdropTrailer.remove();
        refs.backdropTrailer = undefined;
}

// Get trailer video from videosList
function parseTrailers(trailersList) {
        let videoByOfficialTrailer, videoByTrailer, otherVideo;

        if (trailersList.length === 0) {
                return;
        }

        for (const video of trailersList) {
                if (video.name.includes("Official Trailer")) {
                        videoByOfficialTrailer = video.key;
                }

                if (video.name.includes("Trailer")) {
                        videoByTrailer = video.key;
                }
                if (video.name) {
                        otherVideo = video.key;
                }
        }

        if (videoByOfficialTrailer || videoByTrailer || otherVideo) {
                return `${YOUTUBE_URL}${videoByOfficialTrailer || videoByTrailer || otherVideo}`;
        }
}
