import * as functions from 'firebase-functions';
const cors = require('cors');
import * as express from 'express';
import * as admin from 'firebase-admin'
import { Occurence } from './models.ts/classes';
import { rc4 } from './utils/rc4';
import * as bodyParser from 'body-parser';
// import { rc4 } from './utils/rc4';
admin.initializeApp();


const app = express();

app.use(bodyParser.text());
// Automatically allow cross-origin requests
app.use(cors({ origin: true }));


export const receiveOccurence = functions.https.onRequest(async (request, response) => {
    // const key = 'iot';
    if (request.method != 'POST') {
        response.status(403).send('Forbidden');
        return;
    }

    let body = JSON.parse(request.body);
    let user = body.data.source;
    let lt = parseFloat(body.data.lt);
    let ln = parseFloat(body.data.ln);

    console.log(`Keys before decrypt: user: ${user}, lt: ${lt}, ln: ${ln}`);
    user = rc4('bbbb', user);

    console.log(`User after decrypt: ${user}`);


    const date = new Date().getDate();
    const dateMonth = new Date().getMonth();
    const dateYear = new Date().getFullYear();
    const day: string = (date >= 10 ? date : date == 0 ? '1' : `0${date}`) + '/' + (dateMonth + 1 >= 10 ? dateMonth + 1 : `0${dateMonth + 1}`) + '/' + dateYear;

    let hours = new Date().getHours() >= 10 ? new Date().getHours() : '0' + new Date().getHours();
    let minutes = new Date().getMinutes() >= 10 ? new Date().getMinutes() : '0' + new Date().getMinutes();
    const hour = hours + ':' + minutes;

    const occurence: Occurence = new Occurence(day, hour, { lt, ln });
    await admin.database().ref('/occurences').child(user).push(occurence);

    response.status(201).send("Occurrence succesfully inserted");
});
