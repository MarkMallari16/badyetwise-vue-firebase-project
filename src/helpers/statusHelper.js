import IconAtLimit from "@/components/icons/IconAtLimit.vue";
import IconOnTrack from "@/components/icons/IconOnTrack.vue";
import IconOverBudget from "@/components/icons/IconOverBudget.vue";

export function getStatusClass(status) {
    switch (status) {
        case "Over Budget":
            return "bg-error/20 text-error";
        case "At Limit":
            return "bg-warning/20 text-warning";
        case "On Track":
            return "bg-success/20 text-success";
        default:
            return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-200";
    }
}

export function getStatusIcon(status) {
    switch (status) {
        case "Over Budget":
            return IconOverBudget;
        case "At Limit":
            return IconAtLimit;
        case "On Track":
            return IconOnTrack;
        default:
            return IconOnTrack;
    }
}