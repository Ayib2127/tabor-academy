'use client';

import { BlockNoteView } from '@blocknote/react';
import '@blocknote/core/style.css';

interface Props {
  content: any; // BlockNote JSON
}

export default function LessonContentDisplay({ content }: Props) {
  if (!content) return null;
  return <BlockNoteView editable={false} initialContent={content} />;
}
