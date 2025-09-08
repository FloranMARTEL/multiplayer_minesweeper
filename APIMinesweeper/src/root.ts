import express, { Request, Response } from 'express';

let router = express.Router();

// export de notre application vers le serveur principal

import Utilisateur from './model/Utilisateur.js';
import UtilisateurConnecter from './model/UtilisateurConnecter.js';
import UtilisateurAnonyme from './model/UtilisateurAnonyme.js';

import { randomUUID } from 'crypto';
import { util } from 'undici';


router.get('/test', (req : Request, res : Response) => {
    res.status(200).json({test: "ok"});
});

router.get("/player/:id", (req : Request, res : Response) => {

    const id = Number(req.params.id)
    const player = (id < 0)?
        {
            userType : "Anonyme",
            name:"Unknow"+id.toString()
        }
    :
        {
            userType : "Connected",
            name:"TODO",
            flag : "fr"

        }    

    res.status(200).json(player);
});

router.get("/player", (req : Request, res : Response) => {
    const token = req.headers.authorization as string
    const user = Utilisateur.GetUser(token)
    
    if (user === null){
        res.json({
            message:"Erreur l'utilisateur n'existe pas"
        })
        return
    }

    if (user instanceof UtilisateurAnonyme){
        res.json({
            userType : "Anonyme",
            id : user.id,
            name : "Unknow"+user.id.toString()
        })
    }else if (user instanceof UtilisateurConnecter){
        res.json({
            userType : "Connecter",
            id : user.id,
            name : user.name,
            photo : user.photo,
            flag : user.flag
        })
    }
})


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