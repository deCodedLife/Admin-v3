import { toAbsoluteUrl } from '../../../_metronic/helpers'



export const getProjectName = () => {
  const url = window.location.hostname.split(".")
  const currentDomain = url.length === 3 ? url[1] : url[0]
  /* субдомен не нужен в дальнейшем, только для текущей реализации задачника */
  const currentSubdomain = url.length === 3 ? url[0] : null
  switch (currentDomain) {
    case "ritzipcrm":
      return document.title = "RitzipCRM"
    case "adwanto":
      return document.title = "Adwanto"
    case "mewbas":
      if (currentSubdomain === "crm-admin") {
        return document.title = "OxCRM"
      } else {
        return document.title = "DocaCRM"
      }
    default:
      return document.title = "DocaCRM"
  }
}

export const setDocumentTitle = () => {
  const url = window.location.hostname.split(".")
  const currentDomain = url.length === 3 ? url[1] : url[0]
  /* субдомен не нужен в дальнейшем, только для текущей реализации задачника */
  const currentSubdomain = url.length === 3 ? url[0] : null
  const favicon = document.getElementById("favicon") as HTMLLinkElement
  switch (currentDomain) {
    case "ritzipcrm":
      document.title = "RitzipCRM"
      return favicon.href = toAbsoluteUrl("media/crm/favicon/ritzip.ico")
    case "adwanto":
      document.title = "Adwanto"
      return favicon.href = toAbsoluteUrl("media/crm/favicon/adwanto.ico")
    case "mewbas":
      if (currentSubdomain === "crm-admin") {
        document.title = "OxCRM"
        return favicon.href = toAbsoluteUrl("media/crm/favicon/oxcrm.ico")
      } else {
        return document.title = "DocaCRM"
      }
    default:
      return document.title = "DocaCRM"
  }
}
export const getBackground = () => {
  const url = window.location.hostname.split(".")
  const currentDomain = url.length === 3 ? url[1] : url[0]
  /* субдомен не нужен в дальнейшем, только для текущей реализации задачника */
  const currentSubdomain = url.length === 3 ? url[0] : null
  switch (currentDomain) {
    case "ritzipcrm":
      return "ritzip.jpeg"
    case "adwanto":
      return "adwanto.jpg"
    case "mewbas":
      return currentSubdomain === "crm-admin" ? "oxcrm.jpg" : "doca.jpg"
    default:
      return "doca.jpg"
  }
}

export const getLogo = () => {
  const url = window.location.hostname.split(".")
  const currentDomain = url.length === 3 ? url[1] : url[0]
  /* субдомен не нужен в дальнейшем, только для текущей реализации задачника */
  const currentSubdomain = url.length === 3 ? url[0] : null
  switch (currentDomain) {
    case "ritzipcrm":
      return {
        light: "ritzip.svg",
        dark: "ritzip.svg",
      }
    case "adwanto":
      return {
        light: "adwanto.png",
        dark: "adwanto.png",
      }
    case "animocrm":
      return {
        light: "animo_light.png",
        dark: "animo_dark.png",
      }
    case "mewbas":
      return {
        light: currentSubdomain === "crm-admin" ? "oxcrm_light.png" : "doca.svg",
        dark: currentSubdomain === "crm-admin" ? "oxcrm_dark.png" : "doca.svg",
      }
    default:
      return {
        light: "doca.svg",
        dark: "doca.svg",
      }
  }
}

export const setStyles = async (theme?: "2023" | string) => {
  switch (theme) {
    case "2023":
      localStorage.setItem("data-app-theme", "theme_1")
      document.documentElement.setAttribute("data-app-theme", "theme_1")
      setTimeout(() => document.body.setAttribute("data-kt-app-layout", "light-sidebar"), 0)
      break
    default:
      localStorage.setItem("data-app-theme", "")
      document.documentElement.removeAttribute("data-app-theme")
      setTimeout(() => document.body.setAttribute("data-kt-app-layout", "dark-sidebar"), 0)
  }
}