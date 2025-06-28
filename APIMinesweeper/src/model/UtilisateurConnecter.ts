import Utilisateur from "./Utilisateur.js"

export default class UtilisateurConnecter extends Utilisateur{


    email : string
    mdp : string

    constructor(email : string,mdp : string){
        super(0) //id TODO
        this.email = email
        this.mdp = mdp
    }
}