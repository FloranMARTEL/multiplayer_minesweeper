console.log("Server Start")


import express, { Request, Response } from 'express';

let app = express();

app.use('/api', require('./root.js'));






app.listen(5000)