import express, { Request, Response } from 'express';

let app = express();

// export de notre application vers le serveur principal
module.exports = app;


app.get('/genres', (req : Request, res : Response) => {
    console.log("bonjour");
    res.status(200).json('{test: "ok"}');
});