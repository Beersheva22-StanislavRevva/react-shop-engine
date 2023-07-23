import { Observable, catchError, of } from 'rxjs';
import Product from '../../model/Product';
import appFirebase from '../../config/firebase-config';
import {
    CollectionReference,
    DocumentReference,
    getFirestore,
    collection,
    getDoc,
    FirestoreError,
    setDoc,
    deleteDoc,
    doc,
    getDocs,
    getCountFromServer,
} from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { getRandomInt } from '../../util/random';
import { getISODateStr } from '../../util/date-functions';
import OrdersService from './OrdersService';
import { useSelectorAuth } from '../../redux/store';
import Order from '../../model/Order';
import CartItem from '../../model/CartItem';
import { getAuth } from 'firebase/auth';
import UserData from '../../model/UserData';
const MIN_ID = 100000;
const MAX_ID = 1000000;

function convertEmployee(empl: Product, id?: string): any {
    const res: any = { ...empl, id: id ? id : empl.id/*, birthDate: getISODateStr(empl.birthDate)*/ };
    return res;
}
function getErrorMessage(firestoreError: FirestoreError): string {
    let errorMessage = '';
    switch (firestoreError.code) {
        case 'unauthenticated':
        case 'permission-denied':
            errorMessage = 'Authentication';
            break;
        default:
            errorMessage = firestoreError.message;
    }
    return errorMessage;
}
export default class OrdersServiceFire implements OrdersService {

userDataJson = localStorage.getItem('auth-item') || '';

getUserData() {
while (this.userDataJson === "") {
    this.userDataJson = localStorage.getItem('auth-item') || ''; 
}
}


    //userData = useSelectorAuth();
    cartId:string = getRandomInt(MIN_ID, MAX_ID).toString();
    collectionCartRef: CollectionReference = collection(getFirestore(appFirebase), `users/${this.cartId}/cart`);
    collectionOrdersRef: CollectionReference = collection(getFirestore(appFirebase), 'orders');
       
    async addProdToCart(empl: Product | null, email: string, quantity: number): Promise<void> {
        const isExist = await this.cartExists(empl?.id);
        const docRef = this.getCartDocRef(empl?.id);
        let employee;
        if (!isExist) {
            employee = { id: empl?.id, quantity: quantity}
        } else {
            const employeeRecent = await getDoc(docRef);
            const quant = employeeRecent.get("quantity");
            employee = { id: empl?.id, quantity: (quant + quantity)}
        }
        try {
            await setDoc(docRef, employee);
        } catch (error: any) {
            const firestorError: FirestoreError = error;
            const errorMessage = getErrorMessage(firestorError);
            throw errorMessage;
        }

    }
    
    getCartProducts(): Observable<string | any[]> {
        return collectionData(this.collectionCartRef).pipe(catchError(error => {
            const firestorError: FirestoreError = error;
            const errorMessage = getErrorMessage(firestorError);
            return of(errorMessage)
        })) as Observable<string | any[]>
    }
    async deleteCartProduct(id: any): Promise<void> {
        const docRef = this.getCartDocRef(id);
        if (!(await this.cartExists(id))) {
            throw 'not found';
        }
        try {
            await deleteDoc(docRef);
        } catch (error: any) {
            const firestorError: FirestoreError = error;
            const errorMessage = getErrorMessage(firestorError);
            throw errorMessage;
        }
    }
    async updateCartProduct(empl: Product): Promise<Product> {
        if (!empl.id || !(await this.cartExists(empl.id))) {
            throw 'not found';
        }
        //const employee = convertEmployee(empl);
        const docRef = this.getCartDocRef(empl.id);
        try {
            await setDoc(docRef, empl);
        } catch (error: any) {
            const firestorError: FirestoreError = error;
            const errorMessage = getErrorMessage(firestorError);
            throw errorMessage;
        }
        return empl;
    }
    
    
    private getCartDocRef(id: string): DocumentReference {
        return doc(this.collectionCartRef, id);
    }

    private getOrderDocRef(id: string): DocumentReference {
        return doc(this.collectionOrdersRef, id);
    }

    private async cartExists(id: string): Promise<boolean> {
        const docRef: DocumentReference = this.getCartDocRef(id);
        const docSnap = await getDoc(docRef);
        return docSnap.exists();
    }

    private async orderExists(id: string): Promise<boolean> {
        const docRef: DocumentReference = this.getOrderDocRef(id);
        const docSnap = await getDoc(docRef);
        return docSnap.exists();
    }

    private async getId(): Promise<string> {
        let id: string = '';
        do {
            id = getRandomInt(MIN_ID, MAX_ID).toString();
        } while (await this.cartExists(id));
        return id;
    }

    clearCart(cartItems:CartItem[]):void {
        cartItems.forEach(e => this.deleteCartProduct(e.id));
    }
    
   async addOrder(cartItems:CartItem[], adress:string, phone:string, totalSum:number, email?:string,):Promise<void> {
        
        const cartItemsFixed = cartItems.map(e=>e);
        const date = getISODateStr(new Date());
        const id = await this.getOrderId();
        const order = {id:id,
                       cartItems:cartItemsFixed,
                       dateTime: date,
                       totalSum: totalSum,
                       email: email,
                       adress: adress,
                       phone: phone,
                       status: 'created'                       
                      }
                      
        const docRef = this.getOrderDocRef(String(id));
        try {
            await setDoc(docRef, order);
        } catch (error: any) {
            const firestorError: FirestoreError = error;
            const errorMessage = getErrorMessage(firestorError);
            throw errorMessage;
        }
    }
    getOrders(): Observable<string | any[]> {
          return collectionData(this.collectionOrdersRef).pipe(catchError(error => {
            const firestorError: FirestoreError = error;
            const errorMessage = getErrorMessage(firestorError);
            return of(errorMessage)
        })) as Observable<string | any[]>
    }
    async updateOrder(order: Order): Promise<Order> {
        const id = String(order.id);
        if (!order.id || !(await this.orderExists(id))) {
            throw 'not found';
        }
        //const employee = convertEmployee(order);
        const docRef = this.getOrderDocRef(id);
        try {
            await setDoc(docRef, order);
        } catch (error: any) {
            const firestorError: FirestoreError = error;
            const errorMessage = getErrorMessage(firestorError);
            throw errorMessage;
        }
        return order;
    }
    async getOrderId():Promise<number> {
    const snapshot = await getCountFromServer(this.collectionOrdersRef);
    return snapshot.data().count + 1;
    }
}