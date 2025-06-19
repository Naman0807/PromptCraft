// SEO optimization script for PromptCraft
document.addEventListener("DOMContentLoaded", function () {
	const categorySelect = document.getElementById("category");
	const languageSelect = document.getElementById("language");

	// Update page title based on user selections
	function updateDynamicSeo() {
		const category = categorySelect.value;
		const language = languageSelect.value;

		// Capitalize category for display
		const categoryCapitalized =
			category.charAt(0).toUpperCase() + category.slice(1);

		// Update page title dynamically based on user selections
		if (category && language) {
			document.title = `PromptCraft - ${language} ${categoryCapitalized} Prompt Maker | AI Coding Prompts`;
		}

		// Update JSON-LD structured data
		updateStructuredData(category, language);
	}

	// Update structured data based on selections
	function updateStructuredData(category, language) {
		if (!category || !language) return;

		const structuredData = {
			"@context": "https://schema.org",
			"@type": "WebApplication",
			name: "PromptCraft",
			alternateName: `${language} Prompt Maker`,
			url: "prompt-craft-llmtools.vercel.app/",
			logo: "prompt-craft-llmtools.vercel.app/img/logo.png",
			description: `PromptCraft is an AI-powered prompt maker for ${language} ${category} coding exercises and projects.`,
			applicationCategory: "DeveloperApplication",
			operatingSystem: "Web",
			offers: {
				"@type": "Offer",
				price: "0",
				priceCurrency: "USD",
			},
			creator: {
				"@type": "Person",
				name: "Naman Parmar",
			},
		};

		// Get existing script tag or create a new one
		let scriptTag = document.querySelector(
			'script[type="application/ld+json"]'
		);
		if (!scriptTag) {
			scriptTag = document.createElement("script");
			scriptTag.type = "application/ld+json";
			document.head.appendChild(scriptTag);
		}

		// Update the script content
		scriptTag.textContent = JSON.stringify(structuredData);
	}

	// Set up event listeners
	categorySelect.addEventListener("change", updateDynamicSeo);
	languageSelect.addEventListener("change", updateDynamicSeo);

	// Initialize
	updateDynamicSeo();
});
