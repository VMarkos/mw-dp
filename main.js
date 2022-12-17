let TASK_ID = 123;
let prevtime = 0;

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
		prevTime = performance.now();
	}, 400);
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
				"colors": qColors,
				"response": (typeof currentResponse["response"] === "object") ? [...currentResponse["response"]] : parseInt(currentResponse["response"]),
				"responseDuration": performance.now() - prevTime,
			};
			chosenItems = {};
		} else {
			nextId = "Q-" + answeredQuestions;
			RESPONSES["Q-" + (answeredQuestions - 1)] = {
				"colors": qColors,
				"response": (typeof currentResponse["response"] === "object") ? [...currentResponse["response"]] : parseInt(currentResponse["response"]),
				"responseDuration": performance.now() - prevTime,
			};
			chosenItems = {};
		}
		const next = document.getElementById(nextId);
		nextQuestion(previous, next);
		initializeSamplePositions();
	}
}

function endStudy() {
	const resp = {
		taskId: TASK_ID,
		response: RESPONSES,
	}
	// console.log("Responses:", RESPONSES);
	download("responses.json", JSON.stringify(resp, null, 2)); // FIXME Do not indent in the actual implementation.
	// window.location = "https://vmarkos.github.io/mw-dp/";
}

// TEMP Stuff for debugging

function download(filename, content) {
    let element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}