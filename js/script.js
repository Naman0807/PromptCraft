// DOM Elements
const categorySelect = document.getElementById("category");
const languageSelect = document.getElementById("language");
const taskInput = document.getElementById("task");
const actionInput = document.getElementById("action");
const additionalDetails = document.getElementById("additional-details");
const apiKeyInput = document.getElementById("api-key");
const generateButton = document.getElementById("generate-custom-prompt");
const copyButton = document.getElementById("copy-to-clipboard");
const clearButton = document.getElementById("clear-fields");
const resultDiv = document.getElementById("custom-prompt-result");
const copyAcknowledgment = document.getElementById("copy-acknowledgment");

// Update language options based on category
categorySelect.addEventListener("change", function () {
	const category = this.value;
	languageSelect.innerHTML = "";
	let options = [];
	switch (category) {
		case "website":
			options = [
				"HTML",
				"Tailwind",
				"BootStrap",
				"JavaScript",
				"React",
				"NextJS",
				"Vue",
				"Svelte",
				"Angular",
			];
			break;
		case "function":
			options = [
				"JavaScript",
				"Python",
				"Java",
				"C++",
				"PHP",
				"NodeJS",
				"Express",
				"Django",
				"Rust",
				"Go",
				"Swift",
				"Kotlin",
				"Ruby",
				"C#",
			];
			break;
		case "database":
			options = [
				"MySQL",
				"MongoDB",
				"PostgreSQL",
				"SQLite",
				"Firebase",
				"Firestore",
				"Redis",
				"DynamoDB",
				"Cassandra",
			];
			break;
		case "mobile":
			options = [
				"Swift",
				"Kotlin",
				"React Native",
				"Flutter",
				"Xamarin",
				"Ionic",
				"Java (Android)",
				"Objective-C",
			];
			break;
		case "game":
			options = [
				"Unity (C#)",
				"Unreal (C++)",
				"JavaScript",
				"Python (Pygame)",
				"Godot",
				"HTML5 Canvas",
				"WebGL",
				"Phaser",
			];
			break;
		case "aiml":
			options = [
				"Python (TensorFlow)",
				"Python (PyTorch)",
				"Python (scikit-learn)",
				"JavaScript (TensorFlow.js)",
				"R",
				"MATLAB",
				"Java (DL4J)",
				"Julia",
			];
			break;
	}

	options.forEach((option) => {
		const optionElement = document.createElement("option");
		optionElement.value = option;
		optionElement.textContent = option;
		languageSelect.appendChild(optionElement);
	});
});

// Generate prompt
generateButton.addEventListener("click", async function () {
	const apiKey = apiKeyInput.value.trim();
	if (!apiKey) {
		showError("Please enter your Gemini API key");
		return;
	}
	disableAllFields(true);
	// Show loading state
	resultDiv.innerHTML = `
        <div class="animate-pulse">
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
    `;

	try {
		const promptText = constructPrompt();
		const response = await callGeminiAPI(apiKey, promptText);
		displayResult(response);
	} catch (error) {
		showError(error.message);
	} finally {
		disableAllFields(false);
	}
});

// Construct prompt text
function constructPrompt() {
	const category = categorySelect.value;
	const language = languageSelect.value;
	const task = taskInput.value.trim();
	const action = actionInput.value.trim();
	const details = additionalDetails.value.trim();

	if (!task || !action) {
		throw new Error("Please fill in both task and action fields");
	}

	let prompt = `Generate a detailed coding prompt for a ${category} using ${language}. `;
	prompt += `The main task is to ${task} `;
	prompt += `specifically for ${action}. `;

	if (details) {
		prompt += `Additional requirements: ${details}. `;
	}

	prompt += `Please structure the response with the following sections:
    1. Project Title
    2. Description
    3. Requirements
    4. Technical Specifications
    5. Bonus Challenges (optional)
    6. Tips for Implementation`;

	return prompt;
}

// Call Gemini API
// Call Gemini API
async function callGeminiAPI(apiKey, prompt) {
	const response = await fetch(
		// The model name in the URL has been updated
		`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				contents: [
					{
						role: "user",
						parts: [
							{
								text: prompt,
							},
						],
					},
				],
				generationConfig: {
					temperature: 0.7,
					maxOutputTokens: 8192,
				},
			}),
		}
	);

	if (!response.ok) {
		throw new Error(
			"Failed to generate prompt. Please check your API key and try again."
		);
	}

	const data = await response.json();
	return data.candidates[0].content.parts[0].text;
}

// Display result
function displayResult(text) {
	// Convert markdown to HTML (basic conversion)
	const htmlContent = text
		.replace(/#{3} (.*?)\n/g, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
		.replace(
			/#{2} (.*?)\n/g,
			'<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>'
		)
		.replace(
			/#{1} (.*?)\n/g,
			'<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>'
		)
		.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
		.replace(/\*(.*?)\*/g, "<em>$1</em>")
		.replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
		.replace(/\n\n/g, "</p><p>")
		.replace(/\n/g, "<br>");

	resultDiv.innerHTML = `<div class="prompt-output text-gray-900">${htmlContent}</div>`;
}

// Show error message
function showError(message) {
	resultDiv.innerHTML = `<div class="text-red-500">${message}</div>`;
}

// Copy to clipboard functionality
copyButton.addEventListener("click", async function () {
	const content = resultDiv.textContent;
	if (content) {
		try {
			await navigator.clipboard.writeText(content);
			copyAcknowledgment.textContent = "Copied to clipboard!";
			setTimeout(() => {
				copyAcknowledgment.textContent = "";
			}, 2000);
		} catch (err) {
			copyAcknowledgment.textContent = "Failed to copy to clipboard";
		}
	}
});

// Clear all fields
clearButton.addEventListener("click", function () {
	taskInput.value = "";
	actionInput.value = "";
	additionalDetails.value = "";
	resultDiv.innerHTML = "";
	copyAcknowledgment.textContent = "";
	localStorage.removeItem("geminiApiKey");
});

// Save API key to localStorage
apiKeyInput.addEventListener("change", function () {
	localStorage.setItem("geminiApiKey", this.value);
});

// Load API key from localStorage on page load
document.addEventListener("DOMContentLoaded", function () {
	const savedApiKey = localStorage.getItem("geminiApiKey");
	if (savedApiKey) {
		apiKeyInput.value = savedApiKey;
	}
});

document.addEventListener("DOMContentLoaded", function () {
	var categorySelect = document.getElementById("category");

	var taskInput = document.getElementById("task");

	var placeholders = {
		website: "Eg. Create a landing page",
		function: "Eg. API Call",
		database: "Eg. Design a user authentication system",
		mobile: "Eg. Create a login screen",
		game: "Eg. Design a character movement system",
		aiml: "Eg. Build a text classification model",
	};

	function updatePlaceholder() {
		var selectedCategory = categorySelect.value;
		taskInput.placeholder = placeholders[selectedCategory] || "";
	}

	categorySelect.addEventListener("change", updatePlaceholder);

	updatePlaceholder();
});

function togglePassword(inputId) {
	const input = document.getElementById(inputId);
	const icon = input.nextElementSibling.querySelector("i");

	if (input.type === "password") {
		input.type = "text";
		icon.classList.remove("fa-eye");
		icon.classList.add("fa-eye-slash");
	} else {
		input.type = "password";
		icon.classList.remove("fa-eye-slash");
		icon.classList.add("fa-eye");
	}
}

function disableAllFields(disable = true) {
	// Form inputs
	const inputs = [
		categorySelect,
		languageSelect,
		taskInput,
		actionInput,
		additionalDetails,
		apiKeyInput,
		generateButton,
		copyButton,
		clearButton,
	];

	inputs.forEach((input) => {
		input.disabled = disable;
		if (disable) {
			input.classList.add("opacity-50", "cursor-not-allowed");
		} else {
			input.classList.remove("opacity-50", "cursor-not-allowed");
		}
	});
}
