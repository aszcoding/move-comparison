//REUSABLE REFACTORED CODE//
const createAutoComplete = ({root, renderOption, onOptionSelect, inputValue, fetchData}) => { //config object is where we put all of our references to items and how the items should be rendered and what to do when one is clicked etc.
root.innerHTML = `
    <label><b>Search</b></label>
    <input class="input"/>
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
`;

const input = root.querySelector('input');
const dropdown = root.querySelector('.dropdown');
const resultsWrapper = root.querySelector('.results');

const onInput = async event => {  //onInput event is triggered any time user changes input in text box
       const items = await fetchData(event.target.value);

       if(!items.length) { //if there are no items returned in results
        dropdown.classList.remove('is-active');
        return;
       }

       resultsWrapper.innerHTML = '';
       dropdown.classList.add('is-active');
       for (let item of items) {
        const option = document.createElement('a'); //for each movie result, create an option in the dropdown menu
        

        option.classList.add('dropdown-item');
        option.innerHTML = renderOption(item);
        option.addEventListener('click', () => { //when you click on a movie, the dropdown menu closes
            dropdown.classList.remove('is-active');
            input.value = inputValue(item) //input.value is how you update the input text
            onOptionSelect(item);
        });

        resultsWrapper.appendChild(option);
       }
};
input.addEventListener('input', debounce(onInput, 500));  //value from input; wait .5 second for no key strokes to occur before fetching data

document.addEventListener('click', event => { //check if element that was clicked on is contained inside of root, if it is, keep the dropdown open
    if (!root.contains(event.target)){ // if it isnt, close the dropdown
    dropdown.classList.remove('is-active'); //remove 'is-active' from dropdown; closes dropdown
    }
});
}