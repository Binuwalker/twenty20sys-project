import {
    loginFail,
    loginRequest,
    loginSuccess,
    // registerRequest,
    // registerSuccess,
    // registerFail,
    loadUserRequest,
    loadUserSuccess,
    loadUserFail,
    logoutSuccess,
    logoutFail
} from "../slices/authSlice";
import { auth, firebasedb } from "../firebase/config";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export const login = ({ email, password }) => async (dispatch) => {
    try {
        dispatch(loginRequest());
        const q = query(collection(firebasedb, "users"), where("email", "==", email));
        const querySnap = await getDocs(q);
        const userData = querySnap.docs[0].data();
        const res = await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem('reconcile_userKey', JSON.stringify(res.user.uid));
        dispatch(loginSuccess(userData));
    } catch (error) {
        dispatch(loginFail(error.message));
    }
}
// export const register = (userData) => async (dispatch) => {
//     try {
//         dispatch(registerRequest())
//         const config = {
//             headers: {
//                 'content-type': 'multipart/form-data'
//             }
//         }
//         const { data } = await axios.post('/api/v1/register', userData, config)
//         dispatch(registerSuccess(data))
//     } catch (error) {
//         dispatch(registerFail(error.response.data.message))
//     }
// }



export const loadUser = async (dispatch) => {



    const userLocalId = JSON.parse(localStorage.getItem('reconcile_userKey')) ? JSON.parse(localStorage.getItem('reconcile_userKey')) : null;

    try {
        dispatch(loadUserRequest())
        if (userLocalId) {
            const userDocRef = doc(firebasedb, "users", userLocalId);
            const snap = await getDoc(userDocRef);
            const userData = snap?.data();
            dispatch(loadUserSuccess(userData))
        } else if (!userLocalId || userLocalId === undefined || userLocalId === null) {
            dispatch(loadUserFail("User Key not found"));
        }
        
    } catch (error) {
        dispatch(loadUserFail(error.message))
    }
}
export const logout = async (dispatch) => {
    try {
        signOut(auth);
        localStorage.removeItem('reconcile_userKey');
        dispatch(logoutSuccess());
    } catch (error) {
        dispatch(logoutFail(error.message))
    }
}
