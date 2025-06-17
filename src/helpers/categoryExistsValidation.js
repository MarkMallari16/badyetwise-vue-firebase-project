import { db } from "@/firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { currentUser } from "@/composables/useAuth";

export const categoryExists = async (name, type) => {
    const q = query(collection(db, "categories"),
        where("userId", "==", currentUser.value?.uid),
        where("name", "==", name),
        where("type", "==", type)
    )
    const snapshot = await getDocs(q);

    return !snapshot.empty;
}