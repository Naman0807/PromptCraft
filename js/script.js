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

	let prompt = `You are a specialized coding prompt generator. Create a detailed, structured prompt for a ${category} development task using ${language}.

PRIMARY TASK: ${task}
SPECIFIC GOAL: ${action}
${
	details
		? `ADDITIONAL CONTEXT: ${details}
`
		: ""
}

Generate a response in the following exact format. Use only the sections specified below and maintain consistent formatting:

---

# [Project Title]
A clear, concise title for the project. Add a Name as well.

## Description
A 2-3 sentence overview of what will be built.

## Core Requirements
- [List 4-5 must-have features or functionalities]

## Technical Specifications
### Technology Stack:
- ${language} [Required]
- [List any necessary frameworks/libraries]

### Implementation Details:
- [List specific technical requirements]
- [Include architecture/structure details]
- [Mention any specific patterns or approaches to use]

## Acceptance Criteria
- [ ] [List measurable outcomes]
- [ ] [Include testing requirements if applicable]
- [ ] [Add performance/quality criteria]

## Bonus Challenges
- [Optional] [List 1-2 extra features]
- [Optional] [Include advanced implementations]

## Development Tips
- [Provide 2-3 specific, actionable tips]
- [Include best practices]
- [Mention potential pitfalls to avoid]

---

Ensure all sections maintain consistent formatting and use appropriate markdown symbols. Keep the response focused, practical, and aligned with industry best practices for ${category} development.`;

	return prompt;
}

// Call Gemini API
async function callGeminiAPI(apiKey, prompt) {
	const response = await fetch(
		// The model name in the URL has been updated
		`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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
	// Check if response is in JSON format
	let content = text;
	try {
		const jsonResponse = JSON.parse(text);
		if (
			jsonResponse.candidates &&
			jsonResponse.candidates[0]?.content?.parts?.[0]?.text
		) {
			content = jsonResponse.candidates[0].content.parts[0].text;
		}
	} catch (e) {
		// Not JSON, use text as is
	}

	// Convert markdown to HTML with enhanced formatting
	const htmlContent = content
		// Handle horizontal rules
		.replace(/^---$/gm, '<hr class="my-4 border-gray-300">')
		// Handle headers
		.replace(
			/^# (.*?)$/gm,
			'<h1 class="text-3xl font-bold mt-8 mb-4 text-indigo-900">$1</h1>'
		)
		.replace(
			/^## (.*?)$/gm,
			'<h2 class="text-2xl font-bold mt-8 mb-4 text-indigo-900">$1</h2>'
		)
		.replace(
			/^### (.*?)$/gm,
			'<h3 class="text-xl font-bold mt-6 mb-3 text-indigo-800">$1</h3>'
		)
		// Handle lists (including dashed lists)
		.replace(/^\s*[-*] (.*?)$/gm, '<li class="ml-4 mb-2">$1</li>')
		.replace(/^\d+\. (.*?)$/gm, '<li class="ml-4 mb-2">$1</li>')
		// Handle task lists
		.replace(
			/^\s*- \[([ x])\] (.*?)$/gm,
			(match, checked, text) =>
				`<li class="ml-4 mb-2 flex items-center">
				<input type="checkbox" ${
					checked === "x" ? "checked" : ""
				} disabled class="mr-2">
				${text}
			</li>`
		)
		// Handle bold and italic
		.replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-900">$1</strong>')
		.replace(/\*(.*?)\*/g, '<em class="text-indigo-700">$1</em>')
		// Handle code blocks
		.replace(
			/`(.*?)`/g,
			'<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>'
		)
		// Handle paragraphs (but preserve list structure)
		.replace(/\n\n(?!<li)/g, '</p><p class="mb-4">')
		// Handle line breaks (but not within lists)
		.replace(/\n(?!<li|\[|<\/li>)/g, "<br>")
		// Wrap lists in ul/ol tags
		.replace(/(<li.*?>.*?<\/li>\s*)+/g, '<ul class="list-disc mb-4">$&</ul>');

	// Add final wrapper with styling
	resultDiv.innerHTML = `
        <div class="prompt-output text-gray-800 leading-relaxed">
            <p class="mb-4">${htmlContent}</p>
        </div>
    `;

	// Scroll to result
	resultDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
