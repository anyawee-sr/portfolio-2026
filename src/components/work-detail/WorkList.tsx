export interface IWorkListTerm {
  term: string;
  text: string;
}

export type TWorkListItem = string | IWorkListTerm;

export interface IWorkListProps {
  items: readonly TWorkListItem[];
}

export function WorkList({ items }: IWorkListProps) {
  return (
    <ul className="flex flex-col gap-2 ps-5">
      {items.map((item, i) => (
        <li
          key={i}
          className="type-body-l flex items-start gap-3 text-text-primary"
        >
          <span aria-hidden="true" className="shrink-0 select-none">
            ✦
          </span>
          <span>
            {typeof item === "string" ? (
              item
            ) : (
              <>
                <strong>{item.term}:</strong> {item.text}
              </>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}
