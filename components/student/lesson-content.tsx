'use client';



interface Props {
  content: string; // HTML string from Tiptap
}

export default function LessonContentDisplay({ content }: Props) {
  if (!content) return null;
  return <div className="prose" dangerouslySetInnerHTML={{ __html: content }} />;
}
