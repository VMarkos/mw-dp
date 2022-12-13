function nextQuestion(previous, next) {
	// previous.style.scale = "0%";
	previous.classList.add("invisible");
	// previous.addEventListener("transitioned", () => {previous.classList.add("no-display")});
	setTimeout(() => {
		previous.classList.add("no-display");
		next.classList.remove("no-display");
		setTimeout(() => {
			next.classList.remove("invisible");
		}, 20);
	}, 500);
}

function proceedToNext() {
	if (canProceed) {
		let previous = document.getElementById("Q-" + answeredQuestions);
		let nextId;
		answeredQuestions++;
		if (studyStart) {
			answeredQuestions--;
			studyStart = false;
			previous = document.getElementById("Q-start");
			nextId = "Q-" + answeredQuestions;
			// console.log(nextId);
			canProceed = false;
		} else if (answeredQuestions === TOTAL_QUESTIONS) {
			nextId = "Q-end";
			RESPONSES["Q-" + (answeredQuestions - 1)] = {
				"response": (typeof currentResponse["response"] === "object") ? [...currentResponse["response"]] : parseInt(currentResponse["response"]),
			};
			chosenItems = {};
		} else {
			nextId = "Q-" + answeredQuestions;
			RESPONSES["Q-" + (answeredQuestions - 1)] = {
				"response": (typeof currentResponse["response"] === "object") ? [...currentResponse["response"]] : parseInt(currentResponse["response"]),
			};
			chosenItems = {};
		}
		const next = document.getElementById(nextId);
		nextQuestion(previous, next);
		initializeSamplePositions();
	}
}

function endStudy() {
	console.log("Responses:", RESPONSES);
	// window.location = "https://vmarkos.github.io/mw-dp/";
}