import { useDispatch } from "react-redux";
import Input from "../common/Input";
import InputResult from "../../model/InputResult";
import { authActions } from "../../redux/slices/authSlice";
import LoginData from "../../model/LoginData";
import { authService } from "../../config/service-config";
import UserData from "../../model/UserData";
import SignInForm from "../forms/SignInForm";
import OrdersServiceFire from "../../service/crud/OrdersServiceFire";
import { Box } from "@mui/material";
import SignUpForm from "../forms/SignUpForm";
const SignUp: React.FC = () => {
    const dispatch = useDispatch();
    async function submitFn(loginData: LoginData): Promise<InputResult> {
        let inputResult: InputResult = {status: 'error',
         message: "Server unavailable, repeat later on"}
         
        try {
            const res: UserData = await authService.addNewUser(loginData);
            res && dispatch(authActions.set(res));
            // if (res?.role === 'user') {
            //     const userCartService = new OrdersServiceFire();
            // }
            inputResult = {status: res ? 'success' : 'error',
            message: res ? '' : 'Unuinque email, please enter another email'}
            
        } catch (error) {
            
        }
        return inputResult;
    }
    return <Box>
    <SignUpForm submitFn={submitFn}
     networks={authService.getAvailableProvider()}
         />
    </Box>

}

 export default SignUp;