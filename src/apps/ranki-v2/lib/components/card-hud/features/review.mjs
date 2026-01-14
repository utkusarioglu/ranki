export function createReviewFeature(props, attach) {
    if (props.review.marked || props.review.flag.type !== "flag0") {
        const review = document.createElement("anki-hud");
        review.classList.add("outer-padding", "fill-1", "curved-1", "flex");
        if (props.review.marked) {
            const marked = document.createElement("anki-hud");
            marked.classList.add("half-padding");
            marked.innerText = props.review.flag.message;
            review.appendChild(marked);
        }
        if (props.review.flag.type !== "flag0") {
            const flag = document.createElement("anki-hud");
            flag.classList.add("half-padding", "curved-2", "fill-2", "flex", `flag-type-${props.review.flag.type}`);
            flag.innerText = props.review.flag.message;
            review.appendChild(flag);
        }
        attach.appendChild(review);
    }
}
