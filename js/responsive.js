// Performance optimization and responsive enhancements

document.addEventListener("DOMContentLoaded", function () {
	// Lazy load images
	const lazyImages = document.querySelectorAll("img[data-src]");

	if ("IntersectionObserver" in window) {
		const imageObserver = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const img = entry.target;
					img.src = img.dataset.src;
					img.removeAttribute("data-src");
					observer.unobserve(img);
				}
			});
		});

		lazyImages.forEach((img) => imageObserver.observe(img));
	} else {
		// Fallback for older browsers
		lazyImages.forEach((img) => {
			img.src = img.dataset.src;
			img.removeAttribute("data-src");
		});
	}

	// Debounce function for performance optimization
	function debounce(func, wait) {
		let timeout;
		return function executedFunction(...args) {
			const later = () => {
				clearTimeout(timeout);
				func(...args);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	}

	// Detect mobile devices
	const isMobile =
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		);

	if (isMobile) {
		document.body.classList.add("is-mobile");

		// Enhance tap targets for mobile
		const smallButtons = document.querySelectorAll(".social-link");
		smallButtons.forEach((button) => {
			button.classList.add("mobile-tap-target");
		});

		// Add swipe support for mobile
		let touchStartX = 0;
		let touchEndX = 0;

		document.addEventListener("touchstart", (e) => {
			touchStartX = e.changedTouches[0].screenX;
		});

		document.addEventListener("touchend", (e) => {
			touchEndX = e.changedTouches[0].screenX;
			handleSwipeGesture();
		});

		function handleSwipeGesture() {
			const swipeThreshold = 100;
			if (touchEndX < touchStartX - swipeThreshold) {
				// Swiped left - could trigger menu open, etc.
			}
			if (touchEndX > touchStartX + swipeThreshold) {
				// Swiped right - could trigger menu close, etc.
			}
		}
	}

	// Optimize form submission
	const generateButton = document.getElementById("generate-custom-prompt");
	const taskInput = document.getElementById("task");

	// Listen for Enter key in the last form field
	additionalDetails.addEventListener("keydown", function (e) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			generateButton.click();
		}
	});

	// Preconnect to API domain for faster load times
	const preconnectLink = document.createElement("link");
	preconnectLink.rel = "preconnect";
	preconnectLink.href = "https://generativelanguage.googleapis.com";
	document.head.appendChild(preconnectLink);

	// Cache frequently used elements
	const resultDiv = document.getElementById("custom-prompt-result");

	// Optimize scroll behavior for mobile
	if (isMobile) {
		generateButton.addEventListener(
			"click",
			debounce(function () {
				// Smooth scroll to results after generation (with delay for content to populate)
				setTimeout(() => {
					resultDiv.scrollIntoView({ behavior: "smooth", block: "start" });
				}, 1000);
			}, 100)
		);
	}
});

// Add responsive improvements to CSS
document.addEventListener("DOMContentLoaded", function () {
	const styleElement = document.createElement("style");
	styleElement.textContent = `
        @media (max-width: 640px) {
            .form-label {
                font-size: 0.9rem;
            }
            
            .form-input, .form-select, .form-textarea {
                padding: 0.6rem;
                font-size: 1rem;
            }
            
            .btn {
                padding: 0.6rem 1.2rem;
                font-size: 0.9rem;
            }
            
            .mobile-tap-target {
                min-height: 44px;
                min-width: 44px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .is-mobile .form-group {
                margin-bottom: 1rem;
            }
            
            .is-mobile h1 {
                font-size: 1.75rem;
            }
            
            .is-mobile h2 {
                font-size: 1.5rem;
            }
            
            .is-mobile .container {
                padding-left: 1rem;
                padding-right: 1rem;
            }
            
            .is-mobile .shadow-2xl {
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            }
        }
    `;
	document.head.appendChild(styleElement);
});
