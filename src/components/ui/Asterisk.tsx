import Image from "next/image";

/**
 * Red asterisk mark — decorative (skill wall backdrop), never
 * announced by a screen reader. Tilt is baked into the source art.
 */
export function Asterisk() {
  return (
    <Image
      src="/images/asterisk.png"
      alt=""
      aria-hidden="true"
      width={738}
      height={764}
      loading="lazy"
      className="h-auto w-full"
    />
  );
}
