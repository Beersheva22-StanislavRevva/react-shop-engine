import { Observable, catchError, of } from 'rxjs';
import Product from '../../model/Product';
import ProductsService from './ProductsService';
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
} from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { getRandomInt } from '../../util/random';
import { getISODateStr } from '../../util/date-functions';
const MIN_ID = 100000;
const MAX_ID = 1000000;

function convertProduct(empl: Product, id?: string): any {
    const res: any = { ...empl, id: id ? id : empl.id};
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
export default class ProductsServiceFire implements ProductsService {
    collectionRef: CollectionReference = collection(getFirestore(appFirebase), 'employees');
    async addProduct(empl: Product): Promise<Product> {
        const id: string = await this.getId();
        const employee = convertProduct(empl, id);
        const docRef = this.getDocRef(id);
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
    getProducts(): Observable<string | Product[]> {
        return collectionData(this.collectionRef).pipe(catchError(error => {
            const firestorError: FirestoreError = error;
            const errorMessage = getErrorMessage(firestorError);
            return of(errorMessage)
        })) as Observable<string | Product[]>
    }
    async deleteProduct(id: any): Promise<void> {
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
    async updateProduct(empl: Product): Promise<Product> {
        if (!empl.id || !(await this.exists(empl.id))) {
            throw 'not found';
        }
        const employee = convertProduct(empl);
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
}