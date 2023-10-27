export const getIndexPosition = (elem: HTMLElement) => {
    let i = 0;
    /* @ts-ignore */
    while ((elem = elem?.previousElementSibling) !== null) ++i;
    return i;
}