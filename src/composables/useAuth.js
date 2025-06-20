import { auth, db } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref } from "vue";

export const currentUser = ref(null);

export function useAuth() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            currentUser.value = user;

        } else {
            currentUser.value = null;
        }
    })
}