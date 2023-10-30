//Универсальный список булевых значений
export const booleanResponsesList = [
    { title: "Да", value: true },
    { title: "Нет", value: false }
]

//Типы данных свойств в бд
export const databasePropTypes = [
    { title: "char(1)", value: "char(1)" },
    { title: "varchar(15)", value: "varchar(15)" },
    { title: "varchar(75)", value: "varchar(75)" },
    { title: "varchar(255)", value: "varchar(255)" },
    { title: "int", value: "int" },
    { title: "float", value: "float" },
    { title: "date", value: "date" },
    { title: "time", value: "time" },
    { title: "datetime", value: "datetime" },
    { title: "text", value: "text" },
]

//Типы данных свойств объектов
export const objectPropTypes = [
    { title: "string", value: "string" },
    { title: "email", value: "email" },
    { title: "password", value: "password" },
    { title: "integer", value: "integer" },
    { title: "float", value: "float" },
    { title: "phone", value: "phone" },
    { title: "date", value: "date" },
    { title: "time", value: "time" },
    { title: "datetime", value: "datetime" },
    { title: "array", value: "array" },
    { title: "boolean", value: "boolean" },
    { title: "image", value: "image" },
    { title: "file", value: "file" },
]

//Типы отображения свойств объектов (поля)
export const objectPropView = [
    { title: "string", value: "string" },
    { title: "email", value: "email" },
    { title: "password", value: "password" },
    { title: "year", value: "year" },
    { title: "integer", value: "integer" },
    { title: "float", value: "float" },
    { title: "price", value: "price" },
    { title: "phone", value: "phone" },
    { title: "list", value: "list" },
    { title: "date", value: "date" },
    { title: "time", value: "time" },
    { title: "datetime", value: "datetime" },
    { title: "dadata_address", value: "dadata_address" },
    { title: "dadata_country", value: "dadata_country" },
    { title: "dadata_region", value: "dadata_region" },
    { title: "dadata_local_area", value: "dadata_local_area" },
    { title: "dadata_city", value: "dadata_city" },
    { title: "dadata_street", value: "dadata_street" },
    { title: "google_address", value: "google_address" },
    { title: "textarea", value: "textarea" },
    { title: "checkbox", value: "checkbox" },
    { title: "radio", value: "radio" },
    { title: "image", value: "image" },
    { title: "editor", value: "editor" },
    { title: "smart_list", value: "smart_list" },
    { title: "layout", value: "layout" },
    { title: "file", value: "file" },
]

//Типы команд 
export const commandTypes = [
    { title: "get", value: "get" },
    { title: "add", value: "add" },
    { title: "update", value: "update" },
    { title: "remove", value: "remove" },
    { title: "search", value: "search" },
    { title: "custom", value: "custom" },
]

//Типы модулей структуры страниц

export const pageModuleTypes = [
    { title: "header", value: "header" },
    { title: "list", value: "list" },
    { title: "form", value: "form" },
    { title: "info", value: "info" },
    { title: "analytic_widgets", value: "analytic_widgets" },
    { title: "roles", value: "roles" },
    { title: "schedule", value: "schedule" },
    { title: "schedule_list", value: "schedule_list" },
    { title: "chat", value: "chat" },
    { title: "mini_chat", value: "mini_chat" },
    { title: "tabs", value: "tabs" },
    { title: "calendar", value: "calendar" },
    { title: "funnel", value: "funnel" },
    { title: "news", value: "news" },
    { title: "logs", value: "logs" },
    { title: "links_block", value: "links_block" },
    { title: "app_editor", value: "app_editor" },
    { title: "accordion", value: "accordion" },
    { title: "day_planning", value: "day_planning" },
    { title: "queue", value: "queue" }
]

//Размер модуля 
export const pageModuleSize = [
    { title: "1", value: 1 },
    { title: "2", value: 2 },
    { title: "3", value: 3 },
    { title: "4", value: 4 }
]

//Поля для настройки кнопок
export const buttonsSettingsFields = [
    {
        title: "Тип",
        article: "type",
        type: "select",
        list: [
            { title: "href", value: "href" },
            { title: "submit", value: "submit" },
            { title: "script", value: "script" },
            { title: "print", value: "print" },
            { title: "modal", value: "modal" },
            { title: "add_to_form", value: "add_to_form" }
        ],
        resetOnChange: true
    },
    { title: "Заголовок", article: "settings.title", type: "input" },
    { title: "Необходимые модули", article: "required_modules", type: "select", list: [], isMulti: true, size: 6 },
    { title: "Необходимые доступы", article: "required_permissions", type: "select", list: [], isMulti: true, size: 6 },
    {
        title: "Фон",
        article: "settings.background",
        type: "select",
        list: [
            { title: "dark", value: "dark" },
            { title: "light", value: "light" },
            { title: "danger", value: "danger" }
        ],
        size: 6
    },
    { title: "Иконка (URL)", article: "settings.icon", type: "input", size: 6 },
    {
        title: "Переход на страницу",
        article: "settings.page",
        type: "input",
        dependency: {
            article: "type",
            value: ["href", "modal", "add_to_form"]
        }
    },
    {
        title: "Возврат на страницу",
        article: "settings.href",
        type: "input",
        dependency: {
            article: "type",
            value: "submit"
        }
    },
    {
        title: "Объект",
        article: "settings.object",
        type: "input",
        dependency: {
            article: "type",
            value: "script"
        }
    },
    {
        title: "Команда",
        article: "settings.command",
        type: "input",
        dependency: {
            article: "type",
            value: "script"
        }
    },
    {
        title: "Данные",
        article: "settings.data",
        type: "object",
        dependency: {
            article: "type",
            value: ["script", "print"]
        }
    },
    {
        title: "Ключ возвращаемого значения",
        article: "settings.insert_to_field",
        type: "input",
        dependency: {
            article: "type",
            value: "modal"
        }
    },
    {
        title: "Ключ возвращаемого значения",
        article: "settings.field",
        type: "input",
        dependency: {
            article: "type",
            value: "add_to_form"
        }
    },
    {
        title: "Закрытие предыдущего модального окна",
        article: "settings.close_previous_modal",
        type: "select",
        list: booleanResponsesList,
        dependency: {
            article: "type",
            value: "modal"
        },
        size: 3
    },
    {
        title: "Закрытие текущего модального окна",
        article: "settings.close_after_submit",
        type: "select",
        list: booleanResponsesList,
        dependency: {
            article: "type",
            value: "modal"
        },
        size: 3
    },
    {
        title: "Обновление внешнего модуля",
        article: "settings.refresh_after_submit",
        type: "select",
        list: booleanResponsesList,
        dependency: {
            article: "type",
            value: "modal"
        },
        size: 3
    },
    {
        title: "Размер модального окна",
        article: "settings.modal_size",
        type: "select",
        list: [
            { title: "sm", value: "sm" },
            { title: "lg", value: "lg" },
            { title: "xl", value: "xl" }
        ],
        dependency: {
            article: "type",
            value: "modal"
        },
        size: 3
    },
    {
        title: "Контекст",
        article: "settings.context",
        type: "object",
        dependency: {
            article: "type",
            value: "modal"
        },
        size: 12
    },
]

//поля для типа smart_list (облегченный вариант)
export const smartListFields = [
    { title: "Название", article: "title", type: "input", size: 6 },
    { title: "Артикул", article: "article", type: "input", size: 6 },
    { title: "Тип", article: "data_type", type: "select", list: objectPropTypes, size: 6 },
    { title: "Отображение", article: "field_type", type: "select", list: objectPropView, size: 6 },
]