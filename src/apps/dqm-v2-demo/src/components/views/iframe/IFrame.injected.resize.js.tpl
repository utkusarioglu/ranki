const observer = new ResizeObserver(() =>
{
  const rect = document.body.getBoundingClientRect();
  window.parent.postMessage({
    type: `resize-${id}`,
    height: rect.height + rect.y,
  }, '*');
});
observer.observe(document.body);
