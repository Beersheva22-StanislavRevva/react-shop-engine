import { Observable, catchError, of } from 'rxjs';
import Employee from '../../model/Employee';
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
} from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { getRandomInt } from '../../util/random';
import { getISODateStr } from '../../util/date-functions';
import OrdersService from './OrdersService';
const MIN_ID = 100000;
const MAX_ID = 1000000;

function convertEmployee(empl: Employee, id?: string): any {
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
    collectionRef: CollectionReference = collection(getFirestore(appFirebase), 'users/VlfiDBrthJcjq1Q1ecEFU0izFIU2/cart');
   
    async addProdToCart(empl: Employee | null, email: string, quantity: number): Promise<void> {
        const isExist = await this.exists(empl?.id);
        const docRef = this.getDocRef(empl?.id);
        let employee;
        if (!isExist) {
            const length: number = (await getDocs(this.collectionRef)).size;
            employee = { ...empl, quantity: quantity, serial: (length + 1) }
        } else {
            const employeeRecent = await getDoc(docRef);
            const quant = employeeRecent.get("quantity");
            const serial = employeeRecent.get("serial");
            employee = { ...empl, quantity: (quant + 1), serial: (serial) }
        }
        try {
            await setDoc(docRef, employee);
        } catch (error: any) {
            const firestorError: FirestoreError = error;
            const errorMessage = getErrorMessage(firestorError);
            throw errorMessage;
        }

    }
    
    getProducts(): Observable<string | Employee[]> {
        return collectionData(this.collectionRef).pipe(catchError(error => {
            const firestorError: FirestoreError = error;
            const errorMessage = getErrorMessage(firestorError);
            return of(errorMessage)
        })) as Observable<string | Employee[]>
    }
    async deleteProducts(id: any): Promise<void> {
        const docRef = this.getDocRef(id);
        if (!(await this.exists(id))) {
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
    async updateProducts(empl: Employee): Promise<Employee> {
        if (!empl.id || !(await this.exists(empl.id))) {
            throw 'not found';
        }
        const employee = convertEmployee(empl);
        const docRef = this.getDocRef(empl.id);
        try {
            await setDoc(docRef, employee);
        } catch (error: any) {
            const firestorError: FirestoreError = error;
            const errorMessage = getErrorMessage(firestorError);
            throw errorMessage;
        }
        return employee;
    }
    
    
    private getDocRef(id: string): DocumentReference {
        return doc(this.collectionRef, id);
    }
    private async exists(id: string): Promise<boolean> {
        const docRef: DocumentReference = this.getDocRef(id);
        const docSnap = await getDoc(docRef);
        return docSnap.exists();
    }
    private async getId(): Promise<string> {
        let id: string = '';
        do {
            id = getRandomInt(MIN_ID, MAX_ID).toString();
        } while (await this.exists(id));
        return id;
    }
    
}