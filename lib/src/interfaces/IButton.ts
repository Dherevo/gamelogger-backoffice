export default interface IButton {
    content: string,
    icon?: string,
    iconPosition?: 'left'|'right',
    onClick?: (param?: any) => any,
    link?: string,
    target?: string,
    disabled?: () => boolean,
    loading?: () => boolean,
    class?: any,
    style?: any
}