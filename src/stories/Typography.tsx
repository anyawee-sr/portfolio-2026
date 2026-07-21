import './Typography.css';

export interface ITypographyToken {
  /** `type-*` utility class defined in globals.css, e.g. "type-h2" */
  className: string;
}

export const TYPOGRAPHY_TOKENS: ITypographyToken[] = [
  { className: 'type-display' },
  { className: 'type-h1' },
  { className: 'type-h2' },
  { className: 'type-h3' },
  { className: 'type-h4' },
  { className: 'type-body-l' },
  { className: 'type-body-m' },
  { className: 'type-body-s' },
  { className: 'type-label' },
  { className: 'type-caption' },
];

function TypographyRow({ className }: ITypographyToken) {
  return (
    <tr>
      <td className="py-3.5 align-middle">
        <span className={`${className} text-text-primary`}>
          {className.replace(/^type-/, '')}
        </span>
      </td>
      <td className="py-3.5 align-middle type-body-m text-text-primary">{className}</td>
    </tr>
  );
}

export function TypographyTable() {
  return (
    <table className="type-token-table">
      <thead>
        <tr>
          <th scope="col" className="py-3.5 type-label text-brand uppercase">
            Swatch
          </th>
          <th scope="col" className="py-3.5 type-label text-brand uppercase">
            Name
          </th>
        </tr>
      </thead>
      <tbody>
        {TYPOGRAPHY_TOKENS.map((token) => (
          <TypographyRow key={token.className} {...token} />
        ))}
      </tbody>
    </table>
  );
}

export function TypographyTokens() {
  return (
    <section aria-labelledby="typography-tokens-title" className="flex flex-col gap-3.5">
      <h2 id="typography-tokens-title" className="type-h2 text-text-primary">
        Typography
      </h2>
      <p className="type-body-m text-text-secondary max-w-149">
        Every sample renders with the actual type-* utility class — nothing here is a hardcoded
        font-size or font-weight.
      </p>
      <TypographyTable />
    </section>
  );
}
