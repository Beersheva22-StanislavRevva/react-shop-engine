import { Observable } from "rxjs";
import Employee from "../../model/Employee";

export default interface OrdersService {
    addProdToCart(employee:Employee, email:string, quantity:number): Promise<void>;
    getCartProducts(): Observable<Employee[] | string>;
    deleteCartProducts(id: any): Promise<void>;
    updateCartProducts(empl: Employee): Promise<Employee>;
}