function animateProgressBar() {
	const leftBar = document.getElementById("progress-bar-left");
	const rightBar = document.getElementById("progress-bar-right");
	leftBar.style.width = "80%";
	rightBar.style.width = "20%";	
}

function nextQuestion() {
	const previous = document.getElementById("qa");
	const next = document.getElementById("qb");
	previous.style.scale = "0%";
	setTimeout(() => {
		previous.classList.add("no-display");
		next.classList.remove("no-display");
		next.offsetHeight;
		next.style.scale = "100%";
	}, 500);
}

function proceedToNext() {
	nextQuestion();
}
