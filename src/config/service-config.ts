
import AuthService from "../service/auth/AuthService";
import EmployeesService from "../service/crud/EmployeesService";
import EmployeesServiceFire from "../service/crud/EmployeesServiceFire";
import AuthServiceFire from "../service/auth/AuthServiceFire";
import OrdersServiceFire from "../service/crud/OrdersServiceFire";

export const authService: AuthService =
 new AuthServiceFire();
 export const employeesService: EmployeesService = 
    new EmployeesServiceFire();
export const ordersService = new OrdersServiceFire();