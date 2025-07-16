import express, { Request, Response } from 'express';

let router = express.Router();

// export de notre application vers le serveur principal

import Utilisateur from './model/Utilisateur.js';
import UtilisateurConnecter from './model/UtilisateurConnecter.js';
import UtilisateurAnonyme from './model/UtilisateurAnonyme.js';

import { randomUUID } from 'crypto';


router.get('/test', (req : Request, res : Response) => {
    res.status(200).json('{test: "ok"}');
});

router.get("/player/:id", (req : Request, res : Response) => {

    const id = Number(req.params.id)

    

    const player = (id===-1)?
    {
        name : "user1",
        flag : "fr"
    }:
    {
        name : "user2",
        flag : "fr"
    }
        
    

    res.status(200).json(player);
});

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



export default router