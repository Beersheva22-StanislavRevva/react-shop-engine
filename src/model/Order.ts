import CartItem from "./CartItem";

type Order  = {
    id: any,
    cartItems: CartItem[], 
    dateTime: string,
    totalSum: number,
    email: string,
    adress: string,
    phone: string,
    status: string
   
}
export default Order;
