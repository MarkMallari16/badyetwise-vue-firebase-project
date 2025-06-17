import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";

export function useAuthGoogle() {
    const user = ref(null);
    const router = useRouter();
    const errorMessage = ref(null);

    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();

        signInWithPopup(getAuth(), provider)
            .then((result) => {
                user.value = result.user;
                router.push("/home")
            })
            .catch(error => {
                errorMessage.value = error.message;
                console.error(error.message)
            })
    }
    return { signInWithGoogle, user, errorMessage };
}