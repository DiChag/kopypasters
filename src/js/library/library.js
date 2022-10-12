import { createMovieCard } from "../movies/movieCard";
import { attachOnloadToCards } from "../movies/moviesList";
import PaginationLibrary from "../paginationLibrary/paginationLibrary";
import { loadFromStorage } from "../services/storage";

const instPagination = new PaginationLibrary(9);
instPagination.paginationContainer = "paginationLibrary";

export function initLibrary() {
        showWatchedFilms();

        // EventListeners
        refs.watchedBtn.addEventListener("click", handleShowWatchedFilms);
        refs.queueBtn.addEventListener("click", handleShowQueuedFilms);
}

const refs = {
        watchedBtn: document.querySelector('[data-action="watched"]'),
        queueBtn: document.querySelector('[data-action="queued"]'),
        gallery: document.querySelector(".movies-section__grid"),
};

const genreList = loadFromStorage("genres");

function calculatePerPageBasedOnInnerWidth() {
        if (window.innerWidth > 0 && window.innerWidth < 768) {
                return 4;
        }
        if (window.innerWidth >= 768 && window.innerWidth < 1200) {
                return 8;
        }
        if (window.innerWidth >= 1200) {
                return 9;
        }
}

function handleShowWatchedFilms() {
        instPagination.current = 1;
        showWatchedFilms();
}

// WATCHED
function showWatchedFilms() {
        refs.queueBtn.classList.remove("library-btn--active");
        refs.watchedBtn.classList.add("library-btn--active");
        clearGallery();
        try {
                const watchedFilms = getWatchedFromLocalStorage();
                let perPage = calculatePerPageBasedOnInnerWidth();
                instPagination.initPagination(watchedFilms.length, perPage, showWatchedFilms);
                const markup = renderWatchedFilms(watchedFilms);
                refs.gallery.insertAdjacentHTML("beforeend", markup);

                // Get all cards
                const cards = document.querySelectorAll(".movies-section__card");

                // Add events to cards
                attachOnloadToCards(cards);
        } catch (error) {
                console.log(error);
        }
}

export function getWatchedFromLocalStorage() {
        try {
                const savedFilms = localStorage.getItem("watchedFilms");
                if (!savedFilms && !savedFilms.length) {
                        console.log("there is nothing with such a key!!! and it is empty");
                        throw new Error("There is no data in local storage.");
                }
                const parsedFilmsData = JSON.parse(savedFilms);
                return parsedFilmsData;
        } catch (error) {
                console.log(error);
        }
}

function renderWatchedFilms(watchedFilms) {
        instPagination.calculateIndexesOfArray();

        let markup = "";

        for (
                let i = instPagination.firstIndexOfArray;
                i <= instPagination.lastIndexOfArray;
                i += 1
        ) {
                markup = markup + createMovieCard(watchedFilms[i], genreList);
        }

        return markup;
}

function handleShowQueuedFilms() {
        instPagination.current = 1;
        showQueuedFilms();
}

// QUEUED
function showQueuedFilms() {
        refs.queueBtn.classList.add("library-btn--active");
        refs.watchedBtn.classList.remove("library-btn--active");
        clearGallery();
        try {
                const queuedFilms = getQueuedFromLocalStorage();
                let perPage = calculatePerPageBasedOnInnerWidth();
                instPagination.initPagination(queuedFilms.length, perPage, showQueuedFilms);
                const markup = renderQueuedFilms(queuedFilms);
                refs.gallery.insertAdjacentHTML("beforeend", markup);
        } catch (e) {
                displayMessage();
        }
}

export function getQueuedFromLocalStorage() {
        try {
                const savedFilms = localStorage.getItem("queuedFilms");
                if (!savedFilms && !savedFilms.length) {
                        console.log("there is nothing with such a key!!! and it is empty");
                        throw new Error("There is no data in local storage.");
                }
                const parsedFilmsData = JSON.parse(savedFilms);

                return parsedFilmsData;
        } catch (e) {
                console.log(e);
        }
}

function renderQueuedFilms(queuedFilms) {
        instPagination.calculateIndexesOfArray();

        let markup = "";

        for (
                let i = instPagination.firstIndexOfArray;
                i <= instPagination.lastIndexOfArray;
                i += 1
        ) {
                markup = markup + createMovieCard(queuedFilms[i], genreList);
                // debugger;
        }

        return markup;
}

//to display message when there are no films in WATCHED/ QUEUE:

function displayMessage() {
        const messageMarkup = `<p class="movies-section__message"> Oops, seems like it's empty. Go to <a href="./index.html" class="movies-section__message--bold">Home</a> to add some films.</p>`;
        refs.gallery.insertAdjacentHTML("beforeend", messageMarkup);
}

function clearGallery() {
        refs.gallery.innerHTML = "";
}

export { showQueuedFilms, showWatchedFilms };
