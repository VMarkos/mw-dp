let TASK_ID = 0;
let prevtime = 0;
let halfway = false;

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
    // console.log(canProceed);
	if (canProceed) {
        canProceed = false;
        let previous;
        if (halfway) {
            previous = document.getElementById("Q-intermediate");
        } else {
            previous = document.getElementById("Q-" + answeredQuestions);
        }
		let nextId;
		answeredQuestions++;
		if (studyStart) {
			answeredQuestions--;
			studyStart = false;
			previous = document.getElementById("Q-start");
			nextId = "Q-" + answeredQuestions;
			// console.log(nextId);
		} else if (answeredQuestions === TOTAL_QUESTIONS) {
			nextId = "Q-end";
			RESPONSES["Q-" + (answeredQuestions - 1)] = {
				"response": (typeof currentResponse["response"] === "object") ? [...currentResponse["response"]] : parseInt(currentResponse["response"]),
				"responseDuration": performance.now() - prevTime,
			};
			chosenItems = {};
            postResponse();
		} else if (!halfway && answeredQuestions === TOTAL_QUESTIONS / 2) {
            halfway = true;
            answeredQuestions--;
            nextId = "Q-intermediate";
            chosenItems = {};
            canProceed = true;
        } else {
            if (halfway) {
                halfway = false;
            }
			nextId = "Q-" + answeredQuestions;
			RESPONSES["Q-" + (answeredQuestions - 1)] = {
				"response": (typeof currentResponse["response"] === "object") ? [...currentResponse["response"]] : parseInt(currentResponse["response"]),
				"responseDuration": performance.now() - prevTime,
			};
			chosenItems = {};
		}
		const next = document.getElementById(nextId);
        // if (next) {
        //     // console.log(previous, next);
        // }
		nextQuestion(previous, next);
		initializeSamplePositions();
	}
}

// function endStudy() {
// 	const resp = {
// 		conditionsPair: CONDITIONS_PAIR,
// 		taskId: TASK_ID,
// 		colors: qColors,
// 		response: RESPONSES,
// 	}
// 	// console.log("Responses:", RESPONSES);
// 	download("responses.json", JSON.stringify(resp, null, 2)); // FIXME Do not indent in the actual implementation.
// 	// window.location = "https://vmarkos.github.io/mw-dp/";
// }

// TEMP Stuff for debugging

function download(filename, content) {
    let element = document.createElement("a");
    element.setAttribute("href", "data:application/zip;base64," + content);
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}