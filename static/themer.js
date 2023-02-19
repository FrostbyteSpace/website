// Themer for light/dark themes \\
let currentTheme = "light"

function darkTheme() { // Turn on dark theme
    // Change all hero classes to is-primary-dark
    for (var i = 0; i < document.getElementsByClassName("hero").length; i++) {
        document.getElementsByClassName("hero")[i].classList.remove("is-primary");
        document.getElementsByClassName("hero")[i].classList.add("has-background-primary-dark");
    }
    // Change the background to dark \\
    document.body.style.backgroundColor = "#1a1a1a";
    // Change the text to white by adding the class has-text-white to body \\
    document.body.classList.add("has-text-grey-light");
    // Loop through all the elements that are h1, h2, h3, p, a and strong and add the class has-text-grey-light to them \\
    for (var i = 0; i < document.getElementsByTagName("h1").length; i++) {
        document.getElementsByTagName("h1")[i].classList.add("has-text-grey-light");
    }
    for (var i = 0; i < document.getElementsByTagName("h2").length; i++) {
        document.getElementsByTagName("h2")[i].classList.add("has-text-grey-light");
    }
    for (var i = 0; i < document.getElementsByTagName("h3").length; i++) {
        document.getElementsByTagName("h3")[i].classList.add("has-text-grey-light");
    }
    for (var i = 0; i < document.getElementsByTagName("p").length; i++) {
        document.getElementsByTagName("p")[i].classList.add("has-text-grey-light");
    }
    // for (var i = 0; i < document.getElementsByTagName("a").length; i++) {
    //     document.getElementsByTagName("a")[i].classList.add("has-text-grey-light");
    // }
    for (var i = 0; i < document.getElementsByTagName("strong").length; i++) {
        document.getElementsByTagName("strong")[i].classList.add("has-text-grey-light");
    }
    // Change the footer background to dark \\
    document.getElementsByTagName("footer")[0].classList.remove("has-background-grey-light");
    document.getElementsByTagName("footer")[0].classList.add("has-background-dark");

    // Change the navbar background to dark \\
    document.getElementsByTagName("nav")[0].classList.remove("is-primary");
    document.getElementsByTagName("nav")[0].classList.add("has-background-primary-dark");

    // Lastly, change the button to a sun \\
    document.getElementById("themeIcon").classList.add("fas", "fa-sun");
    document.getElementById("themeButton").classList.add("is-warning");
    document.getElementById("themeButton").classList.remove("is-info");
    document.getElementById("themeIcon").classList.remove("fas","fa-moon");
}

function lightTheme() { // Turn on light theme
    // Change all hero classes to is-primary
    for (var i = 0; i < document.getElementsByClassName("hero").length; i++) {
        document.getElementsByClassName("hero")[i].classList.remove("has-background-primary-dark");
        document.getElementsByClassName("hero")[i].classList.add("is-primary");
    }
    // Change the background to white \\
    document.body.style.backgroundColor = "#ffffff";
    // Change the text to black by removing the class has-text-white from body \\
    document.body.classList.remove("has-text-grey-light");
    // Loop through all the elements that are h1, h2, h3, p, a and strong and remove the class has-text-grey-light from them \\
    for (var i = 0; i < document.getElementsByTagName("h1").length; i++) {
        document.getElementsByTagName("h1")[i].classList.remove("has-text-grey-light");
    }
    for (var i = 0; i < document.getElementsByTagName("h2").length; i++) {
        document.getElementsByTagName("h2")[i].classList.remove("has-text-grey-light");
    }
    for (var i = 0; i < document.getElementsByTagName("h3").length; i++) {
        document.getElementsByTagName("h3")[i].classList.remove("has-text-grey-light");
    }
    for (var i = 0; i < document.getElementsByTagName("p").length; i++) {
        document.getElementsByTagName("p")[i].classList.remove("has-text-grey-light");
    }
    // for (var i = 0; i < document.getElementsByTagName("a").length; i++) {
    //     document.getElementsByTagName("a")[i].classList.remove("has-text-grey-light");
    // }
    for (var i = 0; i < document.getElementsByTagName("strong").length; i++) {
        document.getElementsByTagName("strong")[i].classList.remove("has-text-grey-light");
    }
    // Change the footer background to light grey \\
    document.getElementsByTagName("footer")[0].classList.remove("has-background-dark");
    document.getElementsByTagName("footer")[0].classList.add("has-background-grey-light");

    // Change the navbar background to light grey \\
    document.getElementsByTagName("nav")[0].classList.remove("has-background-primary-dark");
    document.getElementsByTagName("nav")[0].classList.add("is-primary");

    // Lastly, change the button to a moon \\
    document.getElementById("themeIcon").classList.add("fas", "fa-moon");
    document.getElementById("themeButton").classList.add("is-info");
    document.getElementById("themeButton").classList.remove("is-warning");
    document.getElementById("themeIcon").classList.remove("fas", "fa-sun");
}

// Now link them up to the button \\
// Will need to wait until the button is loaded \\
window.onload = function() {
    document.getElementById("themeButton").addEventListener("click", function() {
        if (currentTheme == "light") {
            darkTheme();
            currentTheme = "dark";
        } else {
            lightTheme();
            currentTheme = "light";
        }
    });

    // Now check for system preference \\
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        darkTheme();
        currentTheme = "dark";
        // And change the button to active \\
        document.getElementById("themeButton").checked = true;
    }
    else {
        lightTheme();
        currentTheme = "light";
    }
}

