document.addEventListener("DOMContentLoaded", function () {
    let mainObserver;

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const header = document.querySelector("header");
                const headerOffset = header ? header.offsetHeight : 0;

                const elementPosition =
                    targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                });

                const nav = document.querySelector("nav");
                const menuToggle = document.querySelector(".menu-toggle");
                if (nav && menuToggle && nav.classList.contains("active")) {
                    nav.classList.remove("active");
                    menuToggle.classList.remove("active");
                }
            }
        });
    });

    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("nav");

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            nav.classList.toggle("active");
            menuToggle.classList.toggle("active");
        });

        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                nav.classList.remove("active");
                menuToggle.classList.remove("active");
            });
        });
    }

    const header = document.querySelector("header");
    if (header) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 80) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        });
    }

    const reviewsCarousel = document.getElementById('reviewsCarousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (reviewsCarousel && prevBtn && nextBtn) {
        let scrollAmount = 0;

        const calculateScrollAmount = () => {
            const reviewCard = reviewsCarousel.querySelector('.review-card');
            if (reviewCard) {
                const gapStyle = window.getComputedStyle(reviewsCarousel).gap;
                const gap = gapStyle ? parseFloat(gapStyle) : 0;

                scrollAmount = reviewCard.offsetWidth + gap;
            } else {
                scrollAmount = reviewsCarousel.offsetWidth;
            }
        };

        calculateScrollAmount();

        window.addEventListener('resize', calculateScrollAmount);

        nextBtn.addEventListener('click', () => {
            reviewsCarousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            reviewsCarousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }

    const revealElements = document.querySelectorAll(
        ".reveal, .hero-content, .section-title, .menu-categories, .story-text, .story-image, .review-card, .contact-info, .contact-map, .footer-col, .product-card"
    );

    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15,
    };

    mainObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                if (!entry.target.classList.contains("product-card")) {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    revealElements.forEach((el) => {
        mainObserver.observe(el);
    });

    const menuTabs = document.querySelectorAll(".menu-tab");
    const menuContents = document.querySelectorAll(
        ".menu-content .products"
    );

    const activateCategory = (categoryId) => {
        menuTabs.forEach((tab) => tab.classList.remove("active"));
        menuContents.forEach((content) => content.classList.remove("active"));

        const clickedTab = document.querySelector(
            `.menu-tab[data-category="${categoryId}"]`
        );
        if (clickedTab) {
            clickedTab.classList.add("active");
        }

        const targetCategoryContent = document.getElementById(categoryId);
        if (targetCategoryContent) {
            targetCategoryContent.classList.add("active");
            initializeSlider(targetCategoryContent);
        }
    };

    function initializeSlider(categoryElement) {
        const sliderWrapper =
            categoryElement.querySelector(".slider-wrapper");
        const productCards =
            categoryElement.querySelectorAll(".product-card");
        const leftArrow = categoryElement.querySelector(".left-arrow");
        const rightArrow = categoryElement.querySelector(".right-arrow");

        if (!sliderWrapper || productCards.length === 0) {
            return;
        }

        let currentIndex = 0;
        let cardsPerView = getCardsPerView();
        let totalSlides = Math.ceil(productCards.length / cardsPerView);

        productCards.forEach((card) => {
            card.classList.remove("active");
            mainObserver.observe(card);
        });

        const updateSlider = () => {
            if (productCards.length === 0) return;

            const cardComputedStyle = getComputedStyle(productCards[0]);
            const cardWidth = productCards[0].offsetWidth;
            const cardMarginLeft = parseFloat(cardComputedStyle.marginLeft);
            const cardMarginRight = parseFloat(cardComputedStyle.marginRight);
            const effectiveCardWidth = cardWidth + cardMarginLeft + cardMarginRight;

            sliderWrapper.style.transform = `translateX(-${
                currentIndex * effectiveCardWidth * cardsPerView
            }px)`;
        };

        function getCardsPerView() {
            if (window.innerWidth <= 768 && window.innerWidth > 480) {
                return 2;
            } else if (window.innerWidth <= 480) {
                return 1;
            } else {
                return 3;
            }
        }

        window.addEventListener("resize", () => {
            cardsPerView = getCardsPerView();
            totalSlides = Math.ceil(productCards.length / cardsPerView);
            if (currentIndex >= totalSlides) {
                currentIndex = totalSlides > 0 ? totalSlides - 1 : 0;
            }
            updateSlider();
        });

        if (leftArrow) {
            leftArrow.onclick = () => {
                currentIndex = Math.max(0, currentIndex - 1);
                updateSlider();
            };
        }

        if (rightArrow) {
            rightArrow.onclick = () => {
                currentIndex = Math.min(totalSlides - 1, currentIndex + 1);
                updateSlider();
            };
        }

        updateSlider();
    }

    menuTabs.forEach((tab) => {
        tab.addEventListener("click", function () {
            const categoryId = this.dataset.category;
            activateCategory(categoryId);
        });
    });

    const defaultTab =
        document.querySelector(".menu-tab.active") || menuTabs[0];
    if (defaultTab) {
        activateCategory(defaultTab.dataset.category);
    }

    const ratingStars = document.querySelectorAll('.rating-star');
    const ratingInput = document.getElementById('rating');

    if (ratingStars.length > 0 && ratingInput) {
        ratingStars.forEach(star => {
            star.addEventListener('click', function() {
                const value = parseInt(this.getAttribute('data-value'));
                ratingInput.value = value;
                updateStars(value);
            });

            star.addEventListener('mouseover', function() {
                const value = parseInt(this.getAttribute('data-value'));
                updateStarsHover(value);
            });

            star.addEventListener('mouseout', function() {
                updateStars(parseInt(ratingInput.value));
            });
        });

        function updateStars(selectedValue) {
            ratingStars.forEach((star, index) => {
                if (index < selectedValue) {
                    star.textContent = '★';
                    star.classList.add('filled');
                } else {
                    star.textContent = '☆';
                    star.classList.remove('filled');
                }
            });
        }

        function updateStarsHover(hoverValue) {
            ratingStars.forEach((star, index) => {
                if (index < hoverValue) {
                    star.classList.add('filled');
                } else {
                    star.classList.remove('filled');
                }
            });
        }
        updateStars(parseInt(ratingInput.value || 0));
    }

    const navLinks = document.querySelectorAll('nav a');

    const hoverColor = '#E6A756';

    navLinks.forEach(link => {
        link.dataset.originalColor = window.getComputedStyle(link).color;

        link.addEventListener('mouseover', function() {
            this.style.color = hoverColor;
        });

        link.addEventListener('mouseout', function() {
            this.style.color = this.dataset.originalColor;
        });
    });

document.addEventListener("DOMContentLoaded", function () {
    let mainObserver;

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const header = document.querySelector("header");
                const headerOffset = header ? header.offsetHeight : 0;

                const elementPosition =
                    targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                });

                const nav = document.querySelector("nav");
                const menuToggle = document.querySelector(".menu-toggle");
                if (nav && menuToggle && nav.classList.contains("active")) {
                    nav.classList.remove("active");
                    menuToggle.classList.remove("active");
                }
            }
        });
    });

    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("nav");

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            nav.classList.toggle("active");
            menuToggle.classList.toggle("active");
        });

        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                nav.classList.remove("active");
                menuToggle.classList.remove("active");
            });
        });
    }

    const header = document.querySelector("header");
    if (header) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 80) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        });
    }

    const reviewsCarousel = document.getElementById('reviewsCarousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (reviewsCarousel && prevBtn && nextBtn) {
        let scrollAmount = 0;

        const calculateScrollAmount = () => {
            const reviewCard = reviewsCarousel.querySelector('.review-card');
            if (reviewCard) {
                const gapStyle = window.getComputedStyle(reviewsCarousel).gap;
                const gap = gapStyle ? parseFloat(gapStyle) : 0;

                scrollAmount = reviewCard.offsetWidth + gap;
            } else {
                scrollAmount = reviewsCarousel.offsetWidth;
            }
        };

        calculateScrollAmount();

        window.addEventListener('resize', calculateScrollAmount);

        nextBtn.addEventListener('click', () => {
            reviewsCarousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            reviewsCarousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }

    const revealElements = document.querySelectorAll(
        ".reveal, .hero-content, .section-title, .menu-categories, .story-text, .story-image, .review-card, .contact-info, .contact-map, .footer-col, .product-card"
    );

    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15,
    };

    mainObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                if (!entry.target.classList.contains("product-card")) {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    revealElements.forEach((el) => {
        mainObserver.observe(el);
    });

    const menuTabs = document.querySelectorAll(".menu-tab");
    const menuContents = document.querySelectorAll(
        ".menu-content .products"
    );

    const activateCategory = (categoryId) => {
        menuTabs.forEach((tab) => tab.classList.remove("active"));
        menuContents.forEach((content) => content.classList.remove("active"));

        const clickedTab = document.querySelector(
            `.menu-tab[data-category="${categoryId}"]`
        );
        if (clickedTab) {
            clickedTab.classList.add("active");
        }

        const targetCategoryContent = document.getElementById(categoryId);
        if (targetCategoryContent) {
            targetCategoryContent.classList.add("active");
            initializeSlider(targetCategoryContent);
        }
    };

    function initializeSlider(categoryElement) {
        const sliderWrapper =
            categoryElement.querySelector(".slider-wrapper");
        const productCards =
            categoryElement.querySelectorAll(".product-card");
        const leftArrow = categoryElement.querySelector(".left-arrow");
        const rightArrow = categoryElement.querySelector(".right-arrow");

        if (!sliderWrapper || productCards.length === 0) {
            return;
        }

        let currentIndex = 0;
        let cardsPerView = getCardsPerView();
        let totalSlides = Math.ceil(productCards.length / cardsPerView);

        productCards.forEach((card) => {
            card.classList.remove("active");
            mainObserver.observe(card);
        });

        const updateSlider = () => {
            if (productCards.length === 0) return;

            const cardComputedStyle = getComputedStyle(productCards[0]);
            const cardWidth = productCards[0].offsetWidth;
            const cardMarginLeft = parseFloat(cardComputedStyle.marginLeft);
            const cardMarginRight = parseFloat(cardComputedStyle.marginRight);
            const effectiveCardWidth = cardWidth + cardMarginLeft + cardMarginRight;

            sliderWrapper.style.transform = `translateX(-${
                currentIndex * effectiveCardWidth * cardsPerView
            }px)`;
        };

        function getCardsPerView() {
            if (window.innerWidth <= 768 && window.innerWidth > 480) {
                return 2;
            } else if (window.innerWidth <= 480) {
                return 1;
            } else {
                return 3;
            }
        }

        window.addEventListener("resize", () => {
            cardsPerView = getCardsPerView();
            totalSlides = Math.ceil(productCards.length / cardsPerView);
            if (currentIndex >= totalSlides) {
                currentIndex = totalSlides > 0 ? totalSlides - 1 : 0;
            }
            updateSlider();
        });

        if (leftArrow) {
            leftArrow.onclick = () => {
                currentIndex = Math.max(0, currentIndex - 1);
                updateSlider();
            };
        }

        if (rightArrow) {
            rightArrow.onclick = () => {
                currentIndex = Math.min(totalSlides - 1, currentIndex + 1);
                updateSlider();
            };
        }

        updateSlider();
    }

    menuTabs.forEach((tab) => {
        tab.addEventListener("click", function () {
            const categoryId = this.dataset.category;
            activateCategory(categoryId);
        });
    });

    const defaultTab =
        document.querySelector(".menu-tab.active") || menuTabs[0];
    if (defaultTab) {
        activateCategory(defaultTab.dataset.category);
    }

    const ratingStars = document.querySelectorAll('.rating-star');
    const ratingInput = document.getElementById('rating');

    if (ratingStars.length > 0 && ratingInput) {
        ratingStars.forEach(star => {
            star.addEventListener('click', function() {
                const value = parseInt(this.getAttribute('data-value'));
                ratingInput.value = value;
                updateStars(value);
            });

            star.addEventListener('mouseover', function() {
                const value = parseInt(this.getAttribute('data-value'));
                updateStarsHover(value);
            });

            star.addEventListener('mouseout', function() {
                updateStars(parseInt(ratingInput.value));
            });
        });

        function updateStars(selectedValue) {
            ratingStars.forEach((star, index) => {
                if (index < selectedValue) {
                    star.textContent = '★';
                    star.classList.add('filled');
                } else {
                    star.textContent = '☆';
                    star.classList.remove('filled');
                }
            });
        }

        function updateStarsHover(hoverValue) {
            ratingStars.forEach((star, index) => {
                if (index < hoverValue) {
                    star.classList.add('filled');
                } else {
                    star.classList.remove('filled');
                }
            });
        }
        updateStars(parseInt(ratingInput.value || 0));
    }

    const navLinks = document.querySelectorAll('nav a');

    const hoverColor = '#E6A756';

    navLinks.forEach(link => {
        link.dataset.originalColor = window.getComputedStyle(link).color;

        link.addEventListener('mouseover', function() {
            this.style.color = hoverColor;
        });

        link.addEventListener('mouseout', function() {
            this.style.color = this.dataset.originalColor;
        });
    });

})});