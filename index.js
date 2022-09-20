//CODE SPECIFIC TO MOVIE APP//
const autoCompleteConfig = {
    renderOption: (movie) => {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster; //if imgSrc of the poster is N/A, return an empty string; otherwise assign movie.Poster to imgSrc
        return ` 
            <img src = "${imgSrc}"/>
            ${movie.Title} (${movie.Year})
        `; //must use backticks for multi line strings, NOT single quotes
    },
    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchTerm) { //receive value from input as an argument to fetchData function
        const response = await axios.get('https://www.omdbapi.com', {
            params: { //query string parameters we want to pass along with the request; these will be appended to end of above URL
                apikey: '891aad2f',
                s: searchTerm 
            }
        });
    
        if (response.data.Error) {
            return [];
        } //if there is an error in the response, return an empty array
       
        return response.data.Search; //uppercase S bc response in console has capital S; returns array of movies we've fetched
    }
};

createAutoComplete({
    ...autoCompleteConfig, //...means make a copy of everything in the autocompleteconfig object and add it to the root object
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    }
});

createAutoComplete({
    ...autoCompleteConfig, //...means make a copy of everything in the autocompleteconfig object and add it to the root object
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    }
});

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('https://www.omdbapi.com', {
        params: { //query string parameters we want to pass along with the request; these will be appended to end of above URL
            apikey: '891aad2f',
            i: movie.imdbID
        }
    });

    summaryElement.innerHTML = movieTemplate(response.data);

    if(side === 'left'){
        leftMovie=response.data;
    }else{
        rightMovie=response.data;
    }

    if(leftMovie && rightMovie) {
        runComparison();
    }
};

const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];

        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);

        if (rightSideValue > leftSideValue) {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('.has-background-grey-darker');
        }else{
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('.has-background-grey-darker');
        }
    });
};

const movieTemplate = movieDetail => {
    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, '')); //finds any $ and any commas and replaces them with an empty string
    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => { //splits string on spaces
        const value = parseInt(word);

        if (isNaN(value)){
            return prev; //if value is NaN, return whatever our current count is
        }   else{
            return prev + value;
        }
    }, 0);

    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}"/>
                </p>
            </figure>
            <div class = "media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>
        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${metascore} class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `
};
