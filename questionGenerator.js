const XMLNS = "http://www.w3.org/2000/svg";
const SVG_NS = "http://www.w3.org/2000/svg";
const SAMPLE_SIZE = 12;
const TOTAL_QUESTIONS = 22;
const SAMPLE_TOOLTIP = "Click to remove";
const POPULATION_TOOLTIP = "Click to add";
let CONDITIONS_PAIR;
let canProceed = true;
let studyStart = true;

let NEXT_TASK;

const API_URL = "http://127.0.0.1:5001/ouc---diversity-perception/us-central1/app/api";

const RESPONSES = {};
let currentResponse = {};

// const ITEMS = {
//     "i0": {
//         "population": [3, 4, 6, 8, 3],
//         "sample": [2, 2, 3, 4, 1],
//         "populationRanking": [0, 0, 1, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 4, 3, 4, 3, 4, 3, 3, 3, 3, 3, 3],
//         "sampleRanking": [0, 2, 2, 3, 4, 3, 2, 0, 1, 3, 3, 1],
//     },
//     "i1": {
//         "population": [2, 5, 1, 8, 8],
//         "sample": [2, 2, 1, 4, 3],
//         "populationRanking": [0, 1, 2, 3, 4, 4, 3, 1, 1, 0, 3, 4, 3, 4, 3, 4, 1, 3, 1, 4, 3, 4, 3, 4],
//         "sampleRanking": [0, 4, 4, 2, 3, 4, 3, 0, 1, 3, 3, 1],
//     },
// };

let ITEMS = [];
// [
//     {
//         "population": [5, 5, 5, 5, 4],
//         "sample": [3, 2, 3, 2, 2],
//         "populationRanking": [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4],
//         "sampleRanking": [],
//         "userClass": 1
//     },
//     {
//         "population": [5, 5, 5, 5, 4],
//         "sample": [5, 1, 2, 2, 2],
//         "populationRanking": [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4],
//         "sampleRanking": [],
//         "userClass": 1
//     },
//     {
//         "population": [5, 5, 5, 5, 4],
//         "sample": [3, 2, 3, 2, 2],
//         "populationRanking": [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4],
//         "sampleRanking": [],
//         "userClass": 4
//     },
//     {
//         "population": [5, 5, 5, 5, 4],
//         "sample": [2, 2, 2, 2, 4],
//         "populationRanking": [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4],
//         "sampleRanking": [],
//         "userClass": 4
//     },
//     {
//         "population": [5, 5, 5, 5, 4],
//         "sample": [3, 2, 3, 2, 2],
//         "populationRanking": [0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3],
//         "sampleRanking": [],
//         "userClass": 1
//     },
//     {
//         "population": [5, 5, 5, 5, 4],
//         "sample": [5, 2, 1, 2, 2],
//         "populationRanking": [0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3],
//         "sampleRanking": [],
//         "userClass": 1
//     },
//     {
//         "population": [5, 5, 5, 5, 4],
//         "sample": [3, 2, 3, 2, 2],
//         "populationRanking": [0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3],
//         "sampleRanking": [],
//         "userClass": 4
//     },
//     {
//         "population": [5, 5, 5, 5, 4],
//         "sample": [2, 2, 2, 2, 4],
//         "populationRanking": [0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3],
//         "sampleRanking": [],
//         "userClass": 4
//     },
//     {
//         "population": [8, 4, 4, 4, 4],
//         "sample": [4, 2, 2, 2, 2],
//         "populationRanking": [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4],
//         "sampleRanking": [],
//         "userClass": 2
//     },
//     {
//         "population": [8, 4, 4, 4, 4],
//         "sample": [3, 2, 3, 2, 2],
//         "populationRanking": [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4],
//         "sampleRanking": [],
//         "userClass": 2
//     },
//     {
//         "population": [8, 4, 4, 4, 4],
//         "sample": [3, 2, 2, 2, 3],
//         "populationRanking": [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4],
//         "sampleRanking": [],
//         "userClass": 2
//     },
//     {
//         "population": [5, 5, 5, 5, 4],
//         "sample": [],
//         "populationRanking": [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4],
//         "sampleRanking": [],
//         "userClass": 1
//     },
//     {
//         "population": [5, 5, 5, 5, 4],
//         "sample": [],
//         "populationRanking": [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4],
//         "sampleRanking": [],
//         "userClass": 4
//     },
//     {
//         "population": [5, 5, 5, 5, 4],
//         "sample": [],
//         "populationRanking": [0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3],
//         "sampleRanking": [],
//         "userClass": 1
//     },
//     {
//         "population": [5, 5, 5, 5, 4],
//         "sample": [],
//         "populationRanking": [0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3],
//         "sampleRanking": [],
//         "userClass": 4
//     },
//     {
//         "population": [8, 4, 4, 4, 4],
//         "sample": [],
//         "populationRanking": [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4],
//         "sampleRanking": [],
//         "userClass": 2
//     },
//     {
//         "population": [8, 4, 4, 4, 4],
//         "sample": [],
//         "populationRanking": [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4],
//         "sampleRanking": [],
//         "userClass": 0
//     },
//     {
//         "population": [8, 4, 4, 4, 4],
//         "sample": [],
//         "populationRanking": [0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 0, 0, 0],
//         "sampleRanking": [],
//         "userClass": 2
//     },
//     {
//         "population": [8, 4, 4, 4, 4],
//         "sample": [],
//         "populationRanking": [0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 0, 0, 0],
//         "sampleRanking": [],
//         "userClass": 0
//     },
//     {
//         "population": [9, 5, 5, 4, 1],
//         "sample": [],
//         "populationRanking": [0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 4, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2],
//         "sampleRanking": [],
//         "userClass": 4
//     },
//     {
//         "population": [9, 5, 5, 4, 1],
//         "sample": [],
//         "populationRanking": [0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 4],
//         "sampleRanking": [],
//         "userClass": 4
//     },
//     {
//         "population": [9, 5, 5, 4, 1],
//         "sample": [],
//         "populationRanking": [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2],
//         "sampleRanking": [],
//         "userClass": 4
//     },
// ];

const COLORS = [
    "#f44336",
    "#2196f3",
    "#4caf50",
    "#ff9800",
    "#9c27b0",
];

const CONSISTENCY_INDICES = {
    7: 2,
    10: 5,
    18: 13,
    21: 16,
};

let qColors = [];

const SVG_DEFS = `<defs>
<marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5"
    markerWidth="6" markerHeight="6"
    orient="auto-start-reverse">
<path d="M 0 0 L 10 5 L 0 10 z" />
</marker>
</defs>`;

const DIVERSITY_SLIDER = (questionId) => { 
    return `<div class="diversity-slider-labels-container">
        <div>Low</div>
        <div>High</div>
    </div>
    <input type="range" id="${questionId}-diversity" min="0" max="100" value="50">`;
}

let chosenItems = {} // Maps sample entries ids to population ids.

const N_ITEMS = Object.keys(ITEMS).length;

const samplePositions = new Array(SAMPLE_SIZE);

let answeredQuestions = 0;

function initializeSamplePositions() {
    for (let i = 0; i < SAMPLE_SIZE; i++) {
        samplePositions[i] = false;
    }
}

function initializeColors() {
    qColors = [];
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
        if (Object.keys(CONSISTENCY_INDICES).includes("" + i)) {
            qColors[i] = qColors[CONSISTENCY_INDICES[i]];
        } else {
            qColors[i] = shuffleList(COLORS);
        }
    }
}

function generateQuestion(questionId, knownPopulation, isRanked, isUserIn, isObserved, isDemo, index) { // All boolean except for isRanked = {"population": Boolean, "sample": Boolean}.
    // console.log("here", questionId);
    // const statsContainer = document.getElementById(questionId + "-stats-container");
    const questionHeader = document.getElementById(questionId + "-question-heading");
    const questionTextP = document.getElementById(questionId + "-question-text");
    const contextTextP = document.getElementById(questionId + "-context-text");
    const questionGridContainer = document.getElementById(questionId + "-question-grid-container");
    // const itemId = "i" + (Math.floor(N_ITEMS * Math.random()));
    const population = ITEMS[index]["population"];
    const sample = ITEMS[index]["sample"];
    // console.log(`sample as in ITEMS[${index}]:`, sample);
    const sampleRanking = ITEMS[index]["sampleRanking"];
    const populationRanking = ITEMS[index]["populationRanking"];
    let userClass = ITEMS[index]["userClass"];
    // const colors = shuffleList(COLORS); // Shuffle colors to avoid any correlations between groups and colors.
    const colors = qColors[parseInt(questionId.split("-")[1])];
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
            contextText += "Assume you belong to the class shown on the right. ";
            // userClass = Math.floor(population.length * Math.random());
            addUserClass(questionId, colors[userClass]);
        }
        if (isDemo) {
            contextText += `Also right, you are presented with ${knownPopulation ? isRanked["population"] ? "a <b>ranked</b> population with items from" : "an <b>unrakned</b> population with items from" : ""} five classes, denoted by color...`;
        } else {
            contextText += `${isUserIn || isDemo ? "Then, g" : "G"}iven the ${knownPopulation ? isRanked["population"] ? "<b>ranked</b> population" : "<b>unranked</b> population" : "classes"}, ${isUserIn ? "also ": ""}shown right...`;
        }
        contextTextP.innerHTML = contextText;
        if (isDemo) {
            questionText += `You are requested to construct a${isRanked["sample"] ? " <b>ranked</b>" : "n <b>unranked</b>"} sample of 12 items, each ${knownPopulation ? "drawn from the population" : "belonging to one of the five (5) classes"} shown above. Add an item to the sample by clicking on it ${knownPopulation ? "" : "s class"} (sample items are removed by simply clicking on them).`;
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
        if (knownPopulation) {
            // console.log("population:", population);
            addOnClickEvents(questionId, population, addToSample);
        }
        return;
	}
    addDiversitySlider(questionId);
    if (isUserIn) {
        contextText += "Assume you belong to the class shown right. ";
        // userClass = Math.floor(population.length * Math.random());
        addUserClass(questionId, colors[userClass]);
    }
    questionText += `${knownPopulation ? "...h" : "H"}ow diverse would you consider the ${isRanked["sample"] ? "<b>ranked</b>" : "<b>unranked</b>"} sample shown right to be?`;
    if (isDemo) {
        questionText += ` Provide your estimation by drawing the slider shown below (right means more diverse while left means less).`;
    }
    questionTextP.innerHTML = questionText;
    if (knownPopulation) {
        if (isDemo) {
            contextText += `Also right, you are presented with ${isRanked["population"] ? "a <b>ranked</b>" : "an <b>unrakned</b>"} population with items from five classes, denoted by color...`;
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
		drawUnrankedSet(questionId, "sample", sample, colors, "Sample");
	}
}

function addClassToSample(event) {
    const classElement = event.target;
    let minEmptyPosition = getMinEmptyPosition();
    // console.log(minEmptyPosition);
    const sampleIdPrefix = "Q-" + answeredQuestions;
    const sampleId = sampleIdPrefix + "-Sample-0-" + minEmptyPosition;
    const currentSampleElement = document.getElementById(sampleId);
    let populationPrefix = sampleIdPrefix + "-Population-";
    // console.log(element, currentSampleElement);
    // console.log(classElement.style.background);
    currentSampleElement.style.fill = classElement.style.fill;
    currentSampleElement.style.stroke = "white";
    chosenItems[sampleId] = classElement.id;
    samplePositions[minEmptyPosition] = true;
    currentSampleElement.style.cursor = "pointer";
    currentSampleElement.setAttribute("popClass", classElement.getAttribute("popClass"));
    currentSampleElement.addEventListener("mouseup", removeClassFromSample);
    minEmptyPosition = getMinEmptyPosition();
    // console.log(populationPrefix);
    if (minEmptyPosition === SAMPLE_SIZE) {
        // currentResponse = {};
        // console.log("Just emptied:", currentResponse, chosenItems);
		const allPopulationElements = document.querySelectorAll("[id^='" + populationPrefix + "']");
        const resp = [];
        for (const samplePos in chosenItems) {
            resp.push({
                "samplePosition": parseInt(samplePos.split("-")[4]),
                "populationClass": parseInt(document.getElementById(chosenItems[samplePos]).getAttribute("popClass")),
                "populationPosition": -1,
            });   
        }
        // console.log("resp:", resp);
        currentResponse = {"response": resp};        
		// const allPopulationElements = document.querySelectorAll("[id^='" + populationPrefix + "']");
		for (const populationElement of allPopulationElements) {
            populationElement.removeEventListener("mouseup", addClassToSample);
            populationElement.style.cursor = "auto";
            populationElement.style.opacity = "0.5";
		}
        const submitButton = document.getElementById(sampleIdPrefix + "-submit-button");
        submitButton.classList.remove("inactive");
        canProceed = true;
	}
}

function removeClassFromSample(event) {
    const sampleElement = event.target;
    const splitPopPrefix = sampleElement.id.split("-").filter(Boolean);
    const populationPrefix = splitPopPrefix[0] + "-" + splitPopPrefix[1] + "-Population-";
    const position = parseInt(sampleElement.id.split(/Q-\d+-Sample-0-/g)[1]);
    // console.log(canProceed)
    if (canProceed) {
        const submitButton = document.getElementById(splitPopPrefix[0] + "-" + splitPopPrefix[1] + "-submit-button");
        submitButton.classList.add("inactive");
        canProceed = false;
    }
    // console.log("position:", position);
    let justEmptied = getMinEmptyPosition() === SAMPLE_SIZE;
    // let hasListener;
    sampleElement.style.cursor = "auto";
    sampleElement.style.fill = "#ffffff";
    sampleElement.style.stroke = "#808080";
    sampleElement.removeEventListener("mouseup", removeClassFromSample);
    samplePositions[position] = false;
    // minEmptyPosition = getMinEmptyPosition();
    // console.log(populationPrefix);
    // console.log(splitPopPrefix);
    if (justEmptied) {
        const allPopulationElements = document.querySelectorAll("[id^='" + populationPrefix + "'");
        for (const popElement of allPopulationElements) {
            popElement.addEventListener("mouseup", addClassToSample);
            popElement.style.cursor = "pointer";
            popElement.style.opacity = "1.0";
        }
    }
}

function drawClassButtonPanel(questionId, set, colors) {
    const statsContainer = document.getElementById(questionId + "-" + set + "-stats-container");
    let classButton;
    const classButtonContainer = document.createElement("div");
    classButtonContainer.classList.add("add-class-button-container");
    let color;
    for (let i = 0; i < colors.length; i++) {
        color = colors[i];
        classButton = document.createElement("div");
        classButton.classList.add("add-class-button");
        classButton.style.fill = color;
        classButton.style.background = color;
        classButton.id = questionId + "-Population-class-button-" + i;
        classButton.setAttribute("popClass", i);
        classButton.addEventListener("mouseup", addClassToSample);
        classButtonContainer.appendChild(classButton);
    }
    statsContainer.appendChild(classButtonContainer);
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
    diversitySlideContainer.addEventListener("click", () => {
        canProceed = true;
        submitButton.classList.remove("inactive");
        currentResponse = {"response": document.getElementById(questionId + "-diversity").value};
        // console.log(currentResponse);
    }, false);
    diversitySlideContainer.innerHTML = DIVERSITY_SLIDER(questionId);
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
    // console.log(element.id, sampleId);
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
        // currentResponse = {};
        // console.log("Just emptied:", currentResponse, chosenItems);
		const allPopulationElements = document.querySelectorAll("[id^='" + populationPrefix + "']");
        const resp = [];
        for (const samplePos in chosenItems) {
            resp.push({
                "samplePosition": parseInt(samplePos.split("-")[4]),
                "populationClass": parseInt(document.getElementById(chosenItems[samplePos]).getAttribute("popClass")),
                "populationPosition": parseInt(document.getElementById(chosenItems[samplePos]).getAttribute("popPos")),
            });   
        }
        // console.log("resp:", resp);
        currentResponse = {"response": resp};
        // console.log(currentResponse);
		for (const populationElement of allPopulationElements) {
            // if (!populationElement.id.includes("Population")) {
            //     continue;
            // }
            // console.log("chosenItems:", chosenItems);
            hasListener = populationElement.getAttribute("data-listener") === "true";
			if (hasListener) {
				populationElement.removeEventListener("mouseup", addToSample);
                populationElement.setAttribute("data-listener", false);
                populationElement.style.cursor = "auto";
			}
		}
        const submitButton = document.getElementById(sampleIdPrefix + "-submit-button");
        submitButton.classList.remove("inactive");
        canProceed = true;
	}
}

function removeFromSample(event) {
    const sampleElement = event.target;
    const populationElement = document.getElementById(chosenItems[sampleElement.id]);
    const splitPopPrefix = sampleElement.id.split("-").filter(Boolean);
    const populationPrefix = splitPopPrefix[0] + "-" + splitPopPrefix[1] + "-Population-";
    const position = parseInt(sampleElement.id.split(/Q-\d+-Sample-0-/g)[1]);
    // console.log(splitPopPrefix);
    if (canProceed) {
        canProceed = false;
        const submitButton = document.getElementById(splitPopPrefix[0] + "-" + splitPopPrefix[1] + "-submit-button");
        submitButton.classList.add("inactive");
    }
    // console.log("position:", position);
    let justEmptied = getMinEmptyPosition() === SAMPLE_SIZE;
    let hasListener;
    sampleElement.style.cursor = "auto";
    sampleElement.style.fill = "#ffffff";
    sampleElement.style.stroke = "#808080";
    sampleElement.removeEventListener("mouseup", removeFromSample);
    // TODO Add tooltips manually by adding a div with position rel/absolute on top of each svg and style them accordingly.
    populationElement.style.cursor = "pointer";
    populationElement.style.fillOpacity = "1.0";
    populationElement.addEventListener("mouseup", addToSample);
    populationElement.setAttribute("data-listener", true);
    delete chosenItems[sampleElement.id];
    samplePositions[position] = false;
    // let minEmptyPosition = getMinEmptyPosition();
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

function drawUnrankedSet(questionId, set, distribution, colors, label, borderColor="white") {
    const VIEWBOX_WIDTH = 200;
    const VIEWBOX_HEIGHT = 200;
    const statsContainer = document.getElementById(questionId + "-" + set + "-stats-container");
    const container = document.createElementNS(SVG_NS, "svg");
    container.setAttribute("xmlns", XMLNS);
    container.setAttribute("viewBox", "0 0 " + VIEWBOX_WIDTH + " " + VIEWBOX_HEIGHT);
    container.innerHTML = SVG_DEFS;
    // console.log("distribution:", distribution);
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
    // console.log("distribution:", distribution);
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
            rect.setAttribute("popClass", ranking[currentX]);
            rect.setAttribute("popPos", j);
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

function initializeQuestions(condition1, condition2) {
	let nextQuestion, nextQuestionId, isDemo, knownPopulation, isRanked, isUserIn, isObserved;
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
		nextQuestionId = "Q-" + i;
		nextQuestion = document.createElement("div");
		nextQuestion.id = nextQuestionId;
		nextQuestion.classList.add("question-row-container");
		if (i >= 0) {
			// console.log("no-display");
			nextQuestion.classList.add("no-display");
			nextQuestion.classList.add("invisible");
		}
		nextQuestion.innerHTML = `<div id="Q-${i}-question-container" class="question-container">
				<div class="question-header-container">
					<h2 id="Q-${i}-question-heading">Question</h2>
					<div id="Q-${i}-progress-circle" class="progress-circle"></div>
				</div>
                <div id="Q-${i}-question-grid-container" class="question-grid-container">
                    <p id="Q-${i}-context-text"></p>
                    <div id="Q-${i}-stats-border" class="stats-border">
                        <div id="Q-${i}-all-stats-container" class="all-stats-container">
                            <div id="Q-${i}-population-stats-container" class="stats-container-single">
                            </div>
                        </div>
                    </div>
                    <p id="Q-${i}-question-text"></p>
                    <div class="stats-border">
                        <div class="all-stats-container">
                            <div id="Q-${i}-sample-stats-container" class="stats-container-single">
                            </div>
                        </div>
                    </div>
                </div>
				<div id="Q-${i}-submit-button" class="submit-button-container inactive" onclick="proceedToNext()">
					Next
				</div>
			</div>`;
		document.body.appendChild(nextQuestion);
		// console.log(document.body.innerHTML);
        isDemo = i % (TOTAL_QUESTIONS / 2) === 0;
        if (i < TOTAL_QUESTIONS / 2) {
            knownPopulation = condition1["knownPopulation"];
            isRanked = condition1["isRanked"];
            isUserIn = condition1["isUserIn"];
            isObserved = condition1["isObserved"];
        } else {
            knownPopulation = condition2["knownPopulation"];
            isRanked = condition2["isRanked"];
            isUserIn = condition2["isUserIn"];
            isObserved = condition2["isObserved"];
        }
        generateQuestion(nextQuestionId, knownPopulation, isRanked, isUserIn, isObserved, isDemo, i);
		drawProgressCircle(nextQuestionId);
    }
}

function getConditionIndex(i) {
    if (Object.keys(CONSISTENCY_INDICES).includes(i)) {
        return CONSISTENCY_INDICES[i];
    }
    return i;
}

function init() {
    getNextTask().then(() => {
        // console.log("then");
        taskInit();
    });
}

function taskInit() {
    initializeColors();
    // console.log(qColors);
    const initBox = document.createElement("div");
    initBox.id = "Q-start";
    initBox.classList.add("question-row-container");
    const initQcont = document.createElement("div");
    initQcont.id = "Q-start-question-container";
    initQcont.classList.add("question-container");
    const qHeaderCont = document.createElement("div");
    qHeaderCont.classList.add("question-header-container");
    const h2 = document.createElement("h2");
    h2.innerText = "Study Description";
    h2.id = "Q-start-question-heading";
    const progressCircle = document.createElement("div");
    progressCircle.id = "Q-start-progress-circle";
    progressCircle.classList.add("progress-circle");
    qHeaderCont.append(h2);
    qHeaderCont.append(progressCircle);
    const startP = document.createElement("p");
    startP.innerHTML = `<div>
        <p>Welcome to our survey!</p>
        <p>You are about to take a survey regarding diversity perception. In what follows, it will be useful to bear in mind that:</p>
        <ul>
            <li>Your answers need not be elaborate. We are mostly looking for spontaneous feedback.</li>
            <li>Your answers will be monitored for consistency.</li>
            <li>You will be presented with 22 tasks, split into two groups of 11 tasks each.</li>
            <li>The first task in each group is a demo task, designed to help you get accustomed with the rest.</li>
        </ul>
        <p>Thank you for participating in our survey! :)</p>
    </div>`;
    const submitButton = document.createElement("div");
    submitButton.id = "Q-start-submit-button";
    submitButton.classList.add("submit-button-container");
    submitButton.innerText = "Start!";
    submitButton.addEventListener("click", () => {
        startStudy();
        proceedToNext();
    }, false);
    initQcont.append(qHeaderCont);
    initQcont.append(startP);
    initQcont.append(submitButton);
    initBox.append(initQcont);
    document.body.append(initBox);
}

function parseCon(con) {
    const sCon = con.split("_").filter(Boolean);
    return {
        knownPopulation: sCon[0] === "t",
        isRanked: {
            population: sCon[1][0] === "t",
            sample: sCon[1][1] === "t",
        },
        isUserIn: sCon[2] === "t",
        isObserved: sCon[3] === "t",
    };
}

function startStudy() {
    TASK_ID = NEXT_TASK["taskId"];
    const condition1 = parseCon(NEXT_TASK["pair0"]);
    const condition2 = parseCon(NEXT_TASK["pair1"]);
    CONDITIONS_PAIR = NEXT_TASK["pair0"] + "|" + NEXT_TASK["pair1"];
    ITEMS = NEXT_TASK["instances0"].concat(NEXT_TASK["instances1"]);
    // console.log(TASK_ID, condition1, condition2, ITEMS);
    // const condition1 = {
    //     knownPopulation: true,
    //     isRanked: {
    //         population: true,
    //         sample: false,
    //     },
    //     isUserIn: true,
    //     isObserved: true,
    // };
    // const condition2 = {
    //     knownPopulation: true,
    //     isRanked: {
    //         population: true,
    //         sample: false,
    //     },
    //     isUserIn: true,
    //     isObserved: false,
    // };
    initializeQuestions(condition1, condition2);
}

function getNextTask() {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.addEventListener("error", (event) => {console.log("Error:", event);});
        req.addEventListener("load", () => {
            if (req.status === 200) {
                NEXT_TASK = JSON.parse(req.response);
                // console.log(req, req.response);
                resolve();
            }
        })
        req.open("GET", API_URL + "/next-task");
        req.send();
    });
}

function postResponse() {
    addLoadingScreen();
    const req = new XMLHttpRequest();
    req.addEventListener("error", (event) => {console.log("Error:", event);});
    req.addEventListener("load", () => {
        if (req.status === 200) {
            console.log("Success!");
            setTimeout(() => {
                document.getElementsByClassName("load-screen-blocker")[0].remove();
            }, 5000);
        }
    });
    req.open("POST", API_URL + "/post-task");
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("Accept", "application/json");
    req.send(JSON.stringify({
        conditionsPair: CONDITIONS_PAIR,
        taskId: TASK_ID,
        colors: qColors,
        response: RESPONSES,
    }));
}

function addLoadingScreen() {
    const blocker = document.createElement("div");
    blocker.classList.add("load-screen-blocker");
    const doNotClose = document.createElement("div");
    doNotClose.classList.add("question-container");
    doNotClose.innerHTML = `<h2>Wait!</h2>
    <p><b>Do not close this tab</b> until prompted to do so!</p>`;
    blocker.append(doNotClose);
    document.body.append(blocker);
}

window.addEventListener("load", function() {init();});

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
