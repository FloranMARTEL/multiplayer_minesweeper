import ApiMinesweeper from "./ApiMinesweeper"
import Cookies from "js-cookie";


export default class TokenManager {

    private static TOKEN: string | null = null

    static async GetToken() {
        if (TokenManager.TOKEN === null) {
            const tokenFromCookie = Cookies.get("token");
            let user = null
            if (tokenFromCookie) {
                TokenManager.TOKEN = tokenFromCookie
                user = await ApiMinesweeper.GetPlayerResumByToken(tokenFromCookie)
            }

            if (user == null){
                TokenManager.TOKEN = await ApiMinesweeper.GetTokenOfAnonymeUser()
            }
            const dateExpiration = new Date(new Date().getTime() + 60 * 60 * 1000);
            Cookies.set("token", TokenManager.TOKEN as string, { expires: dateExpiration, path: "/" });


        }
        return TokenManager.TOKEN as string
    }


    static ClearToken() {
        TokenManager.TOKEN = null;
        Cookies.remove("token", { path: "/" });
    }

}