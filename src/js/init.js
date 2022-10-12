import { getMovieByName_deb, getGenres } from "./movies/movies";
import initModalFilmDetails from "./modal/modal-film";
import initHeaderSearchForm from "./header/header";
import { initLibrary } from "./library/library";
export let isHome;


function init() {
        console.log('init');
        isHome = document.title === "Kinoteka" ? true : false;

        // Init modal window for film details
        initModalFilmDetails();

        // Init for Home page
        if (isHome) {
                // Init search
                initHeaderSearchForm();

                // Fetching genres and save to localstore
                getGenres();

                // Fetching popular movies( empty keyword )
                getMovieByName_deb({ pagination: true });
                return;
        } else {
                // Init library
                initLibrary();
        }
}

// Wait the DOM is loaded
document.addEventListener("DOMContentLoaded", init, { once: true });
