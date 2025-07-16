
export default class ApiMinesweeper{


    static APIPATH = "http://localhost:5000/api";

    
    static async GetPlayerResumByID(id:number) : Promise<{name : string, flag:string}> {

        const responce = await fetch(`${ApiMinesweeper.APIPATH}/player/${id}`)
        const json = await responce.json();
        console.log(json)
        return json
    }
}