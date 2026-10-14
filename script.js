
/* DARK MODE TOGGLE */

const darkModeButton = document.querySelector("#dark-mode-button");

if (darkModeButton) {
    const darkModeIcon = darkModeButton.querySelector("i");

    darkModeButton.addEventListener("click", () => {
        const isDarkMode = document.body.classList.toggle("dark-mode");

        darkModeButton.setAttribute("aria-pressed", String(isDarkMode));
        darkModeButton.setAttribute(
            "aria-label",
            isDarkMode ? "Switch to light mode" : "Switch to dark mode"
        );

        if (darkModeIcon) {
            darkModeIcon.className = isDarkMode ? "bi bi-sun" : "bi bi-moon";
        }
    });
}

/* REVIEW RATING STARS */

const ratingStars = document.querySelector(".rating-stars");

if (ratingStars) {
    ratingStars.addEventListener("change", (event) => {
        const selectedRating = Number(event.target.value);

        ratingStars.querySelectorAll('input[name="rating"]').forEach((input) => {
            const starIcon = input.labels[0]?.querySelector("i");

            if (starIcon) {
                const isSelected = Number(input.value) <= selectedRating;
                starIcon.classList.toggle("bi-star-fill", isSelected);
                starIcon.classList.toggle("bi-star", !isSelected);
            }
        });
    });
}

/* CONTINUOUS HORIZONTAL REVIEWS CAROUSEL */

const reviewsCarousel = document.querySelector(".reviews-carousel");

if (reviewsCarousel && !reviewsCarousel.dataset.initialized) {
    // Get the original review cards
    const reviewCards = Array.from(
        reviewsCarousel.querySelectorAll(":scope > .review-card")
    );

    if (reviewCards.length > 0) {
        // Create the moving track
        const reviewsTrack = document.createElement("div");
        reviewsTrack.className = "reviews-track";

        // Create the original group of review cards
        const originalGroup = document.createElement("div");
        originalGroup.className = "reviews-group";

        reviewCards.forEach((card) => {
            originalGroup.appendChild(card);
        });

        // Duplicate the original group for a seamless loop
        const clonedGroup = originalGroup.cloneNode(true);
        clonedGroup.setAttribute("aria-hidden", "true");

        // Prevent cloned interactive elements from receiving focus
        clonedGroup.querySelectorAll(
            "a, button, input, select, textarea, [tabindex]"
        ).forEach((element) => {
            element.setAttribute("tabindex", "-1");

            if (element.matches('input[type="radio"], input[type="checkbox"]')) {
                element.disabled = true;
            }
        });

        // Add both groups to the track
        reviewsTrack.appendChild(originalGroup);
        reviewsTrack.appendChild(clonedGroup);

        // Add the track to the carousel
        reviewsCarousel.appendChild(reviewsTrack);

        // Mark the carousel as initialized
        reviewsCarousel.dataset.initialized = "true";
    }
}
