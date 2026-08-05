export interface IWorkCodeProps {
  code: string;
}

export function WorkCode({ code }: IWorkCodeProps) {
  return (
    <pre
      tabIndex={0}
      className="type-code overflow-x-auto rounded-lg border border-dashed border-text-secondary/40 bg-surface-card p-4 text-text-primary"
    >
      <code>{code}</code>
    </pre>
  );
}
