"use client";
import Tutorial from "./tutorial.mdx";

export default function TutorialPage() {
  return (
    <div className="prose prose-invert flex h-full w-full flex-col px-[1rem] pt-[1rem] text-foreground">
      <Tutorial />
      <br />
    </div>
  );
}
