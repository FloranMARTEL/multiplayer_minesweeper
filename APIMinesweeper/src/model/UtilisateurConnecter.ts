import Utilisateur from "./Utilisateur.js"

export default class UtilisateurConnecter extends Utilisateur{

    email : string
    mdp : string
    name : string
    photo : string
    flag : string

    constructor(email : string,mdp : string){
        super(0) //id TODO
        this.email = email
        this.mdp = mdp
        this.name = "undefined" // requéparer ces donner via la BD
        this.photo = "undefined"
        this.flag = "undefined"
        
    }
}