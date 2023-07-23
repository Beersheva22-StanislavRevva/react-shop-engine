import { Observable } from "rxjs";
import Product from "../../model/Product";

export default interface OrdersService {
    addProdToCart(employee:Product, email:string, quantity:number): Promise<void>;
    getCartProducts(): Observable<Product[] | string>;
    deleteCartProduct(id: any): Promise<void>;
    updateCartProduct(empl: Product): Promise<Product>;
}