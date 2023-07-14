import LoginData from "../../model/LoginData";
import UserData from "../../model/UserData";
export type NetworkType = {providerName: string, providerIconUrl: string};
export default interface AuthService {
    login(loginData: LoginData):Promise<UserData>;
    logout():Promise<void>;
    getAvailableProvider():NetworkType[]
}