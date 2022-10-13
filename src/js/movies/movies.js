import { fetchMovie } from "../services/fetch";
import { debounce } from "lodash";
import { renderMoviesList } from "./moviesList";
import { loadingSpinnerToggle } from "../interface/spinner";
import { warningMessage } from "../interface/warning-message";
import { initPagination } from "../pagination/init";
import { loadingSpinnerToggle } from "../interface/spinner";
import { fetchMovieDetailsById } from "../services/fetch";
import initHeaderSearchForm from "../header/header";

export const DEBOUNCE_DELAY = 300;

// Post http req and trying to get pictures
async function getMovieByName(param) {
        try {
                // Hide warning message
                warningMessage(false);

                // Show loading spinner
                loadingSpinnerToggle();
                await new Promise((resolve) => setTimeout(resolve, 300));

                // Send http req, trying get the pictures
                const response = await fetchMovie(param);

                // Check statuses
                if (response.status !== 200) {
                        throw new Error(response.status);
                }

                if (response.data === undefined) {
                        throw new Error("Incorrect data");
                }

                // Get JSON of pictures
                const dataJSON = response.data;

                // Get total pages and cur page
                const { total_pages } = dataJSON;

                // Return if founded nothing and show warning
                if (total_pages == 0) {
                        warningMessage(true);
                        return;
                }

                // Rendering founded pictures to grid
                renderMoviesList(dataJSON);

                // Initialization pagination
                const { pagination } = param;
                if (pagination) initPagination({ total_pages, param });
        } catch (error) {
                console.log(error);
        } finally {
                // Hide loading spinner
                loadingSpinnerToggle();
        }
}

// Wrap in lodash for debouncing
const getMovieByName_deb = debounce((param) => {
        getMovieByName(param);
}, DEBOUNCE_DELAY);

// Fetch movie by ID
async function getMovieById(id) {
        try {
                // spinner
                loadingSpinnerToggle();
                await new Promise((resolve) => setTimeout(resolve, 300));

                // Send http req, trying get the pictures
                const response = await fetchMovieDetailsById(id);

                // Check statuses
                if (response.status !== 200) {
                        throw new Error(response.status);
                }

                if (response.data === undefined) {
                        throw new Error("Incorrect data");
                }

                // Get JSON of pictures
                const dataJSON = response.data;

                return dataJSON;
        } catch (error) {
                console.log(error);
        } finally {
                // Hide loading spinner
                loadingSpinnerToggle();
        }
}

function initHome() {
        // Init search
        initHeaderSearchForm();

        // Fetching popular movies( empty keyword )
        getMovieByName_deb({ pagination: true });
}

export { getMovieByName_deb, getMovieById, initHome };
