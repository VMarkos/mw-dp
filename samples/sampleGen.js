const XMLNS = "http://www.w3.org/2000/svg";
const SVG_NS = "http://www.w3.org/2000/svg";
const SAMPLE_SIZE = 12;
const TOTAL_QUESTIONS = 6;
const SAMPLE_TOOLTIP = "Click to remove";
const POPULATION_TOOLTIP = "Click to add";

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

function generateQuestion(questionId, knownPopulation, isRanked, isUserIn, isObserved, isDemo, item) { // All boolean except for isRanked = {"population": Boolean, "sample": Boolean}.
    // console.log("here", questionId);
    console.log("qid", questionId);
    // const statsContainer = document.getElementById(questionId + "-stats-container");
    const questionHeader = document.getElementById(questionId + "-question-heading");
    const questionTextP = document.getElementById(questionId + "-question-text");
    const contextTextP = document.getElementById(questionId + "-context-text");
    const questionGridContainer = document.getElementById(questionId + "-question-grid-container");
    // const itemId = "i" + (Math.floor(N_ITEMS * Math.random()));
    const population = item["population"];
    const sample = item["sample"];
    const sampleRanking = item["sampleRanking"];
    const populationRanking = item["populationRanking"];
    let userClass = item["userClass"];
    const colors = shuffleList(COLORS); // Shuffle colors to avoid any correlations between groups and colors.
    let questionText = "", contextText = "";
    // let bothRanked = false;
    if (isDemo) {
        questionHeader.innerHTML = "Demo";
    }
    if (!knownPopulation && isObserved && !isUserIn) {
		questionGridContainer.removeChild(document.getElementById(questionId + "-context-text"));
		questionGridContainer.removeChild(document.getElementById(questionId + "-stats-border"));
	} 
	// else if (isRanked["population"] && isRanked["sample"]) {
	//	statsContainer.classList.remove("stats-container-grid");
    //    statsContainer.classList.add("stats-container-flex");
    //    bothRanked = true;
	// }
	if (!isObserved) {
        if (isUserIn) {
            contextText += "Assume you belong to the class shown right. ";
            // userClass = Math.floor(population.length * Math.random());
            userClass = item["userClass"];
            addUserClass(questionId, colors[userClass]);
        }
        if (isDemo) {
            contextText += `Also right, you are presented with ${knownPopulation ? isRanked["population"] ? "a <b>ranked</b> population with items from" : "an <b>unrakned</b> population with items from" : ""} five classes, denoted by color.`;
        } else {
            contextText += `${isUserIn || isDemo ? "Then, g" : "G"}iven the ${knownPopulation ? isRanked["population"] ? "<b>ranked</b> population" : "<b>unranked</b> population" : "classes"}, ${isUserIn ? "also ": ""}shown right...`;
        }
        contextTextP.innerHTML = contextText;
        if (isDemo) {
            questionText += `You are requested to construct a ${isRanked["sample"] ? " <b>ranked</b>" : "n <b>unranked</b>"} sample of 12 items, each ${knownPopulation ? "drawn from the population" : "belonging to one of the five (5) classes"} shown above. Add an item to the sample by clicking on it ${knownPopulation ? "" : "s class"} (sample items are removed by simply clicking on them).`;
        } else {
            questionText += `...construct a${isRanked["sample"] ? " <b>ranked</b>" : "n <b>unranked</b>"} sample which is <b>as diverse as possible</b>.`
        }
        questionTextP.innerHTML = questionText;
        if (!knownPopulation) {
            drawClassButtonPanel(questionId, "population", colors);
        } else {
            if (isRanked["population"]) {
                drawRankedList(questionId, "population", population, populationRanking, colors, "Population");
            } else {
                drawUnrankedSet(questionId, "population", population, colors, "Population");
            }
        }
		if (isRanked["sample"]) {
			drawRankedList(questionId, "sample", [SAMPLE_SIZE], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ["#ffffff"], "Sample", "#808080");
		} else {
			drawUnrankedSet(questionId, "sample", [SAMPLE_SIZE], ["#ffffff"], "Sample", "#808080");
		}
        return;
	}
    addDiversitySlider(questionId);
    if (isUserIn) {
        contextText += "Assume you belong to the class shown right. ";
        userClass = Math.floor(population.length * Math.random());
        addUserClass(questionId, colors[userClass]);
    }
    questionText += `${knownPopulation ? "...h" : "H"}ow diverse would you consider the ${isRanked["sample"] ? "<b>ranked</b>" : "<b>unranked</b>"} sample shown right to be?`;
    if (isDemo) {
        questionText += ` Provide your estimation by drawing the slider shown below (right means more diverse while left means less).`;
    }
    questionTextP.innerHTML = questionText;
    if (knownPopulation) {
        if (isDemo) {
            contextText += `Also right, you are presented with ${isRanked["population"] ? "a <b>ranked</b>" : "an <b>unrakned</b>"} population with items from five classes, denoted by color.`;
        } else {
            contextText += `${isUserIn ? "Then, g" : "G"}iven the ${isRanked["population"] ? "<b>ranked</b>" : "<b>unranked</b>"} population, ${isUserIn ? "also ": ""}shown right...`;
        }
        if (isRanked["population"]) {
            drawRankedList(questionId, "population", population, populationRanking, colors, "Population");
        } else {
            drawUnrankedSet(questionId, "population", population, colors, "Population");
        }
    }
    contextTextP.innerHTML = contextText;
	if (isRanked["sample"]){
		drawRankedList(questionId, "sample", sample, sampleRanking, colors, "Sample");
	} else {
        console.log("sample:", sample);
		drawUnrankedSet(questionId, "sample", sample, colors, "Sample");
	}
}

function drawClassButtonPanel(questionId, set, colors) {
    const statsContainer = document.getElementById(questionId + "-" + set + "-stats-container");
    let classButton;
    const classButtonContainer = document.createElement("div");
    classButtonContainer.classList.add("add-class-button-container");
    for (const color of colors) {
        classButton = document.createElement("div");
        classButton.classList.add("add-class-button");
        classButton.style.fill = color;
        classButton.style.background = color;
        classButton.id = questionId + "-Population-class-button";
        // classButton.addEventListener("mouseup", addClassToSample);
        classButtonContainer.appendChild(classButton);
    }
    statsContainer.appendChild(classButtonContainer);
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

function drawUnrankedSet(questionId, set, distribution, colors, label, borderColor="white") {
    const VIEWBOX_WIDTH = 200;
    const VIEWBOX_HEIGHT = 200;
    const statsContainer = document.getElementById(questionId + "-" + set + "-stats-container");
    const container = document.createElementNS(SVG_NS, "svg");
    container.setAttribute("xmlns", XMLNS);
    container.setAttribute("viewBox", "0 0 " + VIEWBOX_WIDTH + " " + VIEWBOX_HEIGHT);
    container.innerHTML = SVG_DEFS;
    console.log(distribution);
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

function drawRankedList(questionId, set, distribution, ranking, colors, label, borderColor="white") {
    const VIEWBOX_WIDTH = 200;
    const VIEWBOX_HEIGHT = 100;
    const statsContainer = document.getElementById(questionId + "-" + set + "-stats-container");
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
    // line.setAttribute("marker-end", "url(#arrow)");
    // console.log(line.getAttribute("marker-end"));
    line.setAttribute("points", "0," + lineY + " " + (1.00 * VIEWBOX_WIDTH) + "," + lineY);
    firstLabel = document.createElementNS(SVG_NS, "text");
    firstLabel.setAttribute("x", 0);
    firstLabel.setAttribute("y", lineY - 4);
    firstLabelText = document.createTextNode("first");
    firstLabel.appendChild(firstLabelText);
    firstLabel.setAttribute("font-size", "12");
    lastLabel = document.createElementNS(SVG_NS, "text");
    lastLabel.setAttribute("x", 1.00 * VIEWBOX_WIDTH);
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

function initializeQuestions(condition1, condition2, item1, item2, id, container, n = 2) {
	let nextQuestion, nextQuestionId, isDemo, knownPopulation, isRanked, isUserIn, isObserved;
    for (let i = 0; i < n; i++) {
		nextQuestionId = "Q-" + id + "-" + i;
		nextQuestion = document.createElement("div");
		nextQuestion.id = nextQuestionId;
		// nextQuestion.classList.add("question-row-container");
		// if (i > 0) {
		// 	// console.log("no-display");
		// 	nextQuestion.classList.add("no-display");
		// 	nextQuestion.classList.add("invisible");
		// }
		nextQuestion.innerHTML = `<div id="${nextQuestionId}-question-container" class="question-container">
				<div class="question-header-container">
					<h2 id="${nextQuestionId}-question-heading">Question</h2>
					<div id="${nextQuestionId}-progress-circle" class="progress-circle"></div>
				</div>
                <div id="${nextQuestionId}-question-grid-container" class="question-grid-container">
                    <p id="${nextQuestionId}-context-text"></p>
                    <div id="${nextQuestionId}-stats-border" class="stats-border">
                        <div id="${nextQuestionId}-all-stats-container" class="all-stats-container">
                            <div id="${nextQuestionId}-population-stats-container" class="stats-container-single">
                            </div>
                        </div>
                    </div>
                    <p id="${nextQuestionId}-question-text"></p>
                    <div class="stats-border">
                        <div class="all-stats-container">
                            <div id="${nextQuestionId}-sample-stats-container" class="stats-container-single">
                            </div>
                        </div>
                    </div>
                </div>
			</div>`;
        // console.log(container);
		container.appendChild(nextQuestion);
		// console.log(document.body.innerHTML);
        // isDemo = i % (TOTAL_QUESTIONS / 2) === 0;
        isDemo = false;
        if (i < 1) {
            knownPopulation = condition1["knownPopulation"];
            isRanked = condition1["isRanked"];
            isUserIn = condition1["isUserIn"];
            isObserved = condition1["isObserved"];
            console.log(condition1);
            generateQuestion(nextQuestionId, knownPopulation, isRanked, isUserIn, isObserved, isDemo, item1);
        } else {
            knownPopulation = condition2["knownPopulation"];
            isRanked = condition2["isRanked"];
            isUserIn = condition2["isUserIn"];
            isObserved = condition2["isObserved"];
            console.log(condition2);
            generateQuestion(nextQuestionId, knownPopulation, isRanked, isUserIn, isObserved, isDemo, item2);
        }
		// generateQuestion(nextQuestionId, (Math.random() < 0.5), {"population": (Math.random() < 0.5), "sample": (Math.random() < 0.5)}, (Math.random() < 0.5), (Math.random() < 0.5), isDemo);
		// drawProgressCircle(nextQuestionId);
    }
}

function parseCond(condition) {
    let newCond = [];
    for (let i = 0; i < condition.length; i++) {
        if (condition[i] !== "_") {
            newCond.push(condition[i].toUpperCase());
        }
    }
    return newCond.join(",");
}

function condTooltip(condition) {
    const stb = (s) => {return s === "f" ? "False" : "True"};
    let tooltip = "";
    const conditions = condition.split("_");
    tooltip = "knownPopulation: " + stb(conditions[0]) + ",\nisRankedPopulation: " + stb(conditions[1][0]) + ",\nisRankedSample: " + stb(conditions[1][1])  + ",\nisUserInvolved: " + stb(conditions[2]) + ",\nisObserved: " + stb(conditions[3]);
    return tooltip;
}

function generatePage() {
    let cond1, cond2, sample1, sample2, id, h2, container;
    for (const pair of pairs) {
        cond1 = pair[0];
        cond2 = pair[1];
        id = cond1 + "-" + cond2;
        console.log(cond1, cond2);
        h2 = document.createElement("h2");
        h2.classList.add("samples-h2");
        h2.innerHTML = parseCond(cond1) + "&nbsp;&nbsp; vs &nbsp;&nbsp;" + parseCond(cond2);
        document.body.appendChild(h2);
        container = document.createElement("div");
        container.id = cond1 + "-" + cond2;
        container.classList.add("sample-grid");
        document.body.appendChild(container);
        // sample1 = samples[cond1][0];
        // sample2 = samples[cond2][0];
        // initializeQuestions(conditions[cond1], conditions[cond2], sample1, sample2, id, pairContainer);
        for (let i = 0; i < samples[cond1].length; i++) {
            for (let j = 0; j < samples[cond2].length; j++) {
                const pairContainer = document.createElement("div");
                pairContainer.classList.add("sample-pair");
                container.appendChild(pairContainer);
                // console.log(i, j);
                id += "-" + i + "-" + j;
                sample1 = samples[cond1][i];
                sample2 = samples[cond2][j];
                initializeQuestions(conditions[cond1], conditions[cond2], sample1, sample2, id, pairContainer);
            }
        }
    }
}

function generatePageWithSingleSamples() {
    let id, h2, container, sample;
    for (const condition in conditions) {
        id = condition
        h2 = document.createElement("h2");
        h2.classList.add("samples-h2");
        h2.innerHTML = parseCond(condition);
        h2.title = condTooltip(condition);
        document.body.appendChild(h2);
        container = document.createElement("div");
        container.id = condition;
        container.classList.add("sample-grid");
        document.body.appendChild(container);
        // sample1 = samples[cond1][0];
        // sample2 = samples[cond2][0];
        // initializeQuestions(conditions[cond1], conditions[cond2], sample1, sample2, id, pairContainer);
        for (let i = 0; i < samples[condition].length; i++) {
            const pairContainer = document.createElement("div");
            pairContainer.classList.add("sample-pair");
            container.appendChild(pairContainer);
            id += "-" + i;
            sample = samples[condition][i];
            initializeQuestions(conditions[condition], {}, sample, {}, id, pairContainer, 1);
        }
    }
}

window.addEventListener("load", generatePageWithSingleSamples);