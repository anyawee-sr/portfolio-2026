import Image from "next/image";

import { aboutMe } from "@/data/aboutMe";
import { ArrowRightIcon } from "./ui/ArrowRightIcon";
import { CheckBox } from "./ui/CheckBox";

export function AboutMe() {
  return (
    <section
      id="about-me"
      aria-labelledby="about-me-title"
      className="scroll-mt-20 bg-surface-accent py-10 sm:px-4 overflow-x-clip"
    >
      {/* TODO: link to /about-me */}
      <div className="surface-texture relative z-10 mx-auto sm:max-w-190 shadow-2xl -rotate-6 translate-x-4 translate-y-10">
        <div className="relative flex flex-col border border-brand/45 m-4 sm:m-10 sm:min-h-200 md:min-h-225">
          <div className="border-b border-brand/40 px-2 pt-14 text-center">
            <h2 id="about-me-title" className="type-h2 text-brand uppercase">
              {aboutMe.eyebrow}
            </h2>
            <p className="type-body-s mx-auto mt-2 max-w-170 text-brand uppercase lg:text-nowrap">
              {aboutMe.subcopy}
            </p>
          </div>

          <dl className="about-fields -mr-px">
            {aboutMe.fields.map((field) => (
              <div
                key={field.id}
                className={`about-field-${field.id} border-r border-b border-brand/40 p-2`}
              >
                <dt className="type-caption text-brand uppercase">
                  {field.label}
                </dt>
                <dd className="type-h4 font-typewriter relative mt-3 ml-4 wrap-break-word font-normal text-text-primary uppercase">
                  {field.value}
                </dd>
              </div>
            ))}
          </dl>

          <Image
            src="/images/about-me-tldr/row-texture.webp"
            alt=""
            aria-hidden="true"
            width={860}
            height={25}
          />

          <div className="-mr-px grid grid-cols-12">
            <h3 className="type-caption col-span-12 flex justify-start items-center border-brand/40 p-2 pb-0 text-brand uppercase md:justify-center md:border-r md:border-b md:col-span-3">
              {aboutMe.contact.label}
            </h3>
            <div className="col-span-12 border-r border-b border-brand/40 pl-8 pr-4 md:border-b-0 md:col-span-9 md:p-0">
              <ul className="flex flex-col">
                {aboutMe.contact.rows.map((row, i) => (
                  <li
                    key={row.label}
                    className="flex items-center gap-2 md:px-2 md:border-b border-brand/40"
                  >
                    <CheckBox checked index={i} />
                    <span className="type-caption min-w-20 shrink-0 text-brand uppercase">
                      {row.label}
                    </span>
                    <a
                      href={row.href}
                      {...(row.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="type-body-m font-typewriter inline-flex min-h-11 min-w-0 items-center break-all text-text-primary md:min-h-0"
                    >
                      {row.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="px-6 py-10 text-center content-center flex-1 md:py-12">
            <div className="inline-block -rotate-5">
              <p className="type-tagline font-handwriting text-text-primary">
                OPEN TO
                <br />
                NEW OPPORTUNITIES
              </p>
              <Image
                src="/images/about-me-tldr/line.webp"
                alt=""
                aria-hidden="true"
                width={1548}
                height={120}
                loading="lazy"
                className="-mt-1 h-auto w-full px-10 sm:px-20 md:px-30"
              />
            </div>
          </div>

          {/* Desktop-only */}
          <div className="-mr-px -mb-px hidden md:block">
            <div
              aria-hidden="true"
              className="grid h-7.5 grid-cols-12 border-t border-brand/40"
            >
              <div className="col-span-4 border-r border-b border-brand/40" />
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="border-r border-b border-brand/40" />
              ))}
            </div>

            {/* Looking for */}
            <div className="grid grid-cols-12">
              <div className="col-span-4 border-r border-b border-brand/40 p-2">
                <dl className="flex flex-col">
                  <dt className="type-caption mb-3 text-brand uppercase">
                    {aboutMe.lookingFor.label}
                  </dt>
                  {aboutMe.lookingFor.options.map((option, i) => (
                    <dd
                      key={option.label}
                      className="mb-1 ml-4 flex items-center gap-2 last:mb-0"
                    >
                      <CheckBox checked={option.checked} index={i + 2} />
                      <span className="type-caption text-brand uppercase">
                        {option.label}
                      </span>
                      {!option.checked && (
                        <span className="sr-only"> — not looking for</span>
                      )}
                    </dd>
                  ))}
                </dl>
              </div>
              <div className="col-span-8 border-r border-b border-brand/40" />
            </div>
          </div>

          <div className="absolute right-6 bottom-12 hidden md:block">
            <Image
              src="/images/about-me-tldr/stamp-qr-resume.webp"
              alt="QR code — scan to open my full resume on Google Drive"
              width={300}
              height={300}
              loading="lazy"
              className="h-auto w-50 -rotate-6 translate-y-10"
            />
            <Image
              src="/images/about-me-tldr/stamp-text.webp"
              alt=""
              aria-hidden="true"
              width={280}
              height={84}
              loading="lazy"
              className="absolute bottom-4 -left-14 h-auto w-50 rotate-8 -translate-x-25"
            />
            <div className="absolute -bottom-10 right-18 flex -translate-x-1/2 rotate-6 flex-col items-center text-center">
              <span className="type-body-m font-typewriter text-text-primary uppercase">
                {aboutMe.resume.prefix}
              </span>
              <a
                href={aboutMe.resume.href}
                target="_blank"
                rel="noopener noreferrer"
                className="type-body-l font-typewriter inline-flex items-center gap-1 whitespace-nowrap text-text-primary border-b border-text-primary leading-1 hover:border-brand hover:text-brand uppercase"
              >
                {aboutMe.resume.label}
                <ArrowRightIcon />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
