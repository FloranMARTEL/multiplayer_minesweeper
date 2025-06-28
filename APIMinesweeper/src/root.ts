import express, { Request, Response } from 'express';

let router = express.Router();

// export de notre application vers le serveur principal

import Utilisateur from './model/Utilisateur.js';
import UtilisateurConnecter from './model/UtilisateurConnecter.js';
import UtilisateurAnonyme from './model/UtilisateurAnonyme.js';

import { randomUUID } from 'crypto';


router.post('/connection',(req : Request, res : Response)=>{
    const email = req.body.email
    const mdp = req.body.mdp
    const token  = randomUUID() as string;

    if (email && mdp){
        Utilisateur.AddUser(token,new UtilisateurConnecter(email,mdp))
    }else{
        Utilisateur.AddUser(token,new UtilisateurAnonyme())
    }

    res.status(200).json({
        token : token
    })

})

router.get('/test', (req : Request, res : Response) => {
    res.status(200).json('{test: "ok"}');
});


export default router