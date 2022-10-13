const PREFIX_POSTER_URL = "https://image.tmdb.org/t/p/w500/";
import { isHome } from "../init";

// Blank image
import blankImage from "../../images/no-image.svg";
import { preparingGenres } from "./genres";

// Preparing image for poster
function preparingImage(poster_path) {
        // Preparing url, check posterImage on NULL
        let posterImage = PREFIX_POSTER_URL;

        // SCSS modifacator for blank image
        let blankImageClass = "";

        // Poster image
        if (poster_path) {
                posterImage += `${poster_path}`;
        } else {
                posterImage = `${blankImage}`;
                blankImageClass = "movies-section__image--blank";
        }

        return { blankImageClass, posterImage };
}

// Preparing title
function preparingTitle(title) {
        if (!title) return;
        return title.length > 23 ? `${title.slice(0, 23)}...` : title;
}

// Create box of movie
export function createMovieCard(movie) {
        const {
                id,
                poster_path,
                title,
                name,
                // original_title,
                genre_ids,
                genres,
                release_date,
                vote_average,
        } = movie;

        // Genres list
        const genresStr = preparingGenres(genre_ids, genres);

        // Poster image
        const { blankImageClass, posterImage } = preparingImage(poster_path);

        // Film title
        const filmTitle = preparingTitle(title || name);

        // Release date
        const date = release_date ? release_date.slice(0, 4) : false;

        // Markup card
        const movieCard = `

                <div class="movies-section__card" data-id=${id || 0}>
                                                
                        <img class="movies-section__image ${blankImageClass}" src="${posterImage}" alt="${filmTitle || "No title"}" loading="lazy" />
                        
                        <ul class="movies-section__info">
                                <li class="movies-section__item">
                                        <span class="movies-section__${
                                                filmTitle ? "title" : "title--no-info"
                                        }">${filmTitle || "No title"}</span>
                                </li>
                                <li class="movies-section__item movies-section__add-info">
                                        <span class="movies-section__${genresStr ? "genres" : "genres--no-info"}">${genresStr || "No genres"}</span>
                                        <span>|</span>
                                        <span class="movies-section__${date ? "year" : "year--no-info"}">${date || "No date"}</span>
                                        
                                        ${!isHome && vote_average ? `
                                                                <span class="movies-section__voteAverage">                                                        
                                                                        ${vote_average ? vote_average.toFixed(1): ""}
                                                                </span>
                                                                `
                                                        : ""
                                        }
                                </li>
                        </ul>
                </div>
    
        `;

        return movieCard;
}
