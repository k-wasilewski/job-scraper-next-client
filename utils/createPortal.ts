export const createWrapperAndAppendToBody = (wrapperId) => {
    const existingWrapper = document.querySelector(`#${wrapperId}`);
    if (existingWrapper) return existingWrapper as HTMLElement;

    const wrapperElement = document.createElement('div');
    wrapperElement.setAttribute('style', `
        position: absolute;
        top: 0;
        width: 98.5vw;
    `);
    wrapperElement.setAttribute("id", wrapperId);
    document.body.appendChild(wrapperElement);
    return wrapperElement;
}