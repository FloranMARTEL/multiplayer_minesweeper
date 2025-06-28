import UtilisateurAnonyme from "./UtilisateurAnonyme.js"

export default abstract class Utilisateur{

    static Utilisateurs : { [key:string] : Utilisateur } = {};

    id : number

    constructor(id : number){
        this.id = id
    }

    static AddUser(token: string,user : Utilisateur) : void{
        console.log(`new user ${token}`)
        Utilisateur.Utilisateurs[token] = user
    }

    static GetUser(token : string) : Utilisateur | null{
        return Utilisateur.Utilisateurs[token] ? Utilisateur.Utilisateurs[token] : null
    }

}