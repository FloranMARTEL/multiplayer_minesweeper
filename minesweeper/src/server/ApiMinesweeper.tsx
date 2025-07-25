
export default class ApiMinesweeper {


    static APIPATH = "http://localhost:5000/api";


    static async GetPlayerResumByID(id: number): Promise<{ userType : string, photo? : string, name: string, flag?: string }> {

        const responce = await fetch(`${ApiMinesweeper.APIPATH}/player/${id}`)
        const json = await responce.json();
        return json
    }

    static async GetPlayerResumByToken(token: string): Promise<{ name: string, flag: string }> {
        const responce = await fetch(`${ApiMinesweeper.APIPATH}/player`, {
            method : 'GET',
            headers : {
                "authorization" : token
            }
        })

        const json = await responce.json();
        return json
    }


    static async GetTokenOfAnonymeUser(): Promise<string> {
        const responce = await fetch(`${ApiMinesweeper.APIPATH}/connection`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: "{}"
        })
        const json = await responce.json();
        return json.token
    }

}