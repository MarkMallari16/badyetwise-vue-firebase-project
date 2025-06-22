import { onMounted, ref, watch } from "vue";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const theme = ref(localStorage.getItem("theme") || "lofi");
let initialized = false;

export function useTheme() {
    if (initialized) return { theme };
    initialized = true;

    const applyTheme = () => {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const selectedTheme =
            theme.value === "system"
                ? prefersDark ? "dark" : "lofi"
                : theme.value;

        document.documentElement.setAttribute("data-theme", selectedTheme);
    };

    const loadUserTheme = async (user) => {
        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists() && userSnap.data().theme) {
            const userTheme = userSnap.data().theme;
            theme.value = userTheme;
            localStorage.setItem("theme", userTheme);
            applyTheme(); // Apply user's theme
        } else {
            applyTheme(); // fallback
        }
    };

    const saveUserTheme = async (user) => {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { theme: theme.value }, { merge: true });
    };

    // 🚨 Do this early — NOT in onMounted
    onAuthStateChanged(getAuth(), async (user) => {
        if (user) {
            await loadUserTheme(user); // Load + apply user theme

            // Sync changes to Firestore and localStorage
            watch(theme, async (newTheme, oldTheme) => {
                if (newTheme !== oldTheme) {
                    applyTheme();
                    await saveUserTheme(user);
                    localStorage.setItem("theme", newTheme);
                }
            });
        } else {
            theme.value = "lofi";
            localStorage.setItem("theme", "lofi");
            applyTheme();
        }
    });

    // 🌅 Apply theme from localStorage fast before app mounts
    onMounted(() => {
        applyTheme(); // use localStorage for quick visual match
    });

    return {
        theme,
        applyTheme,
    };
}
