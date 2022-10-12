import axios from "axios";

const URL = "https://api.themoviedb.org/3/";
const API_KEY = "d5db08081a23b85f2c18e58b0bb5a9b8";

// API Key (v3 auth)
// d5db08081a23b85f2c18e58b0bb5a9b8

// by ID
// https://api.themoviedb.org/3/movie/550?api_key=d5db08081a23b85f2c18e58b0bb5a9b8

// Search for keyword
// https://api.themoviedb.org/3/search/movie?api_key=d5db08081a23b85f2c18e58b0bb5a9b8&query=mov

// Get popular
// https://api.themoviedb.org/3/movie/popular?api_key=d5db08081a23b85f2c18e58b0bb5a9b8&language=en-US&page=1

// API Read Access Token (v4 auth)
// eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNWRiMDgwODFhMjNiODVmMmMxOGU1OGIwYmI1YTliOCIsInN1YiI6IjYzM2VkODczN2Q0MWFhMDA3OWZjNGFlOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jRi_XACbwedc_uUlQPnSBP7cGTbkSX4n9YPEkKTbzyQ

// https://api.themoviedb.org/3/genre/movie/list?api_key=d5db08081a23b85f2c18e58b0bb5a9b8&language=en-US

// Fetch to Movies API
// return Film by keyword or Popular films
export const fetchMovie = async ({ keyword, page }) => {
        // Get base URL
        let url = URL;

        // Set default param
        const param = new URLSearchParams({
                api_key: API_KEY,
        });

        // Search for keywords, else post for popular movies
        if (keyword) {
                param.set("query", keyword);
                url = `${url}search/movie`;
        } else {
                url = `${url}movie/popular`;
        }

        // Page param
        if (page) {
                param.set("page", page);
        }

        // console.log(`${url}?${param.toString()}`);
        return axios.get(`${url}?${param.toString()}`);
};

// Get all genres list
export const fetchGenres = async () => {
        // Get base URL
        let url = URL;

        // Set default param
        const param = new URLSearchParams({
                api_key: API_KEY,
        });

        url = `${url}genre/movie/list`;

        return axios.get(`${url}?${param.toString()}`);
};

// Get movie info by id
export const fetchMovieDetailsById = async (id) => {
        let url = URL;

        const param = new URLSearchParams({
                api_key: API_KEY,
                append_to_response: 'videos', //,images
        });

        const urlId = `movie/${id}`;
        
        return axios.get(`${url}${urlId}?${param.toString()}`);
};