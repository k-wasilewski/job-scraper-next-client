export const createWrapperAndAppendToBody = (wrapperId) => {
    const wrapperElement = document.createElement('div');
    wrapperElement.setAttribute('style', `
        position: absolute;
        top: 0;
        width: 99vw;
    `);
    wrapperElement.setAttribute("id", wrapperId);
    document.body.appendChild(wrapperElement);
    return wrapperElement;
}