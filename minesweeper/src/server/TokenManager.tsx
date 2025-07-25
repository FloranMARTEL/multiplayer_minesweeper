import ApiMinesweeper from "./ApiMinesweeper"

export default class TokenManager{

    private static TOKEN : string | null = null

    static async GetToken(){
        if ( TokenManager.TOKEN === null ){
            TokenManager.TOKEN = await ApiMinesweeper.GetTokenOfAnonymeUser()
            return TokenManager.TOKEN
        }
        return TokenManager.TOKEN
    }

}