/* DARK MODE TOGGLE */

const darkModeButton = document.querySelector("#dark-mode-button");

if (darkModeButton) {
  const darkModeIcon = darkModeButton.querySelector("i");

  darkModeButton.addEventListener("click", () => {
    const isDarkMode = document.body.classList.toggle("dark-mode");

    darkModeButton.setAttribute("aria-pressed", String(isDarkMode));
    darkModeButton.setAttribute(
      "aria-label",
      isDarkMode ? "Switch to light mode" : "Switch to dark mode",
    );

    if (darkModeIcon) {
      darkModeIcon.className = isDarkMode ? "bi bi-sun" : "bi bi-moon";
    }
  });
}

// TYPEWRITER EFFECT HERO
const typewriterText = document.querySelector(".typewriter-text");

if (
  typewriterText &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const phrases = ["YouPrint Studio", "Printing & Graphic Design"];
  let phraseIndex = 0;
  let characterIndex = phrases[0].length;
  let isDeleting = true;

  const animateTypewriter = () => {
    const currentPhrase = phrases[phraseIndex];
    characterIndex += isDeleting ? -1 : 1;
    typewriterText.textContent = currentPhrase.slice(0, characterIndex);

    let delay = isDeleting ? 45 : 90;

    if (isDeleting && characterIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 350;
    } else if (!isDeleting && characterIndex === currentPhrase.length) {
      isDeleting = true;
      delay = 1400;
    }

    window.setTimeout(animateTypewriter, delay);
  };

  window.setTimeout(animateTypewriter, 1400);
}

const mainNavigation = document.querySelector(".header-nav");
let revealObserver = null;
let blogRevealObserver = null;

if (mainNavigation) {
  const navigationLinks = Array.from(
    mainNavigation.querySelectorAll(".nav-links a"),
  );

  mainNavigation.addEventListener("click", (event) => {
    const clickedLink = event.target.closest(".nav-links a");

    if (!clickedLink) {
      return;
    }

    navigationLinks.forEach((link) => {
      const isActive = link === clickedLink;
      link.classList.toggle("is-active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    const destination = document.querySelector(
      clickedLink.getAttribute("href"),
    );
    const destinationSection = destination?.closest("section") ?? destination;

    destinationSection?.querySelectorAll(".reveal").forEach((element) => {
      const observer = element.matches(".blog-card")
        ? blogRevealObserver
        : revealObserver;

      observer?.unobserve(element);
      element.classList.remove("is-visible");

      if (observer) {
        window.requestAnimationFrame(() => observer.observe(element));
      }
    });
  });
}

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

const uploadFileInput = document.querySelector("#design-file");

if (uploadFileInput) {
  const acceptedExtensions = new Set([
    "pdf",
    "jpg",
    "jpeg",
    "png",
    "ai",
    "tif",
    "tiff",
  ]);

  uploadFileInput.addEventListener("change", () => {
    const [file] = uploadFileInput.files;
    uploadFileInput.setCustomValidity("");

    if (!file) {
      return;
    }

    const extension = file.name.split(".").pop().toLowerCase();

    if (file.size > 20 * 1024 * 1024) {
      uploadFileInput.setCustomValidity("The file must be 20MB or smaller.");
      return;
    }

    if (!acceptedExtensions.has(extension)) {
      uploadFileInput.setCustomValidity(
        "Accepted formats are PDF, JPG, PNG, AI, and TIFF.",
      );
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
    reviewsCarousel.querySelectorAll(":scope > .review-card"),
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
    clonedGroup
      .querySelectorAll("a, button, input, select, textarea, [tabindex]")
      .forEach((element) => {
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

/* SLIDE-IN ON SCROLL */

const revealElements = document.querySelectorAll(".reveal");

if (revealElements.length > 0) {
  if (!("IntersectionObserver" in window) || prefersReducedMotion.matches) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  } else {
    const revealObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    };

    revealObserver = new IntersectionObserver(revealObserverCallback, {
      threshold: 0.2,
    });
    blogRevealObserver = new IntersectionObserver(revealObserverCallback, {
      rootMargin: "0px 0px 120px 0px",
    });

    revealElements.forEach((element) => {
      const observer = element.matches(".blog-card")
        ? blogRevealObserver
        : revealObserver;

      observer.observe(element);
    });
  }
}

/* SERVICE AND PORTFOLIO IMAGE PREVIEW */
const previewImages = document.querySelectorAll(
  ".portfolio-card img, .service-image img",
);

if (previewImages.length > 0) {
  const lightbox = document.createElement("div");
  lightbox.classList.add("portfolio-lightbox");
  lightbox.hidden = true;
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Image preview");

  const previewImage = document.createElement("img");
  previewImage.alt = "Portfolio image preview";

  const closeButton = document.createElement("button");
  closeButton.classList.add("portfolio-lightbox-close");
  closeButton.type = "button";
  closeButton.textContent = "x";
  closeButton.setAttribute("aria-label", "Close image preview");

  lightbox.appendChild(closeButton);
  lightbox.appendChild(previewImage);
  document.body.appendChild(lightbox);

  let activeImage = null;

  function closePreview() {
    lightbox.hidden = true;
    previewImage.removeAttribute("src");
    document.body.style.overflow = "";
    activeImage?.focus();
    activeImage = null;
  }

  function openPreview(image) {
    activeImage = image;
    previewImage.src = image.src;
    previewImage.alt = image.alt;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    closeButton.focus();
  }

  previewImages.forEach((image) => {
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-haspopup", "dialog");

    image.addEventListener("click", () => openPreview(image));

    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPreview(image);
      }
    });
  });

  document.querySelectorAll(".service-card > a").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const image = link
        .closest(".service-card")
        .querySelector(".service-image img");
      openPreview(image);
    });
  });

  closeButton.addEventListener("click", closePreview);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closePreview();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) {
      closePreview();
    }
  });
}
