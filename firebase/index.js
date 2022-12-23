const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();

const fs = require("fs");

app.use(cors({ origin: true }));

let serviceAccount = require("./permissions.json");
const { resolve } = require("path");
// const { send } = require("process");
// const { resolve } = require("path");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fir-api-9a206..firebaseio.com"
});
const db = admin.firestore();

app.get("/api/next-task", (req, res) => {
    (async () => {
        try {
            await db.collection("misc").doc("/counters/").get().then((documentSnapshot) => {
                const doc = documentSnapshot.data();
                const tasksCompleted = doc.tasksCompleted;
                db.collection("pairs").listDocuments().then((docs) => {
                    // console.log(docs, docs.length);
                    docs[tasksCompleted % docs.length].get().then((pairDoc) => {
                        const pair = pairDoc.data().pair;
                        db.collection("samples").doc("/" + pair[0] + "/").get().then((pair0) => {
                            db.collection("samples").doc("/" + pair[1] + "/").get().then((pair1) => {
                                const instances0 = getInstances(pair0.data().instances);
                                const instances1 = getInstances(pair1.data().instances);
                                db.collection("misc").doc("/counters/").update({tasksCompleted: tasksCompleted + 1});
                                return res.status(200).send({
                                    taskId: tasksCompleted,
                                    pair0: pair[0],
                                    pair1: pair[1],
                                    instances0: instances0,
                                    instances1: instances1,
                                });
                            });
                        });
                    });
                });
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

// function postResponse(pairTag, taskId, response) {
//     db.collection("responses").doc("/" + pairTag + "/").get().then((documentSnapshot) => {
//         (async () => {
//             const doc = documentSnapshot.data();
//         const responses = doc.responses;
//         responses[taskId] = response;
//         await db.collection("responses").doc("/" + pairTag + "/").update({responses: responses});
//         })();
//     });
// }

function getInstances(instances) {
    const n = instances.length;
    const sampleIndices = randomSample(n, 11);
    const sample = [];
    for (const i of sampleIndices) {
        sample.push(instances[i]);
    }
    return sample;
}

function randomSample(n, m) { // returns a random sample of m integers {0,1,...,n-1}. In case n < m, repetitions are allowed.
    let sample = [];
    while (n < m) {
        for (let i = 0; i < n; i++) {
            sample.push(i);
        }
        m -= n;
    }
    const reservoir = reservoirSample(n, m);
    console.log(reservoir);
    for (const x of reservoir) {
        sample.push(x);
    }
    return sample;
}

function reservoirSample(n, m) { // n >= m
    // console.log(n, m);
    const r = [], s = [];
    for (let i = 0; i < n; i++) {
        if (i < m) {
          r.push(i);
        }
        s.push(i);
    }
    let W = Math.pow(Math.random(), 1 / m);
    let i = 0;
    while (i < n) {
        i += Math.floor(Math.log(Math.random()) / Math.log(1 - W)) + 1;
        if (i < n) {
            r[Math.max(0, Math.min(Math.floor(m * Math.random()), m - 1))] = s[i];
            W *= Math.pow(Math.random(), 1 / m);
        }
    }
    return r;
}

app.post("/api/post-task", (req, res) => {
    (async () => {
        try {
            await db.collection("responses").doc("/" + req.body.conditionsPair + "/")
                .collection("responses").doc("/" + req.body.taskId + "/")
                    .create({
                        colors: req.body.colors.map((x, i) => ({["Q-" + i]: x})),
                        response: req.body.response,
                    });
            await db.collection("misc").doc("/counters/").get().then((documentSnapshot) => {
                const tasksPosted = documentSnapshot.data().tasksPosted;
                db.collection("misc").doc("/counters/").update({tasksPosted: tasksPosted + 1});
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

app.post("/api/create", (req, res) => {
    (async () => {
        try {
            await db.collection("responses").doc("/" + req.body.id + "/")
                .create({item: req.body.item});
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

app.post("/api/init-samples", (req, res) => {
    (async () => {
        const samplesJSON = JSON.parse(fs.readFileSync("./assets/data/samples.json"));
        try {  
            for (const key in samplesJSON) {   
                await db.collection("samples").doc("/" + key + "/")
                    .create({instances: samplesJSON[key]});
            }
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

app.post("/api/init-pairs", (req, res) => {
    (async () => {
        const pairsJSON = JSON.parse(fs.readFileSync("./assets/data/pairs.json"));
        let id, invId;
        try {
            for (const pair of pairsJSON) {
                id = pair.join("|");
                invId = pair[1] + "|" + pair[0];
                await db.collection("pairs").doc("/" + id + "/")
                  .create({pair: pair});
                await db.collection("pairs").doc("/" + invId + "/")
                  .create({pair: [pair[1], pair[0]]});
            }
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

app.post("/api/init-misc", (req, res) => {
    (async () => {
        try {
            await db.collection("misc").doc("/counters/")
                .create({tasksCompleted: 0});
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

app.post("/api/init-responses", (req, res) => {
    (async () => {
        const pairsJSON = JSON.parse(fs.readFileSync("./assets/data/pairs.json"));
        let id, invId;
        try {
            for (const pair of pairsJSON) {
                id = pair.join("|");
                invId = pair[1] + "|" + pair[0];
                await db.collection("responses").doc("/" + id + "/").create();
                await db.collection("responses").doc("/" + invId + "/").create();
                    // .create({responses: {}});
            }
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

app.delete("/api/delete-responses", (req, res) => {
    (async () => {
        try {
            await db.collection("responses").listDocuments().then((val) => {
                val.map((doc) => {
                    doc.delete();
                });
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

app.delete("/api/delete-pairs", (req, res) => {
    (async () => {
        try {
            await db.collection("pairs").listDocuments().then((val) => {
                val.map((doc) => {
                    doc.delete();
                });
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

app.delete("/api/delete-items", (req, res) => {
    (async () => {
        try {
            await deleteCollection(db, "items", 100);
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

async function deleteCollection(db, collectionPath, batchSize) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(db, query, resolve) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve();
    return;
  }

  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}


exports.app = functions.https.onRequest(app);