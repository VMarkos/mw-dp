const XMLNS = "http://www.w3.org/2000/svg";
const SVG_NS = "http://www.w3.org/2000/svg";
const SAMPLE_SIZE = 12;
const TOTAL_QUESTIONS = 20;

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

let answeredQuestions = 0;

function initializeSamplePositions() {
    for (let i = 0; i < SAMPLE_SIZE; i++) {
        samplePositions[i] = false;
    }
}

function generateQuestion(questionId, knownPopulation, isRanked, isUserIn, isObserved) { // All boolean except for isRanked = {"population": Boolean, "sample": Boolean}.
    // console.log("here", questionId);
    const statsContainer = document.getElementById(questionId + "-stats-container");
    const questionTextP = document.getElementById(questionId + "-question-text");
    const itemId = "i" + (Math.floor(N_ITEMS * Math.random()));
    const population = ITEMS[itemId]["population"];
    const sample = ITEMS[itemId]["sample"];
    const sampleRanking = ITEMS[itemId]["sampleRanking"];
    const populationRanking = ITEMS[itemId]["populationRanking"];
    const colors = shuffleList(COLORS); // Shuffle colors to avoid any correlations between groups and colors.
    let userClass, questionText = "", targetDiversity = 75;
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
            addUserClass(questionId, colors[userClass]);
        }
        questionText += `Construct a${isRanked["sample"] ? " <b>ranked</b>" : "n <b>unranked</b>"} sample which is ${targetDiversity}% diverse given the ${isRanked["population"] ? "<b>ranked</b>" : "<b>unranked</b>"} population shown left.`
        questionTextP.innerHTML = questionText;
        if (isRanked["population"]) {
            drawRankedList(questionId, population, populationRanking, colors, "Population");
        } else {
            drawUnrankedSet(questionId, population, colors, "Population");
        }
		if (isRanked["sample"]) {
			drawRankedList(questionId, [SAMPLE_SIZE], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ["#ffffff"], "Sample", "#808080");
		} else {
			drawUnrankedSet(questionId, [SAMPLE_SIZE], ["#ffffff"], "Sample", "#808080");
		}
        addOnClickEvents(questionId, population, addToSample);
        return;
	}
    addDiversitySlider(questionId);
    if (isUserIn) {
        questionText = "Assume you belong to the class shown below. ";
        userClass = Math.floor(population.length * Math.random());
        addUserClass(questionId, colors[userClass]);
    }
    questionText += `How diverse would you consider the following ${isRanked["sample"] ? "<b>ranked</b>" : "<b>unranked</b>"} sample${knownPopulation ? ` ${bothRanked ? "(bottom)" : "(right)"} and drawn from the ${isRanked["population"] ? "<b>ranked</b>" : "<b>unranked</b>"} population ${bothRanked ? "(top)" : "(left)"}` : ""}?`;
    questionTextP.innerHTML = questionText;
    if (knownPopulation) {
        if (isRanked["population"]) {
            drawRankedList(questionId, population, populationRanking, colors, "Population");
        } else {
            drawUnrankedSet(questionId, population, colors, "Population");
        }
    }
	if (isRanked["sample"]){
		drawRankedList(questionId, sample, sampleRanking, colors, "Sample");
	} else {
		drawUnrankedSet(questionId, sample, colors, "Sample");
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

function addDiversitySlider(questionId) {
    const currentQuestion = document.getElementById(questionId + "-question-container");
    // console.log(questionId);
    const diversitySlideContainer = document.createElement("div");
    const submitButton = document.getElementById(questionId + "-submit-button");
    diversitySlideContainer.classList.add("diversity-slider-container");
    diversitySlideContainer.innerHTML = DIVERSITY_SLIDER;
    currentQuestion.insertBefore(diversitySlideContainer, submitButton);
}

function addOnClickEvents(questionId, distribution, eventHandler) { // TODO Revise this! (You were here)
	let element;
    // console.log("addOnClickEvents", distribution);
	for (let i = 0; i < distribution.length; i++) {
		for (let j = 0; j < distribution[i]; j++) {
			element = document.getElementById(questionId + "-Population" + "-" + i + "-" + j);
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
    // console.log(minEmptyPosition);
    const sampleIdPrefix = "Q-" + answeredQuestions;
    const sampleId = sampleIdPrefix + "-Sample-0-" + minEmptyPosition;
    const currentSampleElement = document.getElementById(sampleId);
    let hasListener, populationPrefix = sampleIdPrefix + "-Population-";
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
    // console.log(populationPrefix);
    if (minEmptyPosition === SAMPLE_SIZE) {
		const allPopulationElements = document.querySelectorAll("[id^='" + populationPrefix + "']");
		for (const populationElement of allPopulationElements) {
            // if (!populationElement.id.includes("Population")) {
            //     continue;
            // }
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
    const splitPopPrefix = sampleElement.id.split("-").filter(Boolean);
    const populationPrefix = splitPopPrefix[0] + "-" + splitPopPrefix[1] + "-Population-";
    const position = parseInt(sampleElement.id.split(/Q-\d+-Sample-0-/g)[1]);
    // console.log("position:", position);
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
    // console.log(populationPrefix);
    if (justEmptied) {
        const allPopulationElements = document.querySelectorAll("[id^='" + populationPrefix + "'");
        for (const popElement of allPopulationElements) {
            // if (!popElement.id.includes("Population")) {
            //     continue;
            // }
            hasListener = Object.values(chosenItems).includes(popElement.id);
			if (!hasListener) {
				popElement.addEventListener("mouseup", addToSample);
                popElement.setAttribute("data-listener", true);
                popElement.style.cursor = "pointer";
			}
        }
    }
}

function addUserClass(questionId, classColor) {
    const statsContainer = document.getElementById(questionId + "-all-stats-container");
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

function drawUnrankedSet(questionId, distribution, colors, label, borderColor="white") {
    const VIEWBOX_WIDTH = 200;
    const VIEWBOX_HEIGHT = 200;
    const statsContainer = document.getElementById(questionId + "-stats-container");
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
            particle.id = questionId + "-" + label + "-" + i + "-" + j;
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

function drawRankedList(questionId, distribution, ranking, colors, label, borderColor="white") {
    const VIEWBOX_WIDTH = 200;
    const VIEWBOX_HEIGHT = 100;
    const statsContainer = document.getElementById(questionId + "-stats-container");
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
			rect.id = questionId + "-" + label + "-" + i + "-" + j;
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

function drawProgressCircle(questionId) {
	const qNum = questionId.substring(2, questionId.length);
	const progress = parseInt(100 * qNum / TOTAL_QUESTIONS);
	const progressContainer = document.getElementById(questionId + "-progress-circle");
	const container = document.createElementNS(SVG_NS, "svg");
	container.setAttribute("xmlns", XMLNS);
    container.setAttribute("viewBox", "0 0 100 100");
    const progressCircle = document.createElementNS(SVG_NS, "path");
    const cx = 50, cy = 50, R = 46, deltaTheta = 2 * Math.PI / TOTAL_QUESTIONS, phi = - Math.PI / 2;
    const xEnd = cx + R * Math.cos(qNum * deltaTheta + phi);
    const yEnd = cy + R * Math.sin(qNum * deltaTheta + phi);
    let largeArc = 0;
    if (qNum > TOTAL_QUESTIONS / 2) {
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
	let nextQuestion, nextQuestionId;
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
		nextQuestionId = "Q-" + i;
		nextQuestion = document.createElement("div");
		nextQuestion.id = nextQuestionId;
		nextQuestion.classList.add("question-row-container");
		if (i > 0) {
			// console.log("no-display");
			nextQuestion.classList.add("no-display");
			nextQuestion.classList.add("invisible");
		}
		nextQuestion.innerHTML = `<div id="Q-${i}-question-container" class="question-container">
				<div class="question-header-container">
					<h2>Question</h2>
					<div id="Q-${i}-progress-circle" class="progress-circle"></div>
				</div>
				<p id="Q-${i}-question-text"></p>
				<div id="Q-${i}-stats-border" class="stats-border">
					<div id="Q-${i}-all-stats-container" class="all-stats-container">
						<div id="Q-${i}-stats-container" class="stats-container-grid">
						</div>
					</div>
				</div>
				<div id="Q-${i}-submit-button" class="submit-button-container" onclick="proceedToNext()">
					Next
				</div>
			</div>`;
		document.body.appendChild(nextQuestion);
		// console.log(document.body.innerHTML);
		generateQuestion(nextQuestionId, (Math.random() < 0.5), {"population": (Math.random() < 0.5), "sample": (Math.random() < 0.5)}, (Math.random() < 0.5), (Math.random() < 0.5));
		drawProgressCircle(nextQuestionId);
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
