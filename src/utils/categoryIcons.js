import IconClothing from "@/components/icons/IconClothing.vue";
import IconEducation from "@/components/icons/IconEducation.vue";
import IconElectricity from "@/components/icons/IconElectricity.vue";
import IconEntertainment from "@/components/icons/IconEntertainment.vue";
import IconFood from "@/components/icons/IconFood.vue";
import IconGames from "@/components/icons/IconGames.vue";
import IconHealthcare from "@/components/icons/IconHealthcare.vue";
import IconHousing from "@/components/icons/IconHousing.vue";
import IconJob from "@/components/icons/IconJob.vue";
import IconOther from "@/components/icons/IconOther.vue";
import IconShopping from "@/components/icons/IconShopping.vue";
import IconTravel from "@/components/icons/IconTravel.vue";
import { markRaw } from "vue";

export const icons = [
    {
        id: "clothing",
        name: "Clothing",
        icon: markRaw(IconClothing),
    },
    {
        id: "education",
        name: "Education",
        icon: markRaw(IconEducation),
    },
    {
        id: "games",
        name: "Games",
        icon: markRaw(IconGames),
    },
    {
        id: "electricity",
        name: "Electricity",
        icon: markRaw(IconElectricity),
    },
    {
        id: "housing",
        name: "Housing",
        icon: markRaw(IconHousing),
    },
    {
        id: "food",
        name: "Food",
        icon: markRaw(IconFood),
    },
    {
        id: "shopping",
        name: "Shopping",
        icon: markRaw(IconShopping),
    },
    {
        id: "healthcare",
        name: "Healthcare",
        icon: markRaw(IconHealthcare),
    },
    {
        id: "job",
        name: "Job",
        icon: markRaw(IconJob),
    },
    {
        id: "entertainment",
        name: "Entertainment",
        icon: markRaw(IconEntertainment),
    },

    {
        id: "travel",
        name: "Travel",
        icon: markRaw(IconTravel),
    },
    {
        id: "other",
        name: "Other",
        icon: markRaw(IconOther),
    },
];