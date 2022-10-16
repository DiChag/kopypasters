import { initHome } from "./movies/movies";
import initModalFilmDetails from "./modal/modal-film";
import { initLibrary } from "./library/library";
import { getGenres } from "./movies/genres";
export let isHome;

function init() {
        // Check that current page is Index
        isHome = document.title === "Kinoteka" ? true : false;

        // Init modal window for film details
        initModalFilmDetails();

        // Fetching genres and save to localstore
        getGenres();

        // Index or Library
        if (isHome) {
                // Init home page
                initHome();
        } else {
                // Init library
                initLibrary();
        }
}

// Wait the DOM is loaded
document.addEventListener("DOMContentLoaded", init, { once: true });
