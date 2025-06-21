<script setup>
const socialProofs = [
  {
    name: "Kulas",
    role: "Porman",
    testimonial:
      "BadyetWise completely changed how I manage my finances. The insights are incredible and have helped me save over $500 per month.",
    image: "https://i.pinimg.com/474x/21/2a/cd/212acd3d51dc7661ed91c95e3b70d65c.jpg",
  },
  {
    name: "Gina Col",
    role: "Software Gingineer",
    testimonial:
      "I love how easy it is to track my expenses. The app is intuitive and has made budgeting a breeze.",
    image: "https://i.pinimg.com/736x/4d/13/13/4d13135ef1d77ed91ce80334ceab6ef5.jpg",
  },
  {
    name: "Jaja Coleen",
    role: "Product Manager",
    testimonial:
      "The analytics features are top-notch. I can see where my money goes and make informed decisions.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE_PlvOF5q2z8eQs5730icDfRU61gSX9_YjWBa7ciNeRmlYLh7Dq50qOtfhTXHck9rz-M&usqp=CAU",
  },
];
</script>
<template>
  <section class="py-20 lg:py-32 lg:pb-48 w-full">
    <div class="text-center">
      <h1 class="text-6xl font-extrabold">Loved by thousands of users</h1>
      <p class="text-2xl pt-6 text-gray-500">
        See what our customers have to say about Bugdet Tracker
      </p>
    </div>
    <div class="pt-16">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-8">
        <!-- Loop through each social proof -->
        <div v-for="(proof, index) in socialProofs" :key="index"
          class="bg-white p-10 ring-1 ring-inset ring-base-300 rounded-lg shadow-md flex flex-col justify-between w-full">
          <div class="flex items-center">
            <!--Display Stars-->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5"
              v-for="index in 5" :key="index">
              <path fill-rule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <div class="pt-4">
            <p class="text-gray-500">
              {{ proof.testimonial }}
            </p>
          </div>
          <div class="flex items-center gap-3 pt-6">
            <div class="avatar">
              <div class="w-12 rounded-full">
                <img :src="proof.image" />
              </div>
            </div>
            <div>
              <h2 class="font-medium">{{ proof.name }}</h2>
              <p class="text-sm text-gray-500">{{ proof.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-center flex-wrap"></div>
  </section>
</template>
