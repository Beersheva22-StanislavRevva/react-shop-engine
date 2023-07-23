import { Observable } from "rxjs";
import Product from "../../model/Product";

export default interface ProductsService {
    addProduct(empl: Product): Promise<Product>;
    getProducts(): Observable<Product[] | string>;
    deleteProduct(id: any): Promise<void>;
    updateProduct(empl: Product): Promise<Product>;
}