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
	const next = document.getElementById("Q-" + answeredQuestions);
	nextQuestion(previous, next);
	initializeSamplePositions();
}
