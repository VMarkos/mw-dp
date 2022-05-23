ITEMS = {
    "i0": {
        "population": [3, 4, 6, 8, 3],
        "sample": [2, 2, 3, 4, 1],
    },
    "i1": {
        "population": [2, 5, 1, 8, 8],
        "sample": [2, 2, 4, 2, 3],
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
    const itemId = "i" + (Math.floor(N_ITEMS * Math.random()));
    const population = ITEMS[itemId]["population"];
    const sample = ITEMS[itemId]["sample"];
    const colors
    if ()
}

function shuffleList(x) { // Fischer-Yates shuffling algorithm.
    const shuffled = [...x]; // SHALLOW Copy, only for arrays of primitives.
    let j, temp;
    for (let i = x.length - 1; i > 0; i--) {
        j = Math.floor((i + 1) * Math.random());
        temp = x[i];
        x[i] = x[j];
        x[j] = temp;
    }
    return shuffled;
}