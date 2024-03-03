const generateCustomPrompt = () => {
	const language = document.getElementById("language").value;
	const category = document.getElementById("category").value;
	const task = document.getElementById("task").value;
	const action = document.getElementById("action").value;
	const additionalDetails = document.getElementById("additional-details").value;

	if (language && category && task && action) {
		let prompt;

		switch (category) {
			case "website":
				prompt = generateWebsitePrompt(
					language,
					task,
					action,
					additionalDetails
				);
				break;
			case "function":
				prompt = generateFunctionPrompt(
					language,
					task,
					action,
					additionalDetails
				);
				break;
			case "database":
				prompt = generateDatabasePrompt(
					language,
					task,
					action,
					additionalDetails
				);
				break;
			// Add more cases for other categories as needed
			default:
				return "Invalid category";
		}

		return prompt;
	} else {
		return "Please fill in all required fields.";
	}
};

const generateWebsitePrompt = (language, task, action, additionalDetails) => {
	const templates = [
		`Create a ${language} website that ${task}. Make sure the website ${action}.`,
		`Design a responsive ${language} website to ${task}. Ensure smooth ${action}.`,
		`Implement a ${language} web application that ${task}. Pay attention to ${action}.`,
		// Add more website prompts
	];

	return getRandomPrompt(templates, additionalDetails);
};

const generateFunctionPrompt = (language, task, action, additionalDetails) => {
	const templates = [
		`Write a ${language} function to ${task}. Ensure that the function ${action}.`,
		`Implement a ${language} function that ${task}. Focus on ${action}.`,
		`Develop a ${language} module with a function to ${task}. Make sure ${action}.`,
		`Create a reusable ${language} function for ${task}. Pay attention to ${action} and code readability.`,
		`Build a ${language} function that performs ${task}. Consider ${action} and error handling.`,
		// Add more function prompts as needed
	];

	return getRandomPrompt(templates, additionalDetails);
};

const generateDatabasePrompt = (language, task, action, additionalDetails) => {
	const templates = [
		`Design a ${language} database schema for a ${task} application. Ensure it supports ${action}.`,
		`Create a normalized ${language} database schema for ${task}. Pay attention to ${action} and data integrity.`,
		`Develop a scalable ${language} database schema for ${task}. Consider ${action} and future expansion.`,
		`Implement a relational ${language} database schema to support ${task}. Focus on optimizing ${action}.`,
		`Design an efficient ${language} database schema for ${task}. Ensure it can handle ${action} gracefully.`,
		// Add more database schema prompts as needed
	];

	return getRandomPrompt(templates, additionalDetails);
};

// Helper function to get a random prompt from the provided array
const getRandomPrompt = (templates, additionalDetails) => {
	const randomIndex = Math.floor(Math.random() * templates.length);
	let prompt = templates[randomIndex];

	if (additionalDetails) {
		prompt += `\n\nAdditional Details:\n${additionalDetails}`;
	}

	return prompt;
};

// Event listener for the "Generate" button
document
	.getElementById("generate-custom-prompt")
	.addEventListener("click", () => {
		const customPromptResult = generateCustomPrompt();
		document.getElementById("custom-prompt-result").textContent =
			customPromptResult;
	});

document.getElementById("copy-to-clipboard").addEventListener("click", () => {
	const customPromptResult = document.getElementById(
		"custom-prompt-result"
	).textContent;
	navigator.clipboard
		.writeText(customPromptResult)
		.then(() => alert("Prompt copied to clipboard!"))
		.catch((err) => console.error("Unable to copy to clipboard", err));
});

document.getElementById("clear-fields").addEventListener("click", () => {
	document.getElementById("task").value = "";
	document.getElementById("action").value = "";
	document.getElementById("additional-details").value = "";
	document.getElementById("custom-prompt-result").textContent = "";
});

const updateLanguageOptions = () => {
	const category = document.getElementById("category").value;
	const languageDropdown = document.getElementById("language");

	// Clear existing options
	languageDropdown.innerHTML = "";

	// Set language options based on the selected category
	switch (category) {
		case "website":
			addLanguageOptions(["HTML", "Tailwind", "BootStrap"]);
			break;
		case "function":
			addLanguageOptions(["JavaScript", "Python", "Java"]);
			break;
		case "database":
			addLanguageOptions(["MongoDB", "MySQL"]);
			break;
		default:
			break;
	}
};

// Helper function to add language options to the language dropdown
const addLanguageOptions = (languages) => {
	const languageDropdown = document.getElementById("language");
	languages.forEach((language) => {
		const option = document.createElement("option");
		option.value = language;
		option.text = language;
		languageDropdown.add(option);
	});
};

// Event listener for category change
document
	.getElementById("category")
	.addEventListener("change", updateLanguageOptions);

document.addEventListener("DOMContentLoaded", function () {
	// Get the select element for the category
	var categorySelect = document.getElementById("category");

	// Get the input element for the task
	var taskInput = document.getElementById("task");

	// Define placeholder options based on categories
	var placeholders = {
		website: "Eg. Create a landing page",
		function: "Eg. API Call",
		database: "Eg. Design a user authentication system",
	};

	// Function to update the task input placeholder based on the selected category
	function updatePlaceholder() {
		var selectedCategory = categorySelect.value;
		taskInput.placeholder = placeholders[selectedCategory] || "";
	}

	// Add an event listener to the category select to update the placeholder on change
	categorySelect.addEventListener("change", updatePlaceholder);

	// Call the function initially to set the initial placeholder
	updatePlaceholder();
});
