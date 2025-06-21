<script setup>
import { ref } from "vue";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "vue-router";
import GoogleButton from "@/components/GoogleButton.vue";
import { db } from "../../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";

const router = useRouter();
const fullName = ref("");
const email = ref("");
const password = ref("");
const errorMessage = ref("");

//auth
const auth = getAuth();
//loading state
const loading = ref(false);

// Function to handle user registration
const register = async (event) => {
  event.preventDefault();

  try {
    //
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    loading.value = true;

    // Update the user's profile with the full name
    await updateProfile(user, {
      displayName: fullName.value,
    });

    // Save the user data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      createdAt: new Date(),
      displayName: fullName.value,
    });

    console.log("Successfully registered and saved user to Firestore!", user);

    loading.value = false;

    router.push("/home");
  } catch (error) {
    loading.value = false;

    console.error("Error code:", error.code);
    console.error("Error message:", error.message);

    switch (error.code) {
      case "auth/invalid-email":
        errorMessage.value = "Invalid email address.";
        break;
      case "auth/email-already-in-use":
        errorMessage.value =
          "This email address is already in use. Please use a different email.";
        break;
      case "auth/weak-password":
        errorMessage.value = "The password must be 6 characters long or more.";
        break;
    }
  } finally {
    loading.value = false;
  }
};
</script>
<template>
  <div>
    <div class="grid min-h-screen place-items-center mx-6 lg:mx-0">
      <div class="lg:w-1/3 bg-white rounded-md ring-1 ring-inset ring-gray-200 p-10 shadow-xl container">
        <div class="flex items-center gap-2 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8">
            <path
              d="M2.273 5.625A4.483 4.483 0 0 1 5.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 3H5.25a3 3 0 0 0-2.977 2.625ZM2.273 8.625A4.483 4.483 0 0 1 5.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 6H5.25a3 3 0 0 0-2.977 2.625ZM5.25 9a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h13.5a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3H15a.75.75 0 0 0-.75.75 2.25 2.25 0 0 1-4.5 0A.75.75 0 0 0 9 9H5.25Z" />
          </svg>
          <h2 class="text-3xl font-black uppercase">BadyetWise</h2>
        </div>
        <form @submit.prevent="register">
          <div class="mb-4">
            <h1 class="text-2xl font-bold">Sign in</h1>
            <p class="text-gray-400">Create your account</p>
          </div>
          <div>
            <GoogleButton />
          </div>
          <div class="my-6 divider text-gray-500">or</div>
          <div>
            <div>
              <label for="fullName">Full Name</label>
              <input id="fullName" type="text" class="mt-2 block input input-bordered rounded-md w-full"
                placeholder="Enter your Full Name" v-model="fullName" required />
            </div>
            <div class="mt-4">
              <label for="email">Email</label>
              <input id="email" type="email" class="mt-2 block input input-bordered rounded-md w-full"
                placeholder="Enter your email" v-model="email" required />
            </div>
            <div class="mt-4">
              <label for="password">Password</label>
              <input id="password" type="password" class="mt-2 block input input-bordered rounded-md w-full"
                placeholder="Enter your password" v-model="password" required />
            </div>
          </div>
          <div>
            <p v-if="errorMessage" class="mt-2 text-red-500">{{ errorMessage }}</p>
          </div>
          <div class="mt-6">
            <button :disabled="loading" type="submit" class="btn btn-primary text-center rounded-md w-full mb-3">
              {{ loading ? "Signing in..." : "Sign in" }}
            </button>
          </div>
          <div class="mt-1 text-center text-gray-800">
            <router-link to="/login">Already have an account? Log in here. </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
