<script setup>
import { useAuthGoogle } from "@/composables/useAuthGoogle";
import { setDoc, doc } from "firebase/firestore";

const { signInWithGoogle } = useAuthGoogle();
const auth = useAuthGoogle();

const handleSignInWithGoogle = () => {
  signInWithGoogle()
    .then(async (result) => {
      const user = result.user;
      console.log(user);
      await setDoc(
        doc(auth.db, "users", user.uid),
        {
          email: user.email,
          displayName: user.displayName,
          createdAt: new Date(),
          photoURL: user.photoURL
        },
        { merge: true }
      );
    })
    .catch((error) => {
      console.error("Error signing in with Google:", error);
    });
};
</script>

<template>
  <button type="button" class="btn bg-white text-center w-full ring-1 ring-inset ring-gray-300"
    @click="handleSignInWithGoogle">
    <svg class="w-5 h-5 text-primary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
      fill="currentColor" viewBox="0 0 24 24">
      <path fill-rule="evenodd"
        d="M12.037 21.998a10.313 10.313 0 0 1-7.168-3.049 9.888 9.888 0 0 1-2.868-7.118 9.947 9.947 0 0 1 3.064-6.949A10.37 10.37 0 0 1 12.212 2h.176a9.935 9.935 0 0 1 6.614 2.564L16.457 6.88a6.187 6.187 0 0 0-4.131-1.566 6.9 6.9 0 0 0-4.794 1.913 6.618 6.618 0 0 0-2.045 4.657 6.608 6.608 0 0 0 1.882 4.723 6.891 6.891 0 0 0 4.725 2.07h.143c1.41.072 2.8-.354 3.917-1.2a5.77 5.77 0 0 0 2.172-3.41l.043-.117H12.22v-3.41h9.678c.075.617.109 1.238.1 1.859-.099 5.741-4.017 9.6-9.746 9.6l-.215-.002Z"
        clip-rule="evenodd" />
    </svg>

    Sign in with Google
  </button>
</template>
