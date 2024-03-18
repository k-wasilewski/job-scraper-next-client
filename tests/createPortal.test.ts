import { createWrapperAndAppendToBody } from "../utils/createPortal";

describe('createPortal spec', () => {
    it('createWrapperAndAppendToBody spec', () => {
        const wrapperId = 'my-id';
        
        expect(document.getElementById(wrapperId)).toBeNull();

        createWrapperAndAppendToBody(wrapperId);

        expect(document.getElementById(wrapperId)).not.toBeNull();
        expect(document.body.innerHTML).toContain('position: absolute');
    });
});