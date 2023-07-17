import { Observable } from "rxjs";
import Employee from "../../model/Employee";

export default interface OrdersService {
    addProdToCart(employee:Employee, email:string, quantity:number): Promise<void>;
    getProducts(): Observable<Employee[] | string>;
    deleteProducts(id: any): Promise<void>;
    updateProducts(empl: Employee): Promise<Employee>;
}