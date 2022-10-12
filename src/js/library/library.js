import { createMovieCard } from "../movies/movieCard";
import { attachOnloadToCards } from "../movies/moviesList";
import PaginationLibrary from "../paginationLibrary/paginationLibrary";
import { loadFromStorage } from "../services/storage";

const instPagination = new PaginationLibrary(9);
instPagination.paginationContainer = "paginationLibrary";

export function initLibrary() {
        console.log("showWatchedFilms");
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
                return (perPage = 4);
        }
        if (window.innerWidth >= 768 && window.innerWidth < 1200) {
                return (perPage = 8);
        }
        if (window.innerWidth >= 1200) {
                return (perPage = 9);
        }
}

function handleShowWatchedFilms() {
        instPagination.current = 1;
        showWatchedFilms();
}

const test = [
        {
                adult: false,
                backdrop_path: "/qtfMr08KQsWXnCHY0a96N8NpQ2l.jpg",
                id: 30984,
                name: "Bleach",
                original_language: "ja",
                original_name: "ブリーチ",
                overview: "For as long as he can remember, Ichigo Kurosaki has been able to see ghosts. But when he meets Rukia, a Soul Reaper who battles evil spirits known as Hollows, he finds his life is changed forever. Now, with a newfound wealth of spiritual energy, Ichigo discovers his true calling: to protect the living and the dead from evil.",
                poster_path: "/2EewmxXe72ogD0EaWM8gqa0ccIw.jpg",
                media_type: "tv",
                genre_ids: [10759, 16, 10765],
                popularity: 529.842,
                first_air_date: "2004-10-05",
                vote_average: 8.335,
                vote_count: 1263,
                origin_country: ["JP"],
        },
        {
                adult: false,
                backdrop_path: "/pfAZP7JvTTxqgq7n6A1OYgkAdEW.jpg",
                id: 894205,
                title: "Werewolf by Night",
                original_language: "en",
                original_title: "Werewolf by Night",
                overview: "On a dark and somber night, a secret cabal of monster hunters emerge from the shadows and gather at the foreboding Bloodstone Temple following the death of their leader. In a strange and macabre memorial to the leader’s life, the attendees are thrust into a mysterious and deadly competition for a powerful relic—a hunt that will ultimately bring them face to face with a dangerous monster.",
                poster_path: "/1n2q0Y1pX8PkQh9imqGbNH7Bw4q.jpg",
                media_type: "movie",
                genre_ids: [28, 14, 27],
                popularity: 364.795,
                release_date: "2022-09-25",
                video: false,
                vote_average: 7.4,
                vote_count: 311,
        },
];

// WATCHED
function showWatchedFilms() {
        refs.queueBtn.classList.remove("library-btn--active");
        refs.watchedBtn.classList.add("library-btn--active");
        clearGallery();

        // const watchedFilms = getWatchedFromLocalStorage();
        const watchedFilms = test;
        let perPage = calculatePerPageBasedOnInnerWidth();
        instPagination.initPagination(watchedFilms.length, perPage, showWatchedFilms);
        console.log(watchedFilms);
        const markup = renderWatchedFilms(watchedFilms);
        console.log(markup);
        console.log(refs.gallery);
        refs.gallery.insertAdjacentHTML("beforeend", markup);

        // Get all cards
        const cards = document.querySelectorAll(".movies-section__card");

        // Add events to cards
        attachOnloadToCards(cards);
}

export function getWatchedFromLocalStorage() {
        console.log("getWatchedFromLocalStorage");
        try {
                const savedFilms = localStorage.getItem("watchedFilms");
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

function renderWatchedFilms(watchedFilms) {
        console.log("renderWatchedFilms");
        console.log(watchedFilms);
        // console.log(firstIndexOfArray);
        // console.log(lastIndexOfArray);
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
        console.log("showQueuedFilms");
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
        console.log("getQueuedFromLocalStorage");
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
