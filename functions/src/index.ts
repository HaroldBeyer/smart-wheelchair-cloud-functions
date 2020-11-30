import * as functions from 'firebase-functions';
const cors = require('cors');
import * as express from 'express';
// const admin = require('firebase-admin');
import * as admin from 'firebase-admin'
import { Occurence } from './models.ts/classes';
const crypto = require('crypto');
admin.initializeApp();


const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));


export const receiveOccurence = functions.https.onRequest(async (request, response) => {
    const key = 'iot';
    if (request.method != 'POST') {
        response.status(403).send('Forbidden');
        return;
    }

    let user = request.body.source;
    let lt = request.body.lt;
    let ln = request.body.ln;

    user = crypto.decrypt(user, key);
    lt = crypto.decrypt(lt, key);
    ln = crypto.decrypt(ln, key);

    const day = new Date().getDay() + '/' + new Date().getMonth() + '/' + new Date().getFullYear();
    const hour = new Date().getHours() + ':' + new Date().getMinutes();

    const occurence: Occurence = new Occurence(day, hour, { lt, ln });
    await admin.database().ref('/occurences').child(user.uid).push(occurence);
});



    //receive id
    //receive body