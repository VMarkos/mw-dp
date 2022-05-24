SVG_NS = "http://www.w3.org/2000/svg";
const VIEWBOX_WIDTH = 200;
const VIEWBOX_HEIGHT = 200;
const radToDeg = 180 / Math.PI;

ITEMS = {
    "i0": {
        "population": [3, 4, 6, 8, 3],
        "sample": [2, 2, 3, 4, 1],
        "populationRanking": undefined,
        "sampleRanking": [0, 2, 2, 3, 4, 3, 2, 0, 1, 3, 3, 1],
    },
    "i1": {
        "population": [2, 5, 1, 8, 8],
        "sample": [2, 2, 1, 4, 3],
        "populationRanking": undefined,
        "sampleRanking": [0, 4, 4, 2, 3, 4, 3, 0, 1, 3, 3, 1],
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
    const populationContainer = document.getElementById("population");
    const itemId = "i" + (Math.floor(N_ITEMS * Math.random()));
    const population = ITEMS[itemId]["population"];
    const sample = ITEMS[itemId]["sample"];
    const sampleRanking = ITEMS[itemId]["sampleRanking"];
    const colors = shuffleList(COLORS); // Shuffle colors to avoid any correlations between groups and colors.
    drawRankedList(sample, sampleRanking, colors, sampleContainer);
    drawUnrankedSet(population, colors, populationContainer);
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

function drawUnrankedSet(distribution, colors, container) {
    const N = distribution.reduce((a, b) => a + b);
    const R = VIEWBOX_HEIGHT / 2;
    const r = 0.8 * R;
    const deltaTheta = 2 * Math.PI / N;
    const cx = VIEWBOX_WIDTH / 2;
    const cy = VIEWBOX_HEIGHT / 2;
    let particle, d, x1, x2, x3, x4, y1, y2, y3, y4, intArcParams, extArcParams, count = 0;
    for (let i = 0; i < distribution.length; i++) {
        for (let j = 0; j < distribution[i]; j++) {
            particle = document.createElementNS(SVG_NS, "path");
            particle.style.stroke = "white";
            particle.style.strokeWidth = "0.4";
            particle.style.fill = colors[i];
            x1 = cx + r * Math.cos(count * deltaTheta);
            y1 = cy + r * Math.sin(count * deltaTheta);
            x2 = cx + R * Math.cos(count * deltaTheta);
            y2 = cy + R * Math.sin(count * deltaTheta);
            x3 = cx + R * Math.cos((count + 1) * deltaTheta);
            y3 = cy + R * Math.sin((count + 1) * deltaTheta);
            x4 = cx + r * Math.cos((count + 1) * deltaTheta);
            y4 = cy + r * Math.sin((count + 1) * deltaTheta);
            extArcParams = R + " " + R + " 0 0 1";
            intArcParams = r + " " + r + " 0 0 0";
            d = "M " + x1 + " " + y1 + " L " + x2 + " " + y2 + " A " + extArcParams + " " + x3 + " " + y3 + " L " + x4 + " " + y4 + " A " + intArcParams + " " + x1 + " " + y1;
            particle.setAttribute("d", d);
            container.appendChild(particle);
            count++;
        }
    }
}

function drawRankedList(distribution, ranking, colors, container) {
	const N = distribution.reduce((a, b) => a + b);
    const HEIGHT = 0.12 * VIEWBOX_HEIGHT;
	const WIDTH = VIEWBOX_WIDTH / N;
	let rect, line, firstLabel, lastLabel, firstLabelText, lastLabelText, currentX = 0, currentY = VIEWBOX_HEIGHT / 2 - HEIGHT / 2, lineY = VIEWBOX_HEIGHT / 2 - HEIGHT;
	for (let i = 0; i < distribution.length; i++) {
		for (j = 0; j < distribution[i]; j++) {
			rect = document.createElementNS(SVG_NS, "rect");
			rect.style.stroke = "white";
			rect.style.strokeWidth = "0.4";
			rect.style.fill = colors[ranking[currentX]];
			rect.setAttribute("x", currentX * WIDTH);
			rect.setAttribute("y", currentY);
			rect.setAttribute("width", WIDTH);
			rect.setAttribute("height", HEIGHT);
			currentX++;
			line = document.createElementNS(SVG_NS, "polyline"); // TODO Polyline (marker-end)
			line.style.stroke = "black";
			line.style.strokeWidth = "0.5";
			line.setAttribute("marker-end", "url(#arrow)");
			line.setAttribute("points", "0," + lineY + " " + (0.98 * VIEWBOX_WIDTH) + "," + lineY);
            firstLabel = document.createElementNS(SVG_NS, "text");
            firstLabel.setAttribute("x", 0);
            firstLabel.setAttribute("y", lineY - 4);
            firstLabelText = document.createTextNode("first");
            firstLabel.appendChild(firstLabelText);
            firstLabel.setAttribute("font-size", "12");
            lastLabel = document.createElementNS(SVG_NS, "text");
            lastLabel.setAttribute("x", 0.98 * VIEWBOX_WIDTH);
            lastLabel.setAttribute("y", lineY - 4);
            lastLabelText = document.createTextNode("last");
            lastLabel.setAttribute("text-anchor", "end");
            lastLabel.appendChild(lastLabelText);
            lastLabel.setAttribute("font-size", "12");
			container.appendChild(rect);
			container.appendChild(line);
            container.appendChild(firstLabel);
            container.appendChild(lastLabel);
		}
	}
}

generateQuestion(true, {"population": true, "sample": true}, true, true);
