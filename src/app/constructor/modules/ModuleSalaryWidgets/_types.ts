export type TSalaryProgressbar = {type: "progressbar", title: string, values: Array<{title: string, percent: number, reward: string}>}
export type TSalaryRange = {type: "range", title: string, values: Array<{title: string, current: number, reach: number, reward: string}>}
export type TSalary =  TSalaryProgressbar | TSalaryRange