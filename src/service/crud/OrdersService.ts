import { Observable } from "rxjs";
import Employee from "../../model/Employee";

export default interface OrdersService {
    addProdToCart(employee:Employee, email:string, quantity:number): Promise<void>;
    getCartProducts(): Observable<Employee[] | string>;
    deleteCartProduct(id: any): Promise<void>;
    updateCartProduct(empl: Employee): Promise<Employee>;
}