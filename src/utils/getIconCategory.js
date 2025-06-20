import { icons } from "./categoryIcons";

export const getIconCategory = (categoryIcon) => {
    const icon = icons.find(icon => icon.name === categoryIcon);
    return icon ? icon.icon : null;
};