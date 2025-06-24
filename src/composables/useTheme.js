import { ref, watch } from "vue";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const theme = ref(localStorage.getItem("theme") || "lofi");

export function useTheme() {
    //apply the theme based on the user's preference or system setting
    const applyTheme = () => {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (theme.value === "system") {
            theme.value = prefersDark ? "dark" : "lofi";
        }
        document.documentElement.setAttribute("data-theme", theme.value);
    };

    //firebase get  functions to load and save user theme
    const loadUserTheme = async (user) => {
        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists() && userSnap.data().theme) {
            const userTheme = userSnap.data().theme;
            theme.value = userTheme;
            localStorage.setItem("theme", userTheme);
            applyTheme();
        } else {
            applyTheme();
        }
    };

    //firebase set function to save user theme
    const saveUserTheme = async (user) => {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { theme: theme.value }, { merge: true });
    };

    const getCurrentTheme = () => theme.value;

    // Check localStorage for theme preference
    onAuthStateChanged(getAuth(), async (user) => {
        if (user) {
            await loadUserTheme(user);
            watch(theme, async (newTheme, oldTheme) => {
                if (newTheme !== oldTheme) {
                    applyTheme();
                    const user = getAuth().currentUser;
                    await saveUserTheme(user);
                    localStorage.setItem("theme", newTheme);
                }
            });
        } else {
            theme.value = "lofi"
            localStorage.setItem("theme", "lofi");
        }
    });

    return {
        theme,
        applyTheme,
        getCurrentTheme
    };
}
