import {useDispatch} from 'react-redux';
import { authActions } from '../../redux/slices/authSlice'
import { Button } from '@mui/material';
import CartItem from '../../model/CartItem';
import { useSelectorCart, useSelectorEmployees } from '../../hooks/hooks';
import { ordersService } from '../../config/service-config';
const SignOut: React.FC = () => {
    const dispatch = useDispatch();
    const cartProducts = useSelectorCart();
    const employees = useSelectorEmployees();
   
    const cartContent: CartItem[] = cartProducts.map(e => {
        const employee = employees.find(el => el.id == e.id);
        return {...e, 
            category: employee?.category,
            name: employee?.name,
            description: employee?.description,
            unit:employee?.unit,
            imageLink:employee?.imageLink,
            price: employee?.price,                
            sum: ((employees.find(el => el.id == e.id)?.price)||0) * (e.quantity||0)}
    });
    return <Button onClick={() => {dispatch(authActions.reset());
                               // ordersService.clearCart(cartContent)
                             }}>confirm sign out</Button>
}
 
 export default SignOut;

