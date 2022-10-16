import { createMovieCard } from "../movies/movieCard";
import { attachOnloadToCards } from "../movies/moviesList";
import PaginationLibrary from "../paginationLibrary/paginationLibrary";
import { isHome } from "../init";

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

// Medias
const sq = window.matchMedia("screen and (max-width: 767px)");
const lq = window.matchMedia("screen and (min-width: 1200px)");

// Resize pagination on mobile and tablet
sq.addEventListener("change", (event) => {
        if (!isHome) {
                let { perPage, adjustment } = calculateAdjustmentBasedOnInnerWidth();
                instPagination.per_Page = perPage;
                instPagination.adjastment = adjustment;
                instPagination.update();
        }
});

// Resize pagination on tablet and desktop
lq.addEventListener("change", (event) => {
        if (!isHome) {
                let { perPage, adjustment } = calculateAdjustmentBasedOnInnerWidth();
                instPagination.per_Page = perPage;
                instPagination.adjastment = adjustment;
                instPagination.update();
        }
});

function calculateAdjustmentBasedOnInnerWidth() {
        if (window.innerWidth > 0 && window.innerWidth < 768) {
                return { perPage: 9, adjustment: 7 };
        }
        if (window.innerWidth >= 768 && window.innerWidth < 1200) {
                return { perPage: 9, adjustment: 11 };
        }
        if (window.innerWidth >= 1200) {
                return { perPage: 9, adjustment: 17 };
        }
}

function handleShowWatchedFilms() {
        instPagination.current = 1;
        showWatchedFilms();
}

// Watched
function showWatchedFilms() {
        refs.queueBtn.classList.remove("library-btn--active");
        refs.watchedBtn.classList.add("library-btn--active");
        clearGallery();
        try {
                const watchedFilms = getWatchedFromLocalStorage();
                let { perPage, adjustment } = calculateAdjustmentBasedOnInnerWidth();
                instPagination.initPagination(
                        watchedFilms.length,
                        perPage,
                        showWatchedFilms,
                        adjustment,
                );
                const markup = renderWatchedFilms(watchedFilms);
                refs.gallery.insertAdjacentHTML("beforeend", markup);

                // Get all cards
                const cards = document.querySelectorAll(".movies-section__card");

                // Add events to cards
                attachOnloadToCards(cards);
        } catch (error) {
                displayMessage();
        }
}

export function getWatchedFromLocalStorage() {
        try {
                const savedFilms = localStorage.getItem("watchedFilms");
                if (!savedFilms && !savedFilms.length) {
                        throw new Error("There is no data.");
                }
                const parsedFilmsData = JSON.parse(savedFilms);
                return parsedFilmsData;
        } catch (error) {
                // console.log(error);
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
                markup = markup + createMovieCard(watchedFilms[i]);
        }

        return markup;
}

function handleShowQueuedFilms() {
        instPagination.current = 1;
        showQueuedFilms();
}

// Queued
function showQueuedFilms() {
        refs.queueBtn.classList.add("library-btn--active");
        refs.watchedBtn.classList.remove("library-btn--active");
        clearGallery();
        try {
                const queuedFilms = getQueuedFromLocalStorage();
                let { perPage, adjustment } = calculateAdjustmentBasedOnInnerWidth();
                instPagination.initPagination(
                        queuedFilms.length,
                        perPage,
                        showQueuedFilms,
                        adjustment,
                );
                const markup = renderQueuedFilms(queuedFilms);
                refs.gallery.insertAdjacentHTML("beforeend", markup);
        } catch (error) {
                displayMessage();
        }
}

export function getQueuedFromLocalStorage() {
        try {
                const savedFilms = localStorage.getItem("queuedFilms");
                if (!savedFilms && !savedFilms.length) {
                        throw new Error("There is no data in local storage.");
                }
                const parsedFilmsData = JSON.parse(savedFilms);

                return parsedFilmsData;
        } catch (error) {
                // console.log(error);
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
                markup = markup + createMovieCard(queuedFilms[i]);
        }

        return markup;
}

//to display the message when there are no films in Watched/Queue:

function displayMessage() {
        const messageMarkup = `<p class="movies-section__message"> Oops, seems like it's empty. Go to <a href="./index.html" class="movies-section__message--bold">Home</a> to add some films.</p>`;
        refs.gallery.insertAdjacentHTML("beforeend", messageMarkup);
}

// clearing gallery
function clearGallery() {
        refs.gallery.innerHTML = "";
}

export { showQueuedFilms, showWatchedFilms };
