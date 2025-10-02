// Form validation utilities
const ValidationUtils = {
	// Show error with animation
	showError: function (element, message) {
		const errorId = `${element.id}-error`;
		let errorElement = document.getElementById(errorId);

		// Create error element if it doesn't exist
		if (!errorElement) {
			errorElement = document.createElement("div");
			errorElement.id = errorId;
			errorElement.className =
				"error-message text-red-500 text-sm mt-1 animate__animated animate__fadeIn";
			element.parentNode.appendChild(errorElement);
		}

		// Add error styling to input
		element.classList.add("border-red-500");

		// Set error message
		errorElement.textContent = message;
		errorElement.style.display = "block";

		// Shake the element to draw attention
		element.classList.add("animate__animated", "animate__shakeX");
		setTimeout(() => {
			element.classList.remove("animate__animated", "animate__shakeX");
		}, 1000);

		return false;
	},

	// Clear error
	clearError: function (element) {
		const errorId = `${element.id}-error`;
		const errorElement = document.getElementById(errorId);

		if (errorElement) {
			errorElement.style.display = "none";
		}

		element.classList.remove("border-red-500");
		return true;
	},

	// Validate input presence
	validateRequired: function (element, message = "This field is required") {
		if (!element.value.trim()) {
			return this.showError(element, message);
		}
		return this.clearError(element);
	},

	// Validate API key format
	validateApiKey: function (element) {
		const value = element.value.trim();

		if (!value) {
			return this.showError(element, "API key is required");
		}

		if (value.length < 10) {
			return this.showError(element, "API key seems too short");
		}

		return this.clearError(element);
	},

	// Validate form before submission
	validateForm: function () {
		let isValid = true;

		// Validate API key
		if (!this.validateApiKey(apiKeyInput)) {
			isValid = false;
		}

		// Validate task
		if (!this.validateRequired(taskInput, "Task description is required")) {
			isValid = false;
		}

		// Validate action
		if (!this.validateRequired(actionInput, "Specific goal is required")) {
			isValid = false;
		}

		return isValid;
	},
};

// Add event listeners for real-time validation
document.addEventListener("DOMContentLoaded", function () {
	// Validate on blur
	taskInput.addEventListener("blur", () =>
		ValidationUtils.validateRequired(taskInput)
	);
	actionInput.addEventListener("blur", () =>
		ValidationUtils.validateRequired(actionInput)
	);
	apiKeyInput.addEventListener("blur", () =>
		ValidationUtils.validateApiKey(apiKeyInput)
	);

	// Clear validation on focus
	const formElements = [taskInput, actionInput, apiKeyInput];
	formElements.forEach((element) => {
		element.addEventListener("focus", () =>
			ValidationUtils.clearError(element)
		);
	});

	// Update generate button to use validation
	generateButton.addEventListener("click", async function (e) {
		e.preventDefault();

		if (!ValidationUtils.validateForm()) {
			return; // Stop if validation fails
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
			const response = await callGeminiAPI(
				apiKeyInput.value.trim(),
				promptText
			);
			displayResult(response);
		} catch (error) {
			showError(error.message);
		} finally {
			disableAllFields(false);
		}
	});
});

