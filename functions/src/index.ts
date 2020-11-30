import * as functions from 'firebase-functions';
const cors = require('cors');
import * as express from 'express';
import * as admin from 'firebase-admin'
import { Occurence } from './models.ts/classes';
admin.initializeApp();


const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));


export const receiveOccurence = functions.https.onRequest(async (request, response) => {
    // const key = 'iot';
    if (request.method != 'POST') {
        response.status(403).send('Forbidden');
        return;
    }

    let user = request.body.source;
    let lt = request.body.lt;
    let ln = request.body.ln;

    const day: string = (new Date().getDay() >= 10 ? new Date().getDay() : '0' + new Date().getDay()) + '/' + (new Date().getMonth() >= 10 ? new Date().getMonth() : '0' + new Date().getMonth()) + '/' + new Date().getFullYear();

    let hours = new Date().getHours() >= 10 ? new Date().getHours() : '0' + new Date().getHours();
    let minutes = new Date().getMinutes() >= 10 ? new Date().getMinutes() : '0' + new Date().getMinutes();
    const hour = hours + ':' + minutes;

    const occurence: Occurence = new Occurence(day, hour, { lt, ln });
    await admin.database().ref('/occurences').child(user).push(occurence);

    response.status(201).send("Occurrence succesfully inserted");
});
