import { scrollableBody } from "../helpers";
import { appendToStorage, removeKeyFromStorage, saveToStorage } from "../services/storage";
import {
        getQueuedFromLocalStorage,
        getWatchedFromLocalStorage,
        showQueuedFilms,
        showWatchedFilms,
} from "../library/library";
import { deattachTrailer, initTrailer } from "./trailer";

// Blank image
import blankImage from "../../images/no-image.svg";
import { isHome } from "../init";
import { getMovieById } from "../movies/movies";
import { parseGenres } from "../movies/genres";

// Items in local storage
const WATCHED_STORE = "watchedFilms";
const QUEUED_STORE = "queuedFilms";

// Film id
let id;

// Obj for save to store
let filmInfoParsed;

// References to elements
const refs = {
        grid: document.querySelector(".movies-section__grid"),
        modalDetailOverlay: document.querySelector(".backdrop"),
        closeBtn: document.querySelector(".modal-detail__close-button"),
        posterImage: document.querySelector(".modal-detail__image"),
        title: document.querySelector(".modal-detail__title"),
        votesAVG: document.querySelector(".modal-detail__vote-avg"),
        votesCount: document.querySelector(".modal-detail__vote-count"),
        popularity: document.querySelector(".modal-detail__popularity"),
        orgTitle: document.querySelector(".modal-detail__org-title"),
        genres: document.querySelector(".modal-detail__genres"),
        article: document.querySelector(".modal-detail__article"),

        watchBtn: document.getElementById("watch-btn"),
        queueBtn: document.getElementById("queue-btn"),
};

// Init attaching
export default function initModalFilmDetails() {
        refs.grid.addEventListener("click", openMovieDetailModal);
}

async function openMovieDetailModal(e) {
        const filmCard = e.target;

        // Get video ID from data card
        id = filmCard.closest("div").getAttribute("data-id");

        // Return if no id
        if (!id) {
                return;
        }

        // Clear image for first
        refs.posterImage.setAttribute("src", blankImage);

        // Post req by id
        const filmInfo = await getMovieById(id);
        if (filmInfo === undefined || filmInfo === null) return;

        // Show modal
        refs.modalDetailOverlay.classList.toggle("is-hidden");

        // Attach clicks event on Modal (for close window)
        refs.modalDetailOverlay.addEventListener("click", closeModal);
        document.addEventListener("keydown", closeModal);

        // Hide scroll on body
        scrollableBody(false);

        // Render film info in modal
        renderMovieDetails(filmInfo);

        // Init trailer of film
        const {
                videos: { results: trailersList },
        } = filmInfo;
        initTrailer(trailersList);

        // Check statuses
        setButtonStatus("all", checkLibrary(id));

        // Attach click events on buttons
        refs.watchBtn.addEventListener("click", handleChangeStatus);
        refs.queueBtn.addEventListener("click", handleChangeStatus);
}

function renderMovieDetails(filmInfo) {
        // Export data
        const {
                title = "NO TITLE",
                original_title = "No original title",
                overview = "No overview...",
                popularity,
                release_date,
                vote_average,
                vote_count,
                poster_path,
                genres,
        } = filmInfo;

        // Save temp object
        filmInfoParsed = {
                id,
                title,
                original_title,
                overview,
                popularity,
                release_date,
                genres,
                vote_average,
                vote_count,
                poster_path,
        };

        // Parse names of genres
        const genresStr = genres && genres.length > 0 ? parseGenres(genres) : "No genres";

        // Title
        refs.title.innerText = title || "No title";

        // Poster image
        poster_path
                ? refs.posterImage.setAttribute(
                          "src",
                          `https://image.tmdb.org/t/p/w500${poster_path}`,
                  )
                : refs.posterImage.setAttribute("src", blankImage);

        // Original title
        refs.orgTitle.innerText = original_title || "No title";

        // Popularity
        refs.popularity.innerText = popularity ? popularity.toFixed(2) : "No info";

        // Genres
        refs.genres.innerText = genresStr || "No info";

        // Overview
        refs.article.innerText = overview || "No info";

        // Votes
        refs.votesCount.innerText = vote_count || "0";

        // Avg votes
        refs.votesAVG.innerText = vote_average ? vote_average.toFixed(1) : "0";
}

// On click buttons events
const handleChangeStatus = (e) => {
        const { watched, queued } = checkLibrary(id);

        // Watched button
        if (e.target.id == "watch-btn") {
                if (watched.bool) {
                        removeKeyFromStorage(WATCHED_STORE, watched.index);
                } else {
                        appendToStorage(WATCHED_STORE, filmInfoParsed);
                }
                setButtonStatus("watch-btn", { watched, queued });
        }

        // Queued button
        if (e.target.id == "queue-btn") {
                if (queued.bool) {
                        removeKeyFromStorage(QUEUED_STORE, queued.index);
                } else {
                        appendToStorage(QUEUED_STORE, filmInfoParsed);
                }
                setButtonStatus("queue-btn", { watched, queued });
        }
};

// Change style of buttons
function setButtonStatus(btn, { watched, queued }) {
        // Labels
        const labelAddToWatched = "Add to Watched";
        const labelRemoveWatched = "Remove watched";
        const labelAddToQueued = "Add to Queue";
        const labelRemoveQueued = "Remove queued";
        const activeClass = "modal-detail__btn--active";

        // Select button from argument
        switch (btn) {
                // Watch button
                case "watch-btn":
                        !watched.bool
                                ? refs.watchBtn.classList.add(activeClass)
                                : refs.watchBtn.classList.remove(activeClass);
                        refs.watchBtn.innerText = watched.bool
                                ? labelAddToWatched
                                : labelRemoveWatched;
                        break;

                // Queue button
                case "queue-btn":
                        !queued.bool
                                ? refs.queueBtn.classList.add(activeClass)
                                : refs.queueBtn.classList.remove(activeClass);
                        refs.queueBtn.innerText = queued.bool
                                ? labelAddToQueued
                                : labelRemoveQueued;
                        break;

                // All buttons
                default:
                        watched.bool
                                ? refs.watchBtn.classList.add(activeClass)
                                : refs.watchBtn.classList.remove(activeClass);
                        queued.bool
                                ? refs.queueBtn.classList.add(activeClass)
                                : refs.queueBtn.classList.remove(activeClass);
                        refs.watchBtn.innerText = !watched.bool
                                ? labelAddToWatched
                                : labelRemoveWatched;
                        refs.queueBtn.innerText = !queued.bool
                                ? labelAddToQueued
                                : labelRemoveQueued;
                        break;
        }
}

// Look for movies in localstorage and return index and bool
function checkLibrary(id) {
        // Getting data from localstore
        let watchedFilms = getWatchedFromLocalStorage(WATCHED_STORE);
        let queuedFilms = getQueuedFromLocalStorage(QUEUED_STORE);

        // If null - create empty array
        if (watchedFilms === null || watchedFilms === undefined) {
                saveToStorage(WATCHED_STORE, []);
                watchedFilms = [];
        }
        // If null - create empty array
        if (queuedFilms === null || queuedFilms === undefined) {
                saveToStorage(QUEUED_STORE, []);
                queuedFilms = [];
        }

        // Looking for id in the store
        let indexWatched = watchedFilms.findIndex((film) => film.id == id);
        let indexQueued = queuedFilms.findIndex((queued) => queued.id == id);

        // Convert to boolean
        const isWatched = Boolean(indexWatched + 1);
        const isQueued = Boolean(indexQueued + 1);

        // Return obj of statuses
        return {
                watched: { bool: isWatched, index: indexWatched },
                queued: { bool: isQueued, index: indexQueued },
        };
}

// Close modal
function closeModal(e) {
        // Keyboard event
        if (e.type === "keydown") {
                // Not escape
                if (e.keyCode !== 27) {
                        return;
                }
        }

        // Mouse event
        else {
                // Closest parent is "button" and class is "backdrop"
                if (!e.target.closest("button") && !e.target.classList.contains("backdrop")) {
                        return;
                }

                // Not close buttons
                if (e.target.classList.contains("modal-detail__btn")) return;
        }

        // Toggle hidden class
        refs.modalDetailOverlay.classList.toggle("is-hidden");

        // Show scroll on body
        scrollableBody(true);

        // Deattach keyboard and mouse events
        refs.modalDetailOverlay.removeEventListener("click", closeModal);
        document.removeEventListener("keydown", closeModal);

        // Deattach buttons events
        refs.watchBtn.removeEventListener("click", handleChangeStatus);
        refs.queueBtn.removeEventListener("click", handleChangeStatus);

        // Deattach trailer
        deattachTrailer();

        // For library
        if (!isHome) {
                const watchedButtonEl = document.querySelector("[data-action='watched']");
                if (watchedButtonEl.classList.contains("library-btn--active")) {
                        showWatchedFilms();
                } else {
                        showQueuedFilms();
                }
        }
}
