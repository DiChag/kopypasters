import Pagination from "../pagination/index.js";
import { getMovieByName_deb } from "../movies/movies";

// Globar var for pagination instance
export let myPager;

// Init pagination
export function initPagination({ total_pages = 1, per_page = 20, param }) {
        // Keyword for sending req
        const { keyword } = param;

        // Limit pages
        if (total_pages > 10000) total_pages = 10000;

        // Create instance of pagination class
        myPager = new Pagination(
                total_pages,
                per_page,

                function (page) {
                        // Send req with new page for same keyword
                        // Don't do new instance
                        getMovieByName_deb({
                                keyword,
                                page: page.current,
                                pagination: false,
                        });
                },
                ".pagination",
        );

        // Medias
        const sq = window.matchMedia("screen and (max-width: 767px)");
        const lq = window.matchMedia("screen and (min-width: 1200px)");

        // Resize pagination on mobile and tablet
        sq.addEventListener("change", (event) => {
                if (event.matches) {
                        myPager.update({ adjacent: 1 });
                } else {
                        myPager.update({ adjacent: 3 });
                }
        });

        // Resize pagination on tablet and desktop
        lq.addEventListener("change", (event) => {
                if (event.matches) {
                        myPager.update({ adjacent: 6 });
                } else {
                        myPager.update({ adjacent: 3 });
                }
        });

        // Init on run
        sq.matches && !lq.matches && myPager.update({ adjacent: 1 });
        !sq.matches && lq.matches && myPager.update({ adjacent: 6 });
}
