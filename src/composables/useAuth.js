import { auth } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref } from "vue";

export const currentUser = ref(null);

export function useAuth() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser.value = user;
        } else {
            currentUser.value = null;
        }
    })
}