// ANKI
export function onReady(fn) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", fn, { once: true });
    }
    else {
        fn();
        const mut = new MutationObserver(fn);
        mut.observe(document.querySelector("body"), {
            childList: true,
            subtree: true,
            attributes: true,
        });
    }
}
