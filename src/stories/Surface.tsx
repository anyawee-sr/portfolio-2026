import './Surface.css';

export function SurfaceTokens() {
  return (
    <section aria-labelledby="surface-tokens-title" className="surface-tokens-page">
      <h2 id="surface-tokens-title" className="type-h2 text-text-primary">
        Surface Patterns
      </h2>
      <p className="type-body-m text-text-secondary max-w-[60ch]">
        Surface utilities bundle a background-color with a repeating background-image into one
        class, the same way type-* bundles typography instead of hand-rolling font properties.
      </p>
      <figure className="surface-preview-card border border-text-secondary/20 rounded-lg">
        <div aria-hidden="true" className="surface-preview-box surface-dotted w-full h-64 rounded-md" />
        <figcaption className="type-label text-text-primary">surface-dotted</figcaption>
      </figure>
    </section>
  );
}
