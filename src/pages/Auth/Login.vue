<script setup>
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";
import { db } from "../../firebase/firebase";
import GoogleButton from "@/components/GoogleButton.vue";
import { doc, setDoc } from "firebase/firestore";

const router = useRouter();
const email = ref("");
const password = ref("");

const errorMessage = ref("");
const auth = getAuth();
const loading = ref(false);

const login = async (event) => {
  event.preventDefault();

  try {
    loading.value = true;
    const { user } = await signInWithEmailAndPassword(auth, email.value, password.value);

    const userRef = doc(db, "users", user.uid);

    console.log("User logged in:", user);

    await setDoc(
      userRef,
      {
        email: user.email,
        displayName: user.displayName,
        lastLogin: new Date(),
      },
      { merge: true }
    );

    loading.value = false;

    console.log(auth.currentUser);

    router.push("/home");

  } catch (error) {
    loading.value = false;
    console.log(error.message);
    switch (error.code) {
      case "auth/invalid-email":
        errorMessage.value = "Invalid Email.";
        break;
      case "auth/user-not-found":
        errorMessage.value = "User does not exists.";
        break;
      case "auth/wrong-password":
        errorMessage.value = "Incorrect password.";
        break;
      default:
        errorMessage.value = "Email or Password was incorrect.";
        break;
    }
  }
};
</script>
<template>
  <div>
    <div class="grid min-h-screen place-items-center mx-6 lg:mx-0">
      <div class="w-full lg:w-1/3 bg-white ring-1 ring-inset ring-gray-200 rounded-md p-10 shadow-xl">
        <div class="flex items-center gap-2 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8">
            <path
              d="M2.273 5.625A4.483 4.483 0 0 1 5.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 3H5.25a3 3 0 0 0-2.977 2.625ZM2.273 8.625A4.483 4.483 0 0 1 5.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 6H5.25a3 3 0 0 0-2.977 2.625ZM5.25 9a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h13.5a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3H15a.75.75 0 0 0-.75.75 2.25 2.25 0 0 1-4.5 0A.75.75 0 0 0 9 9H5.25Z" />
          </svg>
          <h2 class="text-3xl font-black uppercase">BadyetWise</h2>
        </div>
        <form @submit.prevent="login">
          <div class="mb-4">
            <h1 class="text-2xl font-bold">Log in</h1>
            <p class="text-gray-400">Log into your account</p>
          </div>
          <div>
            <GoogleButton />
          </div>
          <div class="my-6 divider text-gray-500">or</div>
          <div class="mt-2">
            <div>
              <label for="email">Email</label>
              <input id="email" type="email" class="mt-2 block input input-bordered w-full"
                placeholder="Enter your email" v-model="email" required />
            </div>
            <div class="mt-4">
              <label for="password">Password</label>
              <input id="password" type="password" class="mt-2 block input input-bordered w-full"
                placeholder="Enter your password" v-model="password" required />
            </div>
          </div>
          <div>
            <p v-if="errorMessage" class="mt-2 text-red-500">{{ errorMessage }}</p>
          </div>
          <div class="mt-6">
            <button :disabled="loading" type="submit" class="btn btn-primary text-center w-full mb-3">
              {{ loading ? "Logging in" : "Log in" }}
            </button>
          </div>
          <div class="mt-2 text-center text-gray-800">
            <router-link to="/signup"> Don't have an account? Sign up here.</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
