import Utilisateur from "./Utilisateur.js"

export default class UtilisateurAnonyme extends Utilisateur {

    static Cptid :number = 0

    constructor(){
        super(--UtilisateurAnonyme.Cptid)
    }
}