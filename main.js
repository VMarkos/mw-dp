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
	const previous = document.getElementById("Q-" + answeredQuestions);
	answeredQuestions++;
	let nextId;
	if (answeredQuestions === TOTAL_QUESTIONS) {
		nextId = "Q-end";
	} else {
		nextId = "Q-" + answeredQuestions;
	}
	const next = document.getElementById(nextId);
	nextQuestion(previous, next);
	initializeSamplePositions();
}

function endStudy() {
	window.location = "https://vmarkos.github.io/mw-dp/";
}