export function createTagsFeature(props, attach) {
    if (props.tags.filter((v) => v).length) {
        const tags = document.createElement("anki-hud");
        tags.classList.add("curved-1");
        tags.classList.add("fill-1");
        tags.classList.add("outer-padding");
        tags.classList.add("tags");
        props.tags.forEach((tag) => {
            const t = document.createElement("anki-hud");
            t.classList.add("tag");
            t.classList.add("curved-2");
            t.classList.add("half-padding");
            t.classList.add("fill-2");
            t.innerText = tag;
            tags.appendChild(t);
        });
        attach.appendChild(tags);
    }
}
