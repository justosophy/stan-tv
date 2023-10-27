import React, { useEffect } from 'react';
import { getIndexPosition } from '../lib';

const FOCUS_GROUP = "[data-focusgroup]";
const FOCUS_ITEM = "[data-itemindex]";
const FIRST_FOCUS_GROUP = `${FOCUS_GROUP} ${FOCUS_ITEM}`;
const SECOND_FOCUS_GROUP = `${FOCUS_GROUP}:nth-child(2) ${FOCUS_ITEM}`;

export const setInitialPageFocus = () => {
    let elementToFocus = document.querySelector(SECOND_FOCUS_GROUP) as HTMLElement | null;
    if (!elementToFocus) {
        elementToFocus = document.querySelector(FIRST_FOCUS_GROUP) as HTMLElement | null
    }
    elementToFocus?.focus();
}

export const useFocusGroupControls = () => {
    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowUp":
                case "ArrowDown": {
                    const focusedElement = document.activeElement as HTMLElement | null;

                    if (focusedElement?.dataset?.itemindex == undefined) {
                        if (e.key === "ArrowUp") {
                            (document.querySelector(FIRST_FOCUS_GROUP) as HTMLElement | null)?.focus();
                        } else if (e.key === "ArrowDown") {
                            setInitialPageFocus()
                        }
                        return;
                    }

                    const focusedGroupElement = focusedElement.closest(FOCUS_GROUP) as HTMLElement | null;
                    if (!focusedGroupElement) {
                        return;
                    }
                    const nextFocusGroupElement =
                        (e.key === "ArrowUp"
                            ? focusedGroupElement.previousElementSibling
                            : focusedGroupElement.nextElementSibling) as HTMLElement | null;
                    if (!nextFocusGroupElement) {
                        return;
                    }

                    let positionToFocus = 0;
                    if (focusedGroupElement.dataset.focusgroup === nextFocusGroupElement.dataset.focusgroup) {
                        positionToFocus = getIndexPosition(focusedElement);
                    }
                    let elementToFocus = nextFocusGroupElement.querySelectorAll(FOCUS_ITEM)?.item(positionToFocus) as HTMLElement | null;

                    elementToFocus?.focus();
                    break;
                }
                case "ArrowLeft":
                case "ArrowRight": {
                    const focusedElement = document.activeElement as HTMLElement | null;
                    if (focusedElement?.dataset?.itemindex == undefined) {
                        if (e.key === "ArrowLeft") {
                            (document.querySelector(FIRST_FOCUS_GROUP) as HTMLElement | null)?.focus();
                        } else if (e.key === "ArrowRight") {
                            setInitialPageFocus()
                        }
                        return;
                    }
                    const focusedGroupElement = focusedElement.closest(FOCUS_GROUP) as HTMLElement | null;
                    if (!focusedGroupElement) {
                        return;
                    }
                    const nextFocusElement =
                        (e.key === "ArrowLeft"
                            ? focusedElement.previousElementSibling
                            : focusedElement.nextElementSibling) as HTMLElement | null;

                    nextFocusElement?.focus();
                    break;
                }
            }
        };
        window.addEventListener("keydown", listener);
        return () => {
            window.removeEventListener("keydown", listener);
        }
    }, []);
}