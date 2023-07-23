
import AuthService from "../service/auth/AuthService";
import ProductsService from "../service/crud/ProductsService";
import ProductsServiceFire from "../service/crud/ProductsServiceFire";
import AuthServiceFire from "../service/auth/AuthServiceFire";
import OrdersServiceFire from "../service/crud/OrdersServiceFire";

export const authService: AuthService =
 new AuthServiceFire();
 export const productService: ProductsService = 
    new ProductsServiceFire();
export const ordersService = new OrdersServiceFire();