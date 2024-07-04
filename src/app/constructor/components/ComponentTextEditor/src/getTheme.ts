import { ThemeModeType } from "../../../../../_metronic/partials";

export const getTheme = (mode: ThemeModeType, type: "skin" | "content", theme?: string) => {
    const currentThemeMode = mode === "system" ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light" : mode

    if (currentThemeMode === "light") {
        return type === "skin" ? "oxide" : "default"
    } else {
        switch (theme) {
            case "2023":
                return type === "skin" ? "app_2023_dark" : "/tinymce/skins/content/app_2023_dark/content.min.css" 
            case "flowerbloom":
                return type === "skin" ? "app_flowerbloom_dark" : "/tinymce/skins/content/app_flowerbloom_dark/content.min.css" 
            default:
                return type === "skin" ? "app_dark" : "/tinymce/skins/content/app_dark/content.min.css" 
        }
    }
}