const XMLNS = "http://www.w3.org/2000/svg";
const SVG_NS = "http://www.w3.org/2000/svg";

const ITEMS = {
    "i0": {
        "population": [3, 4, 6, 8, 3],
        "sample": [2, 2, 3, 4, 1],
        "populationRanking": [0, 0, 1, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 4, 3, 4, 3, 4, 3, 3, 3, 3, 3, 3],
        "sampleRanking": [0, 2, 2, 3, 4, 3, 2, 0, 1, 3, 3, 1],
    },
    "i1": {
        "population": [2, 5, 1, 8, 8],
        "sample": [2, 2, 1, 4, 3],
        "populationRanking": [0, 1, 2, 3, 4, 4, 3, 1, 1, 0, 3, 4, 3, 4, 3, 4, 1, 3, 1, 4, 3, 4, 3, 4],
        "sampleRanking": [0, 4, 4, 2, 3, 4, 3, 0, 1, 3, 3, 1],
    },
};

const COLORS = [
    "#f44336",
    "#2196f3",
    "#4caf50",
    "#ff9800",
    "#9c27b0",
];

const SVG_DEFS = `<defs>
<marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5"
    markerWidth="6" markerHeight="6"
    orient="auto-start-reverse">
<path d="M 0 0 L 10 5 L 0 10 z" />
</marker>
</defs>`;

const N_ITEMS = Object.keys(ITEMS).length;

let sampleCurrentPosition = 0;

function generateQuestion(knownPopulation, isRanked, isUserIn, isObserved) { // All boolean except for isRanked = {"population": Boolean, "sample": Boolean}.
    const statsContainer = document.getElementById("stats-container");
    const itemId = "i" + (Math.floor(N_ITEMS * Math.random()));
    const population = ITEMS[itemId]["population"];
    const sample = ITEMS[itemId]["sample"];
    const sampleRanking = ITEMS[itemId]["sampleRanking"];
    const populationRanking = ITEMS[itemId]["populationRanking"];
    const colors = shuffleList(COLORS); // Shuffle colors to avoid any correlations between groups and colors.
    let userClass;
    if (isRanked["population"] && isRanked["sample"]) {
		statsContainer.style.flexDirection = "column";
	}
	if (!isObserved) {
        if (isRanked["population"]) {
            drawRankedList(population, populationRanking, colors, "Population");
        } else {
            drawUnrankedSet(population, colors, "Population");
        }
		if (isRanked["sample"]) {
			drawRankedList([12], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ["#ffffff"], "Sample", "#808080");
		} else {
			drawUnrankedSet([12], ["#ffffff"], "Sample", "#808080");
		}
        addOnClickEvents("Sample", [12], addToSample);
        return;
	}
    if (isUserIn) {
        userClass = Math.floor(population.length * Math.random());
        addUserClass(colors[userClass]);
    }
    if (knownPopulation) {
        if (isRanked["population"]) {
            drawRankedList(population, populationRanking, colors, "Population");
        } else {
            drawUnrankedSet(population, colors, "Population");
        }
    }
	if (isRanked["sample"]){
		drawRankedList(sample, sampleRanking, colors, "Sample");
	} else {
		drawUnrankedSet(sample, colors, "Sample");
	}
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

function addOnClickEvents(label, distribution, eventHandler) { // TODO Revise this! (You were here)
	let element;
    console.log("addOnClickEvents", distribution);
	for (let i = 0; i < distribution.length; i++) {
		for (let j = 0; j < distribution[i]; j++) {
			element = document.getElementById(label + "-" + i + "-" + j);
            console.log(element.id);
            element.style.cursor = "pointer";
			element.addEventListener("onclick", eventHandler);
		}
	}
}

function addToSample(event) {
    const element = event.target;
    const currentSampleElement = document.getElementById("0-" + sampleCurrentPosition);
    currentSampleElement.style.fill = element.style.fill;
    sampleCurrentPosition++;
}

function addUserClass(classColor) {
    const statsContainer = document.getElementById("all-stats-container");
    const userClassContainer = document.createElement("div");
    const userClassText = document.createElement("div");
    const userClassBullet = document.createElement("div");
    userClassContainer.classList.add("user-class-container");
    userClassText.classList.add("user-class-text");
    userClassText.innerHTML = "Your class:";
    userClassBullet.classList.add("user-class-bullet");
    userClassBullet.style.background = classColor;
    // console.log(userClassBullet);
    userClassContainer.appendChild(userClassText);
    userClassContainer.appendChild(userClassBullet);
    statsContainer.prepend(userClassContainer);
}

function drawUnrankedSet(distribution, colors, label, borderColor="white") {
    const VIEWBOX_WIDTH = 200;
    const VIEWBOX_HEIGHT = 200;
    const statsContainer = document.getElementById("stats-container");
    const container = document.createElementNS(SVG_NS, "svg");
    container.setAttribute("xmlns", XMLNS);
    container.setAttribute("viewBox", "0 0 " + VIEWBOX_WIDTH + " " + VIEWBOX_HEIGHT);
    container.innerHTML = SVG_DEFS;
    const N = distribution.reduce((a, b) => a + b);
    const R = VIEWBOX_HEIGHT / 2;
    const r = 0.8 * R;
    const deltaTheta = 2 * Math.PI / N;
    const cx = VIEWBOX_WIDTH / 2;
    const cy = VIEWBOX_HEIGHT / 2;
    let particle, d, x1, x2, x3, x4, y1, y2, y3, y4, intArcParams, extArcParams, overallLabel, overallLabelText, count = 0;
    for (let i = 0; i < distribution.length; i++) {
        for (let j = 0; j < distribution[i]; j++) {
            // console.log("drawUnrankedSet", i, j);
            particle = document.createElementNS(SVG_NS, "path");
            particle.id = label + "-" + i + "-" + j;
            particle.style.stroke = borderColor;
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
    overallLabel = document.createElementNS(SVG_NS, "text");
    overallLabel.setAttribute("x", cx);
    overallLabel.setAttribute("y", cy);
    overallLabelText = document.createTextNode(label);
    overallLabel.appendChild(overallLabelText);
    overallLabel.setAttribute("font-size", "16");
    overallLabel.setAttribute("text-anchor", "middle");
    overallLabel.setAttribute("dominant-baseline", "middle");
    container.appendChild(overallLabel);
    statsContainer.appendChild(container);
}

function drawRankedList(distribution, ranking, colors, label, borderColor="white") {
    const VIEWBOX_WIDTH = 200;
    const VIEWBOX_HEIGHT = 100;
    const statsContainer = document.getElementById("stats-container");
    const container = document.createElementNS(SVG_NS, "svg");
    container.setAttribute("xmlns", XMLNS);
    container.setAttribute("viewBox", "0 0 " + VIEWBOX_WIDTH + " " + VIEWBOX_HEIGHT);
    container.innerHTML = SVG_DEFS;
	const N = distribution.reduce((a, b) => a + b);
    const HEIGHT = 0.24 * VIEWBOX_HEIGHT;
	const WIDTH = VIEWBOX_WIDTH / N;
	let rect, line, firstLabel, lastLabel, overallLabel, firstLabelText, lastLabelText, overallLabelText, currentX = 0, currentY = VIEWBOX_HEIGHT / 2 - HEIGHT / 2, lineY = VIEWBOX_HEIGHT / 2 - HEIGHT;
	for (let i = 0; i < distribution.length; i++) {
		for (j = 0; j < distribution[i]; j++) {
			rect = document.createElementNS(SVG_NS, "rect");
			rect.id = label + "-" + i + "-" + j;
			rect.style.stroke = borderColor;
			rect.style.strokeWidth = "0.4";
			rect.style.fill = colors[ranking[currentX]];
			rect.setAttribute("x", currentX * WIDTH);
			rect.setAttribute("y", currentY);
			rect.setAttribute("width", WIDTH);
			rect.setAttribute("height", HEIGHT);
			currentX++;
			container.appendChild(rect);
            console.log("drawRankedList", rect.id);
		}
	}
    line = document.createElementNS(SVG_NS, "polyline");
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
    overallLabel = document.createElementNS(SVG_NS, "text");
    overallLabel.setAttribute("x", 0.50 * VIEWBOX_WIDTH);
    overallLabel.setAttribute("y", VIEWBOX_HEIGHT / 2 + HEIGHT + 8);
    overallLabelText = document.createTextNode(label);
    overallLabel.appendChild(overallLabelText);
    overallLabel.setAttribute("font-size", "16");
    overallLabel.setAttribute("text-anchor", "middle");
    overallLabel.setAttribute("dominant-baseline", "middle");
    container.appendChild(line);
    container.appendChild(firstLabel);
    container.appendChild(lastLabel);
    container.appendChild(overallLabel);
    statsContainer.appendChild(container);

}

function initializeQuestions(n=20) {
    for (let i = 0; i < n; i++) {
        return;
    }
}

generateQuestion(true, {"population": true, "sample": true}, true, false);

/*
In terms of display, you have the following types of questions:
    1. Questions displaying both population and sample and ask for an estimation of diversity with a slider; (check)
    2. Questions displaying only the sample and ask for an estimation of diversity with a slider; (check)
    3. Questions displaying both population and sample as well as the user's class + a slider; (check)
    4. Questions displaying only the sample as well as the user's class + a slider; (check)
    5. Questions displaying only the population and asking the user to create a sample with given diversity;
    6. Questions displaying population as well as the user's class and asking them to create a sample with given diversity;
    7. Questions displaying only class colors and asking users to create a sample of a given diversity.
*/

// TODO Consider changing layout depending on variables' assignment (like, when we have at least one circle prefer a horizontal layout instead of a vertical one etc).
