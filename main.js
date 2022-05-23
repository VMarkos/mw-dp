function animateProgressBar() {
	const leftBar = document.getElementById("progress-bar-left");
	const rightBar = document.getElementById("progress-bar-right");
	leftBar.style.width = "80%";
	rightBar.style.width = "20%";	
}

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

function proceedToNext(id1, id2) {
	const previous = document.getElementById(id1);
	const next = document.getElementById(id2);
	nextQuestion(previous, next);
}