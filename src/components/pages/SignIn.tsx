import { useDispatch } from "react-redux";
import Input from "../common/Input";
import InputResult from "../../model/InputResult";
import { authActions } from "../../redux/slices/authSlice";
import LoginData from "../../model/LoginData";
import { authService, ordersService } from "../../config/service-config";
import UserData from "../../model/UserData";
import SignInForm from "../forms/SignInForm";
import OrdersServiceFire from "../../service/crud/OrdersServiceFire";
import { Box } from "@mui/material";
const SignIn: React.FC = () => {
    const dispatch = useDispatch();
    async function submitFn(loginData: LoginData): Promise<InputResult> {
        let inputResult: InputResult = {status: 'error',
         message: "Server unavailable, repeat later on"}
         
        try {
            const res: UserData = await authService.login(loginData);
            res && dispatch(authActions.set(res));
            if ( res?.uid && res.role === 'user') {
            ordersService.setCollectionCartRef(res.uid);
            }

            inputResult = {status: res ? 'success' : 'error',
            message: res ? '' : 'Incorrect Credentials'}
            
        } catch (error) {
            
        }
        return inputResult;
    }
    
    return <Box>
    <SignInForm submitFn={submitFn}
     networks={authService.getAvailableProvider()}
         />
    </Box>

}

 export default SignIn;