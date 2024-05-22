import React, {useLayoutEffect, useRef, useState} from "react";
import arrowLeft from '../public/arrow_left.png';

export const ImageGallery = (props: ImageGalleryProps) => {
    const { images, onClose } = props;
    const [currentIndex, setCurrentIndex] = useState(0);
    const imgRef = useRef<HTMLDivElement>();
    const arrowLeftRef = useRef<HTMLImageElement>();
    const arrowRightRef = useRef<HTMLImageElement>();

    const setPrevImage = () => {
        setCurrentIndex(currentIndex => (currentIndex <= 0) ? images.length - 1 : currentIndex - 1);
    };

    const setNextImage = () => {
        setCurrentIndex(currentIndex => (currentIndex >= images.length - 1) ? 0 : currentIndex + 1);
    };

    useLayoutEffect(() => {
        window.addEventListener('click', (e: MouseEvent) => {
            const targetElement = e.target as HTMLElement;

            if (targetElement.id !== 'view-jobs-btn' && imgRef.current && 
                !imgRef.current.contains(targetElement) &&
                arrowLeftRef.current && arrowLeftRef.current.innerHTML !== targetElement.innerHTML &&
                arrowRightRef.current && arrowRightRef.current.innerHTML !== targetElement.innerHTML) {
                onClose();
            }
        });
        window.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' && images.length) setNextImage();
            else if (e.key === 'ArrowLeft' && images.length) setPrevImage();
            else if (e.key === 'Escape') {
                onClose();
            }
        });
    }, [onClose, images.length, setNextImage, setPrevImage]);

    return (
        <>
            {images && images.length ? images.map((image, i) => {
                if (i===currentIndex) return (
                    <div key={`image-${i}`} style={{backgroundColor: 'rgba(0, 0, 0, 0.7)', minHeight: '100vh', maxWidth: '100vw' }}>
                        <button className='btn btn-light my-3' style={{margin: '0 auto', display: 'table'}} onClick={() => image.onDelete()}>Remove</button>

                        <img alt='prevImage' onClick={setPrevImage} src={arrowLeft.src} ref={arrowLeftRef} style={{position: 'fixed', width: '50px', filter: 'invert(100%)', top: '50%', left: '1%', cursor: 'pointer'}} />
                        <img alt='nextImage' onClick={setNextImage} src={arrowLeft.src} ref={arrowRightRef} style={{position: 'fixed', width: '50px', filter: 'invert(100%)', top: '50%', right: '1%', cursor: 'pointer', transform: 'scaleX(-1)'}} />
                        
                        <div ref={imgRef} style={{margin: '0 auto', display: 'table'}}>
                            <a className="d-block" href={image.link} target="_blank" rel="noreferrer" style={{color:'white'}}>{image.link}</a>
                            <img
                                alt={`screenshot-${i}`}
                                key={i}
                                src={image.src}
                            />
                        </div>
                    </div>
                )
            }) : null}
        </>
    );
}

interface ImageGalleryProps {
    images: Image[];
    onClose: () => void;
}

interface Image {
    src: string;
    onDelete: () => void;
    link: string;
}