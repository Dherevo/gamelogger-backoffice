export default interface IRoute {
    path: string,
    name?: string,
    component?: any,
    redirect?: string,
    beforeEnter?: (to: any, from: any, next: (() => void)) => void,
    children?: IRoute[]
}