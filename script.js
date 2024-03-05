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
	];

	return getRandomPrompt(templates, additionalDetails);
};

const getRandomPrompt = (templates, additionalDetails) => {
	const randomIndex = Math.floor(Math.random() * templates.length);
	let prompt = templates[randomIndex];

	if (additionalDetails) {
		prompt += `\n\nAdditional Details:\n${additionalDetails}`;
	}

	return prompt;
};

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

	const acknowledgmentElement = document.getElementById("copy-acknowledgment");

	if (customPromptResult.trim() !== "") {
		navigator.clipboard
			.writeText(customPromptResult)
			.then(() => {
				acknowledgmentElement.textContent = "Prompt copied to clipboard!";
				acknowledgmentElement.classList.remove("text-red-400");
				acknowledgmentElement.classList.add("text-green-500");
				setTimeout(() => {
					acknowledgmentElement.textContent = "";
				}, 3000);
			})
			.catch((err) => {
				acknowledgmentElement.textContent = "Unable to Copy";
				acknowledgmentElement.classList.remove("text-green-500");
				acknowledgmentElement.classList.add("text-red-400");
				setTimeout(() => {
					acknowledgmentElement.textContent = "";
				}, 3000);
			});
	} else {
		acknowledgmentElement.textContent = "Cannot copy an empty prompt!";
		acknowledgmentElement.classList.remove("text-green-500");
		acknowledgmentElement.classList.add("text-red-400");
		setTimeout(() => {
			acknowledgmentElement.textContent = "";
		}, 3000);
	}
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

	languageDropdown.innerHTML = "";

	switch (category) {
		case "website":
			addLanguageOptions(["HTML", "Tailwind", "BootStrap"]);
			break;
		case "function":
			addLanguageOptions([
				"JavaScript",
				"Python",
				"Java",
				"Ruby",
				"Swift",
				"C#",
			]);
			break;
		case "database":
			addLanguageOptions(["MongoDB", "MySQL"]);
			break;
		default:
			break;
	}
};

const addLanguageOptions = (languages) => {
	const languageDropdown = document.getElementById("language");
	languages.forEach((language) => {
		const option = document.createElement("option");
		option.value = language;
		option.text = language;
		languageDropdown.add(option);
	});
};

document
	.getElementById("category")
	.addEventListener("change", updateLanguageOptions);

document.addEventListener("DOMContentLoaded", function () {
	var categorySelect = document.getElementById("category");

	var taskInput = document.getElementById("task");

	var placeholders = {
		website: "Eg. Create a landing page",
		function: "Eg. API Call",
		database: "Eg. Design a user authentication system",
	};

	function updatePlaceholder() {
		var selectedCategory = categorySelect.value;
		taskInput.placeholder = placeholders[selectedCategory] || "";
	}

	categorySelect.addEventListener("change", updatePlaceholder);

	updatePlaceholder();
});
