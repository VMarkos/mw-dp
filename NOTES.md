# Notes on Diversity Perception Experiments

## Structure of the study
1. Each participant is shown a set of 20 questions/tasks;
2. Tasks are split into two groups of 10, each one belonging to one of two conditions;
3. Prior to each group of tasks, each participant is shown a walkthrough, which prompts them to navigate throughout the process of that task.

## Materials
Various study materials.

### Demo texts
[x] **Constructed, unknown population**: You are requested to construct a (ranked/unranked) sample of 12 items, each belonging to one of the five (5) classes shown right. Add an item to the sample by clicking on its class (sample items are removed by simply clicking on them);
[x] **Constructed, known ranked/unranked population**: You are requested to construct a (ranked/unranked) sample of 12 items, drawing each item from the ranked/unranked population shown right. Add an item to the sample by clicking on it (sample items are removed by simply clicking on them);
[x] **Observed, known ranked/unranked population**: How diverse would you consider the (ranked/unranked) sample shown...

## TODOs
[x] Create a walkthrough for each condition;
[x] Generate a DB and the corresponding API to store the study's results;
[ ] Generate a download file which will serve as PoW and will contain: (a) taskId; (b) responses for each of the four consistency indices. TAKE CARE to encrypt this file to avoid corrupted PoWs.

## Models
1. You have a table with all pairs of conditions, so for each participant you pick up a pair:
    * Keep track of the number of appearances of each pair &mdash; actually, you can just have them appear in a sequential manner, so as to ensure that all pairs get the same number of participants;
    * For each pair, each time you generate samples, you pick a random list of 11 integers (or, actually, max(11, # of instances)) to serve to the page. The integers should be the same so as to ensure that the instances shown are compatible &mdash; or maybe create a map to show which instances are comparable;
2. You have a table where you store the results of the survey:
    * Your basic model is a single take of the study, which contains the results of the study as posted by the page, i.e.:
        1. creation TS;
        2. user responses for each task;
        3. response time for each response;

Study flow:
1. On page load:
    * GET request to:
        * create a new task in the DB;
        * initialize responses -> "taskId" to {};
        * generate instances and save them to task info;
        * return the task's uuid as a response;
2. On survey end:
    * POST request to:
        * update the created task in the DB;
        * WAIT for OK reponse to close the survey.

Response Data Structure:

```javascript
{
    "conditionsPair": "f_ff_f_f|f_ff_f_t",
    "taskId": 5, // possibly just an int or a uuid.
    "colors": [
        [<"list of colors">],
        [<"list of colors">],
    ],
    "response": {
        "Q-0": {
            "response": 45,
            "responseDuration": 1023268,
        },
        "Q-1": {
            "response": [
                {"samplePosition": 0, "populationClass": 3, "populationPosition": 0},
                {"samplePosition": 1, "populationClass": 1, "populationPosition": 2},
                ...
            ],
            "responseDuration": 0123484,
        }
    },
}
```

`responses` Collection Structure:

```javascript
{
    "f_ff_f_f|f_ff_f_t": {
        "responses": {
            "<taskId (uuid)>": {"<Response Object, as above>"},
            "<taskId (uuid)>": {"<Response Object, as above>"},
            ...
        },
    },
    ...
}
```

`next-task` Structure:

```javascript
{
    "taskId": 123,
    "pair0": "f_ff_f_f",
    "pair1": "f_ff_f_t",
    "instances0": ["<Instances>"],
    "instances1": ["<Instances>"],
}
```