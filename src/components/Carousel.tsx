import React, { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';

export type CarouselItem = {
    id: number,
    image: string,
    title: string,
    to: string,
}

export type Props = {
    defaultCursor: number | null,
    defaultStarting: number | null,
    id: string,
    items: Array<CarouselItem>,
    loading?: boolean,
    onChange?: (values: { id: string, starting: number, cursor: number }) => void,
}

const usePreloadImage = (elementRef: React.MutableRefObject<HTMLLinkElement | null>, href: string | undefined) => {
    if (!elementRef?.current && href) {
        elementRef.current = document.createElement("link") as HTMLLinkElement;
        elementRef.current.rel = "preload";
        elementRef.current.as = "image";
        elementRef.current.href = href;
        document.head.appendChild(elementRef.current);
    }

    useEffect(() => {
        if (href && elementRef.current) {
            elementRef.current.href = href;
        }
    }, [href]);
}

const Carousel: React.FC<Props> = ({ defaultStarting, defaultCursor, id, items, loading = false, onChange }) => {
    const max = 5;

    const [starting, setStarting] = useState(defaultStarting);
    const navigate = useNavigate();

    useEffect(() => {
        if (!defaultStarting) {
            return;
        }
        setStarting(defaultStarting);
    }, [defaultStarting]);

    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!carouselRef.current || defaultCursor == null) {
            return;
        }
        if (defaultCursor) {
            requestAnimationFrame(() => {
                carouselRef.current?.querySelector<HTMLAnchorElement>(`a[data-itemindex="${defaultCursor}"]`)?.focus();
            })
        }
    }, []);


    useEffect(() => {
        if (!carouselRef.current) {
            return;
        }

        const clickListener = (e: MouseEvent) => {
            e.preventDefault();

            const target = e.target as HTMLElement | null;
            if (target?.tagName !== 'A') {
                return
            }

            target.classList.add("program-image")

            requestAnimationFrame(() => {
                if (!document.startViewTransition) {
                    navigate(target.getAttribute("href") ?? '/');
                }

                document.startViewTransition(() => {
                    flushSync(() => {
                        navigate(target.getAttribute("href") ?? '/');
                    });
                });
            })

        };


        const keyListener = (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowLeft":
                case "ArrowRight":
                    e.stopPropagation();
                    const target = e.target as HTMLElement | null;
                    let index = parseInt(target?.dataset?.itemindex ?? '', 10);
                    if (Number.isNaN(index) || !items || !e.target) {
                        return;
                    }

                    let cursor = index;
                    let updateStarting = false;
                    let startingIndex = 0;

                    const itemLength = items.length;
                    // debugger;

                    if (e.key === "ArrowLeft") {
                        if (index === 0) {
                            // no-op
                            return;

                        } else if (index === 1) {
                            updateStarting = true;
                            startingIndex = 0;
                            cursor = 0;

                        } else if (index === 2) {
                            updateStarting = true;
                            startingIndex = 0;
                            cursor = 1;

                        } else {
                            const offsetFromEnd = (itemLength - 1) - index;
                            if (offsetFromEnd < 2) {
                                cursor = index - 1;
                                startingIndex = itemLength - max;

                            } else {
                                updateStarting = true;
                                startingIndex = index - 3;
                                cursor = index - 1;
                            }
                        }

                    } else if (e.key === "ArrowRight") {
                        if (index === itemLength - 1) {
                            // no-op
                            return;

                        } if (index === 0) {
                            updateStarting = true;
                            cursor = 1;
                            startingIndex = 0;

                        } else if (index === 1) {
                            updateStarting = true;
                            cursor = Math.min(itemLength - 1, 2);
                            startingIndex = 0;

                        } else if (index >= 2) {
                            const endInPosition = index > itemLength - max + 1;

                            if (endInPosition) {
                                cursor = index + 1;
                                startingIndex = itemLength - max;

                            } else {

                                updateStarting = true
                                cursor = index + 1;
                                startingIndex = index - 1;
                            }
                        }
                    }

                    if (!document.startViewTransition) {
                        onChange && onChange({ id, starting: startingIndex, cursor });
                        if (updateStarting) {
                            setStarting(startingIndex)
                        }
                        carouselRef.current?.querySelector<HTMLAnchorElement>(`a[data-itemindex="${cursor}"]`)?.focus();
                        return;
                    }

                    document.startViewTransition(() => {
                        flushSync(() => {
                            onChange && onChange({ id, starting: startingIndex, cursor });
                            if (updateStarting) {
                                setStarting(startingIndex)
                            }

                            carouselRef.current?.querySelector<HTMLAnchorElement>(`a[data-itemindex="${cursor}"]`)?.focus();
                            history.replaceState({
                                carousel: { id, cursor, starting: startingIndex }
                            }, document.title);
                        });
                    });

                    break;
                case "ArrowUp":
                case "ArrowDown":

                    break;

            }
        };

        const focusListener = (e: FocusEvent) => {
            e.preventDefault();
            const target = e.target as HTMLElement | null;
            if (target?.tagName !== 'A') {
                return
            }

            const cursor = parseInt(target?.dataset?.itemindex ?? '', 10);
            if (Number.isNaN(cursor) || !items || !e.target) {
                return;
            }

            const startingElement = carouselRef.current?.firstChild as HTMLElement | null;
            const starting = parseInt(startingElement?.dataset?.itemindex ?? '', 10);
            if (Number.isNaN(starting)) {
                return;
            }

            onChange && onChange({ id, starting, cursor });

        };

        carouselRef.current.addEventListener("click", clickListener, true)
        carouselRef.current.addEventListener("keydown", keyListener, true)
        carouselRef.current.addEventListener("focus", focusListener, true)
        return () => {
            carouselRef.current?.removeEventListener("click", clickListener, true);
            carouselRef.current?.removeEventListener("keydown", keyListener, true);
            carouselRef.current?.removeEventListener("focus", focusListener, true);
        }

    }, [items]);

    const startIndex = starting ?? 0;
    const itemsLength = items.length;
    const itemWindow =
        items
            .map((o, index) => ({ ...o, index }))
            .slice(startIndex, max + startIndex + 1);

    // Preload some image
    const preloadRef1 = useRef<HTMLLinkElement | null>(null)
    const preload1 = items[(max + startIndex) % itemsLength];
    usePreloadImage(preloadRef1, preload1?.image);

    const preloadRef2 = useRef<HTMLLinkElement | null>(null)
    const preload2 = items[(max + startIndex + 1) % itemsLength];
    usePreloadImage(preloadRef2, preload2?.image);

    const preloadRef3 = useRef<HTMLLinkElement | null>(null)
    const preload3 = items[(itemsLength + startIndex - 1) % itemsLength];
    usePreloadImage(preloadRef3, preload3?.image);

    return (
        <div
            ref={carouselRef}
            id={id}
            className="carousel"
            data-focusgroup="carousel"
            data-end={startIndex >= itemsLength - max}
        >
            {itemWindow
                ?.map(({ id: itemId, image, to, index }, i) => (
                    <a
                        key={itemId}
                        data-id={itemId}
                        data-itemindex={index}
                        href={to}
                        style={{
                            viewTransitionName: `${id}-t${index}`,
                        }}
                    >
                        <img
                            key={itemId}
                            src={image}
                            style={{
                                width: "100%",
                                // viewTransitionName: `${id}-t${index}`,
                            }}
                        />
                    </a>
                ))}
            {
                (new Array((max + 1) - itemWindow.length)
                    .fill(0, 0)
                    .map((_, idx) => (
                        <a
                            className="pad"
                            key={`pad-${idx}`}
                            style={{ color: 'red', viewTransitionName: `${id}-t${max - idx}` }}
                        />
                    ))
                )
            }
        </div>
    );
};

export default Carousel;