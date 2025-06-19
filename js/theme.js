// Theme management system
document.addEventListener("DOMContentLoaded", function () {
	const themeToggle = document.getElementById("theme-toggle");
	const icon = themeToggle.querySelector("i");
	const html = document.documentElement;

	// Check for saved theme preference or use device preference
	const savedTheme = localStorage.getItem("theme");
	const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

	// Apply theme based on saved preference or device preference
	if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
		enableDarkMode();
	} else {
		enableLightMode();
	}

	// Toggle theme when button is clicked
	themeToggle.addEventListener("click", function () {
		if (html.classList.contains("dark")) {
			enableLightMode();
		} else {
			enableDarkMode();
		}
	});

	function enableDarkMode() {
		html.classList.add("dark");
		icon.classList.remove("fa-moon");
		icon.classList.add("fa-sun");
		localStorage.setItem("theme", "dark");
	}

	function enableLightMode() {
		html.classList.remove("dark");
		icon.classList.remove("fa-sun");
		icon.classList.add("fa-moon");
		localStorage.setItem("theme", "light");
	}
});
