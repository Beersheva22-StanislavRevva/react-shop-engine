import {useDispatch} from 'react-redux';
import { authActions } from '../../redux/slices/authSlice'
import { Button } from '@mui/material';
const SignOut: React.FC = () => {
    const dispatch = useDispatch();
    return <Button onClick={() => dispatch(authActions.reset())}>confirm sign out</Button>
}
 
 export default SignOut;

