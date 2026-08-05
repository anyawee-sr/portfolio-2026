export interface IWorkTextProps {
  paragraphs: readonly string[];
}

export function WorkText({ paragraphs }: IWorkTextProps) {
  return (
    <div className="flex flex-col gap-4">
      {paragraphs.map((paragraph, i) => (
        <p key={i} className="type-body-l text-text-primary">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
