<script setup>
import Hero from "@/components/Hero.vue";
import Navbar from "@/components/Navbar.vue";
import Pricing from "@/components/Pricing.vue";
import Bar from "@/components/Bar.vue";
import Footer from "@/components/Footer.vue";
import Features from "@/components/Features.vue";
import SocialProof from "@/components/SocialProof.vue";
import { ref } from "vue";
import { delay, motion, useScroll } from "motion-v";

const features = ref(null);
const pricing = ref(null);

const scrollToSection = (section) => {
  const sections = {
    features: features.value,
    pricing: pricing.value,
  };
  const target = sections[section]?.$el || document.getElementById(section);
  if (target && typeof target.scrollIntoView === "function") {
    target.scrollIntoView({ behavior: "smooth" });
  }
};

const { scrollYProgress } = useScroll();
const scrollIndicator = {
  scaleX: scrollYProgress,
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  height: "10px",
  originX: 0,
  backgroundColor: "#000000",
};

</script>
<template>
  <section class="relative overflow-hidden">
    <motion.div class="origin-left bg-primary fixed top-0 right-0 left-0 h-3" id="scrollIndicator"
      :style="scrollIndicator" />
    <div>
      <div>
        <div>
          <Navbar @scrollTo="scrollToSection" />
        </div>
        <motion.div :initial="{
          x: -50,
          opacity: 0,
        }" :whileInView="{ x: 0, opacity: 1 }" :transition="{ delay: 0.1, ease: 'easeInOut' }">
          <Hero />
        </motion.div>
        <motion.div ref="features" :initial="{ y: -50, opacity: 0 }" :whileInView="{ y: 0, opacity: 1 }"
          :transition="{ delay: 0.3, ease: 'easeInOut' }" class="container mx-auto px-4">
          <Features />
        </motion.div>
        <div>
          <Bar />
        </div>
        <div class="container mx-auto px-4">
          <SocialProof />
        </div>
        <motion.div ref="pricing">
          <Pricing />
        </motion.div>
      </div>
      <Footer />
    </div>
    <!-- Decorative SVG -->
    <motion.div :initial="{ y: -50, opacity: 0 }" :whileInView="{ y: 0, opacity: 1 }"
      :transition="{ delay: 0.3, ease: 'easeInOut' }" class="absolute top-[12%] -left-32 hidden lg:block">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-96 rotate-12">
        <path d="M12 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
        <path fill-rule="evenodd"
          d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 14.625v-9.75ZM8.25 9.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM18.75 9a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V9.75a.75.75 0 0 0-.75-.75h-.008ZM4.5 9.75A.75.75 0 0 1 5.25 9h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V9.75Z"
          clip-rule="evenodd" />
        <path
          d="M2.25 18a.75.75 0 0 0 0 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 0 0-.75-.75H2.25Z" />
      </svg>
    </motion.div>
    <motion.div :initial="{ x: -50, opacity: 0 }" :whileInView="{ x: 0, opacity: 1 }"
      :transition="{ delay: 0.6, ease: 'easeInOut' }" class="absolute top-48 -right-52 hidden lg:block">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-96 -rotate-45">
        <path
          d="M2.273 5.625A4.483 4.483 0 0 1 5.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 3H5.25a3 3 0 0 0-2.977 2.625ZM2.273 8.625A4.483 4.483 0 0 1 5.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 6H5.25a3 3 0 0 0-2.977 2.625ZM5.25 9a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h13.5a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3H15a.75.75 0 0 0-.75.75 2.25 2.25 0 0 1-4.5 0A.75.75 0 0 0 9 9H5.25Z" />
      </svg>
    </motion.div>
    <motion.div :initial="{ y: -50, opacity: 0 }" :whileInView="{ y: 0, opacity: 1 }"
      :transition="{ delay: 0.3, ease: 'easeInOut' }" class="absolute bottom-[20%] -right-44 -rotate-45 hidden lg:block">
      <svg class="size-96" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
        viewBox="0 0 24 24">
        <path fill-rule="evenodd" d="M7 6a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2v-4a3 3 0 0 0-3-3H7V6Z"
          clip-rule="evenodd" />
        <path fill-rule="evenodd"
          d="M2 11a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7Zm7.5 1a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"
          clip-rule="evenodd" />
        <path d="M10.5 14.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
      </svg>
    </motion.div>
  </section>
</template>
