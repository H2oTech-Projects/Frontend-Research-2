import { useEffect } from "react";

export const useClickOutside = (refs: any, callback: (event: MouseEvent) => void) => {
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            const isOutside = refs.every((ref: any) => !ref?.current?.contains(event.target));

            if (isOutside && typeof callback === "function") {
                callback(event);
            }
        };

        window.addEventListener("mousedown", handleOutsideClick);

        return () => {
            window.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [callback, refs]);
};
