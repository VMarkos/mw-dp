ITEMS = {
    "i0": {
        "population": [3, 4, 6, 8, 3],
        "sample": [2, 2, 3, 4, 1],
        "populationRanking": undefined,
        "sampleRanking": [0, 2, 2, 3, 4, 3, 2, 0, 1, 3, 3, 1],
    },
    "i1": {
        "population": [2, 5, 1, 8, 8],
        "sample": [2, 2, 4, 1, 3],
        "populationRanking": undefined,
        "sampleRanking": [0, 4, 4, 3, 2, 4, 2, 0, 1, 2, 2, 1],
    },
};

COLORS = [
    "#f44336",
    "#2196f3",
    "#4caf50",
    "#ff9800",
    "#9c27b0",
];

const N_ITEMS = Object.keys(ITEMS).length;

function generateQuestion(knownPopulation, isRanked, isUserIn, isObserved) { // All boolean except for isRanked = {"population": Boolean, "sample": Boolean}.
	const sampleContainer = document.getElementById("sample");
    const itemId = "i" + (Math.floor(N_ITEMS * Math.random()));
    const population = ITEMS[itemId]["population"];
    const sample = ITEMS[itemId]["sample"];
    const sampleRanking = ITEMS[itemId]["sampleRanking"];
    const colors = shuffleList(COLORS); // Shuffle colors to avoid any correlations between groups and colors.
    drawRankedList(sample, sampleRanking, colors, sampleContainer);
}

function shuffleList(x) { // Fischer-Yates shuffling algorithm.
    const shuffled = [...x]; // SHALLOW Copy, only for arrays of primitives.
    let j, temp;
    for (let i = x.length - 1; i > 0; i--) {
        j = Math.floor((i + 1) * Math.random());
        temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
    }
    return shuffled;
}

function drawRankedList(distribution, ranking, colors, container) {
	const N = distribution.reduce((a, b) => a + b);
	const HEIGHT = 12;
	const WIDTH = 100 / N;
	let rect, line, currentX = 0, currentY = 50 - HEIGHT / 2, lineY = 50 - HEIGHT;
	for (let i = 0; i < distribution.length; i++) {
		for (j = 0; j < distribution[i]; j++) {
			rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
			rect.style.stroke = "white";
			rect.style.strokeWidth = "0.4";
			rect.style.fill = colors[ranking[currentX]];
			rect.setAttribute("x", currentX * WIDTH);
			rect.setAttribute("y", currentY);
			rect.setAttribute("width", WIDTH);
			rect.setAttribute("height", HEIGHT);
			currentX++;
			line = document.createElementNS("http://www.w3.org/2000/svg", "line"); // TODO Polyline (marker-end)
			line.style.stroke = "black";
			line.style.strokeWidth = "0.5";
			line.markerEnd = "url(#arrow)";
			line.setAttribute("x1", "0");
			line.setAttribute("y1", lineY);
			line.setAttribute("x2", "50");
			line.setAttribute("y2", lineY);
			container.appendChild(rect);
			container.appendChild(line);
		}
	}
}

generateQuestion(true, {"population": true, "sample": true}, true, true);
