export type Orderable = string | number
export type GetKey<T = any, K extends Orderable = Orderable> = (element: T) => K