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

export const isBudgetAllocated = async (categoryId) => {
    const q = query(collection(db, "budgets"),
        where("userId", "==", currentUser.value?.uid),
        where("categoryId", "==", categoryId)
    )
    const snapshot = await getDocs(q);

    console.log("isBudgetAllocated", snapshot);
    return !snapshot.empty;
}