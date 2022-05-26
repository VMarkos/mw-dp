const XMLNS = "http://www.w3.org/2000/svg";
const SVG_NS = "http://www.w3.org/2000/svg";
const SAMPLE_SIZE = 12;
const TOTAL_QUESTIONS = 1;

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

const DIVERSITY_SLIDER = `<div class="diversity-slider-labels-container">
<div>Low</div>
<div>High</div>
</div>
<input type="range" id="diversity" min="0" max="100" value="50">`;

const chosenItems = {} // Maps sample entries ids to population ids.

const N_ITEMS = Object.keys(ITEMS).length;

const samplePositions = new Array(SAMPLE_SIZE);
for (let i = 0; i < SAMPLE_SIZE; i++) {
    samplePositions[i] = false;
}

let answeredQuestions = 0;

function generateQuestion(knownPopulation, isRanked, isUserIn, isObserved) { // All boolean except for isRanked = {"population": Boolean, "sample": Boolean}.
    console.log("here");
    const statsContainer = document.getElementById("stats-container");
    const questionTextP = document.getElementById("question-text");
    const itemId = "i" + (Math.floor(N_ITEMS * Math.random()));
    const population = ITEMS[itemId]["population"];
    const sample = ITEMS[itemId]["sample"];
    const sampleRanking = ITEMS[itemId]["sampleRanking"];
    const populationRanking = ITEMS[itemId]["populationRanking"];
    const colors = shuffleList(COLORS); // Shuffle colors to avoid any correlations between groups and colors.
    let userClass, questionText, targetDiversity = 75;
    let bothRanked = false;
    if (isRanked["population"] && isRanked["sample"]) {
		statsContainer.classList.remove("stats-container-grid");
        statsContainer.classList.add("stats-container-flex");
        bothRanked = true;
	}
	if (!isObserved) {
        if (isUserIn) {
            questionText = "Assume you belong to the class shown below. ";
            userClass = Math.floor(population.length * Math.random());
            addUserClass(colors[userClass]);
        }
        questionText += `Construct a${isRanked["sample"] ? " <b>ranked</b>" : "n <b>unranked</b>"} sample which is ${targetDiversity}% diverse given the ${isRanked["population"] ? "<b>ranked</b>" : "<b>unranked</b>"} population shown left.`
        questionTextP.innerHTML = questionText;
        if (isRanked["population"]) {
            drawRankedList(population, populationRanking, colors, "Population");
        } else {
            drawUnrankedSet(population, colors, "Population");
        }
		if (isRanked["sample"]) {
			drawRankedList([SAMPLE_SIZE], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ["#ffffff"], "Sample", "#808080");
		} else {
			drawUnrankedSet([SAMPLE_SIZE], ["#ffffff"], "Sample", "#808080");
		}
        addOnClickEvents("Sample", population, addToSample);
        return;
	}
    addDiversitySlider();
    if (isUserIn) {
        questionText = "Assume you belong to the class shown below. ";
        userClass = Math.floor(population.length * Math.random());
        addUserClass(colors[userClass]);
    }
    questionText += `How diverse would you consider the following ${isRanked["sample"] ? "<b>ranked</b>" : "<b>unranked</b>"} sample${knownPopulation ? ` ${bothRanked ? "(bottom)" : "(right)"} and drawn from the ${isRanked["population"] ? "<b>ranked</b>" : "<b>unranked</b>"} population ${bothRanked ? "(top)" : "(left)"}` : ""}?`;
    questionTextP.innerHTML = questionText;
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

function addDiversitySlider() {
    const currentQuestion = document.getElementById("q-" + answeredQuestions);
    const diversitySlideContainer = document.createElement("div");
    const submitButton = document.getElementById("submit-button");
    diversitySlideContainer.classList.add("diversity-slider-container");
    diversitySlideContainer.innerHTML = DIVERSITY_SLIDER;
    currentQuestion.insertBefore(diversitySlideContainer, submitButton);
}

function addOnClickEvents(label, distribution, eventHandler) { // TODO Revise this! (You were here)
	let element;
    // console.log("addOnClickEvents", distribution);
	for (let i = 0; i < distribution.length; i++) {
		for (let j = 0; j < distribution[i]; j++) {
			element = document.getElementById("Population" + "-" + i + "-" + j);
            // console.log(element.id, eventHandler);
            element.style.cursor = "pointer";
			element.addEventListener("mouseup", eventHandler);
			element.setAttribute("data-listener", true);
		}
	}
}

function getMinEmptyPosition() {
    let i = 0;
    while (i < SAMPLE_SIZE && samplePositions[i]) {
        i++;
    }
    return i;
}

function addToSample(event) { // TODO Consider adding a number on top of each element in case the generated sample is ranked.
    const element = event.target;
    let minEmptyPosition = getMinEmptyPosition();
    const sampleId = "Sample-0-" + minEmptyPosition;
    const currentSampleElement = document.getElementById(sampleId);
    let hasListener;
    // console.log(element, currentSampleElement);
    currentSampleElement.style.fill = element.style.fill;
    currentSampleElement.style.stroke = "white";
    element.style.fillOpacity = "0.5";
    element.removeEventListener("mouseup", addToSample);
    element.setAttribute("data-listener", false);
    element.style.cursor = "auto";
    chosenItems[sampleId] = element.id;
    samplePositions[minEmptyPosition] = true;
    currentSampleElement.style.cursor = "pointer";
    currentSampleElement.addEventListener("mouseup", removeFromSample);
    minEmptyPosition = getMinEmptyPosition();
    if (minEmptyPosition === SAMPLE_SIZE) {
		const allPopulationElements = document.querySelectorAll("[id^='Population-']");
		for (const populationElement of allPopulationElements) {
            hasListener = populationElement.getAttribute("data-listener") === "true";
			if (hasListener) {
				populationElement.removeEventListener("mouseup", addToSample);
                populationElement.setAttribute("data-listener", false);
                populationElement.style.cursor = "auto";
			}
		}
	}
}

function removeFromSample(event) {
    const sampleElement = event.target;
    const populationElement = document.getElementById(chosenItems[sampleElement.id]);
    const position = parseInt(sampleElement.id.substring(9, sampleElement.id.length));
    let justEmptied = getMinEmptyPosition() === SAMPLE_SIZE;
    let hasListener;
    sampleElement.style.cursor = "auto";
    sampleElement.style.fill = "#ffffff";
    sampleElement.style.stroke = "#808080";
    sampleElement.removeEventListener("mouseup", removeFromSample);
    populationElement.style.cursor = "pointer";
    populationElement.style.fillOpacity = "1.0";
    populationElement.addEventListener("mouseup", addToSample);
    populationElement.setAttribute("data-listener", true);
    delete chosenItems[sampleElement.id];
    samplePositions[position] = false;
    minEmptyPosition = getMinEmptyPosition();
    if (justEmptied) {
        const allPopulationElements = document.querySelectorAll("[id^='Population-'");
        for (const popElement of allPopulationElements) {
            hasListener = Object.values(chosenItems).includes(popElement.id);
			if (!hasListener) {
				popElement.addEventListener("mouseup", addToSample);
                popElement.setAttribute("data-listener", true);
                popElement.style.cursor = "pointer";
			}
        }
    }
}

function addUserClass(classColor) {
    const statsContainer = document.getElementById("all-stats-container");
    // console.log(statsContainer);
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
            // console.log("drawRankedList", rect.id);
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

function drawProgressCircle() {
	const progress = parseInt(100 * answeredQuestions / TOTAL_QUESTIONS);
	const progressContainer = document.getElementById("progress-circle");
	const container = document.createElementNS(SVG_NS, "svg");
	container.setAttribute("xmlns", XMLNS);
    container.setAttribute("viewBox", "0 0 100 100");
    const progressCircle = document.createElementNS(SVG_NS, "path");
    const cx = 50, cy = 50, R = 46, deltaTheta = 2 * Math.PI / TOTAL_QUESTIONS, phi = - Math.PI / 2;
    const xEnd = cx + R * Math.cos(answeredQuestions * deltaTheta + phi);
    const yEnd = cy + R * Math.sin(answeredQuestions * deltaTheta + phi);
    let largeArc = 0;
    if (answeredQuestions > TOTAL_QUESTIONS / 2) {
		largeArc = 1;
	}
    const d = "M " + cx + " 4 A " + R + " " + R + " 0 " + largeArc + " 1 " + xEnd + " " + yEnd;
    progressCircle.setAttribute("d", d);
    progressCircle.style.stroke = "rgb(33, 85, 205)";
    progressCircle.style.strokeWidth = "8";
    progressCircle.style.fill = "none";
    const progressLabel = document.createElementNS(SVG_NS, "text");
    progressLabel.setAttribute("x", cx);
    progressLabel.setAttribute("y", cy);
    const progressLabelText = document.createTextNode(progress + "%");
    progressLabel.setAttribute("text-anchor", "middle");
    progressLabel.setAttribute("dominant-baseline", "middle");
    progressLabel.appendChild(progressLabelText);
    progressLabel.setAttribute("font-size", "32");
    container.appendChild(progressLabel);
    container.appendChild(progressCircle);
    progressContainer.appendChild(container);
}

function initializeQuestions() {
	let nextQuestion;
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
		nextQuestion = document.createElement("div");
		nextQuestion.id = "Q-" + i;
		nextQuestion.classList.add("question-row-container");
		nextQuestion.innerHTML = `<div id="q-${i}" class="question-container">
				<div class="question-header-container">
					<h2>Question</h2>
					<div id="progress-circle" class="progress-circle"></div>
				</div>
				<p id="question-text"></p>
				<div id="stats-border" class="stats-border">
					<div id="all-stats-container" class="all-stats-container">
						<div id="stats-container" class="stats-container-grid">
						</div>
					</div>
				</div>
				<div id="submit-button" class="submit-button-container" onclick="proceedToNext()">
					Next
				</div>
			</div>`;
		document.body.appendChild(nextQuestion);
		// console.log(document.body.innerHTML);
		setTimeout(() => {generateQuestion(true, {"population": false, "sample": true}, true, true);}, 1000);
		drawProgressCircle();
    }
}

window.addEventListener("load", function() {initializeQuestions();});

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
