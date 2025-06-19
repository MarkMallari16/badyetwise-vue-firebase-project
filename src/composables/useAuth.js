import { auth, db } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref } from "vue";

export const currentUser = ref(null);

export function useAuth() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            currentUser.value = user;

            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    email: user.email,
                    createdAt: new Date().toISOString()
                })
            }
             console.log("User document created in Firestore");

        } else {
            currentUser.value = null;
        }
    })
}