import LoginData from "../../model/LoginData";
import UserData from "../../model/UserData";
import AuthService from "./AuthService";
import { getFirestore, collection, getDoc, doc, setDoc, FirestoreError } from "firebase/firestore";
import { AuthProvider, GoogleAuthProvider, TwitterAuthProvider, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import appFirebase from "../../config/firebase-config";
const mapProviders: Map<string, AuthProvider> = new Map([
    ['GOOGLE', new GoogleAuthProvider()],
    ['TWITER', new TwitterAuthProvider()]

])
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
export default class AuthServiceFire implements AuthService {
    getAvailableProvider(): { providerName: string; providerIconUrl: string; }[] {
        return [{ providerName: 'GOOGLE', providerIconUrl: "https://img.icons8.com/color/2x/google-logo.png" },
        ]
    }
    private auth = getAuth(appFirebase);
    private administrators = collection(getFirestore(appFirebase), 'administrators');
    private users = collection(getFirestore(appFirebase), 'users');

    private async isAdmin(uid: any): Promise<boolean> {
        const docRef = doc(this.administrators, uid)
        return (await getDoc(docRef)).exists();
    }



    async addNewUser(loginData: LoginData) {
        let userData: UserData = null;
        try {
            const userAuth = !loginData.password ?
                await signInWithPopup(this.auth, mapProviders.get(loginData.email)!) :
                await createUserWithEmailAndPassword(this.auth, loginData.email,
                    loginData.password);
            userData = {
                email: userAuth.user.email as string,
                role: await this.isAdmin(userAuth.user.uid) ? 'admin' : 'user',
            }

           const docRef = doc(this.users, userAuth.user.uid)
            if (!(await getDoc(docRef)).exists()) {
                try {
                    await setDoc(docRef, { email: userAuth.user.email });
                } catch (error: any) {
                    const firestorError: FirestoreError = error;
                    const errorMessage = getErrorMessage(firestorError);
                    throw errorMessage;
                }
            } else {
                const errorMessage = "Unable to register. User is already exist";
                throw errorMessage;
            }

        } catch (error: any) {
            console.log(error.code, error)
        }
        return userData;
    }




    async login(loginData: LoginData): Promise<UserData> {
        let userData: UserData = null;
        try {
            const userAuth = !loginData.password ?
                await signInWithPopup(this.auth, mapProviders.get(loginData.email)!) :
                await signInWithEmailAndPassword(this.auth, loginData.email,
                    loginData.password);
            userData = {
                email: userAuth.user.email as string,
                role: await this.isAdmin(userAuth.user.uid) ? 'admin' : 'user',
                uid: userAuth.user.uid as string
            }


        } catch (error: any) {
            console.log(error.code, error)
        }
        
        return userData;
    }
    logout(): Promise<void> {
        return signOut(this.auth);
    }

}