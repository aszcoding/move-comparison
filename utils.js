const debounce = (func, delay = 1000) => { //debounce returns a function
    let timeoutId;
    return (...args) => { //wrapper that guards how often func can be invoked; ...args takes all diff arguments that are passed to the function
        if (timeoutId){ //is timeoutId defined? The very first time we run the code, it will be undefined, so it will skip this if statement entirely
            clearTimeout(timeoutId); //stops existing timer 
        }
        timeoutId = setTimeout(() => {  //sets up a brand new timer
            func.apply(null, args); //apply = call function as we normally would and take all of the arguments and pass them in as separate args to original function
        }, delay) 
    };
};