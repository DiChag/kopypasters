import { fetchGenres } from "../services/fetch";
import { loadFromStorage, saveToStorage } from "../services/storage";

// Get genres by IDs
function getGenresByID({ genres: genresList }, ids) {
        const res = [];

        genresList.forEach((genre) => {
                if (ids.includes(genre["id"])) {
                        res.push(genre["name"]);
                }
        });

        return res.join(", ");
}

// Join genres array to string
function parseGenres(genres) {
        return genres.map((genre) => genre.name).join(", ");
}

// Post http req and trying to get pictures
async function getGenres() {
        try {
                // Send http req, trying get the pictures
                const response = await fetchGenres();

                if (response.status !== 200) {
                        throw new Error(response.status);
                }

                if (response.data === undefined) {
                        throw new Error("Incorrect data");
                }

                // Get JSON of pictures
                const dataJSON = response.data;

                // Save genres to localStorage
                saveToStorage("genres", dataJSON);
        } catch (error) {
                console.log(error);
        }
}

function preparingGenres(genre_ids, genres) {
        const genreList = loadFromStorage("genres");
        
        let genresStr;
        if (genre_ids) {
                // Get genres by ID
                genresStr = getGenresByID(genreList, genre_ids);
        } else if (genres) {
                // Join genres array to string
                genresStr = parseGenres(genres);
        }
        // Cuts long strings
        return genresStr.length > 23 ? `${genresStr.slice(0, 23)}...` : genresStr;
}

export { parseGenres, preparingGenres, getGenres };
