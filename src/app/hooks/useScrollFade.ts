import { useEffect, useRef, useState } from "react";

export function useScrollFade() {
    const ref = useRef<HTMLDivElement>(null);
    const [atTop, setAtTop] = useState(true);
    const [atBottom, setAtBottom] = useState(false);

    const check = (el: HTMLDivElement) => {
        setAtTop(el.scrollTop <= 0);
        setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 1);
    };

    useEffect(() => {
        if (ref.current) check(ref.current);
    });

    const onScroll = () => {
        if (ref.current) check(ref.current);
    };

    return { ref, onScroll, atTop, atBottom };
}
