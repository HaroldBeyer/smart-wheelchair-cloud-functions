import * as functions from 'firebase-functions';
const cors = require('cors');
import * as express from 'express';
// const admin = require('firebase-admin');
import * as admin from 'firebase-admin'
import { Occurence } from './models.ts/classes';
admin.initializeApp();


const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));


export const receiveOccurence = functions.https.onRequest(async (request, response) => {
    let user;

    if (request.method != 'POST') {
        response.status(403).send('Forbidden');
        return;
    }

    if ((
        !request.headers.authorization ||
        !request.headers.authorization.startsWith('Bearer ')) &&
        !(request.cookies && request.cookies.__session)) {
        response.status(403).send('Unauthorized');
        return;
    }

    let idToken;
    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
        console.log('Found "Authorization" header');
        idToken = request.headers.authorization.split('Bearer ')[1];
    } else if (request.cookies) {
        console.log('Found "__session" cookie');
        idToken = request.cookies.__session;
    } else {
        response.status(403).send('Unauthorized');
        return;
    }

    try {
        const decodedIdToken = await admin.auth().verifyIdToken(idToken);
        console.log('ID Token correctly decoded', decodedIdToken);
        user = decodedIdToken;
        const obj = request.body;
        const occurence: Occurence = new Occurence(obj.day, obj.hour, obj.location);
        admin.database().ref('/occurences').child(user.uid).push(occurence);
        return;
    } catch (error) {
        console.error('Error while verifying Firebase ID token:', error);
        response.status(403).send('Unauthorized');
        return;
    }

});



    //receive id
    //receive body