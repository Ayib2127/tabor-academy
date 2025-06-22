'use client';

import { FC } from 'react';

interface Props {
  content: any; // Tiptap JSON content or other content types
  type?: 'text' | 'video' | 'quiz';
}

const LessonContentDisplay: FC<Props> = ({ content, type = 'text' }) => {
  if (!content) {
    return (
      <div className="text-center py-8 text-[#2C3E50]/60">
        <p>No content available for this lesson.</p>
      </div>
    );
  }

  // Handle different content types
  switch (type) {
    case 'text':
      return <TiptapContentRenderer content={content} />;
    case 'video':
      return <VideoContentRenderer content={content} />;
    case 'quiz':
      return <QuizContentRenderer content={content} />;
    default:
      return <TiptapContentRenderer content={content} />;
  }
};

// Component to render Tiptap JSON content as HTML
const TiptapContentRenderer: FC<{ content: any }> = ({ content }) => {
  // Convert Tiptap JSON to HTML
  const renderContent = (node: any): string => {
    if (!node) return '';

    let html = '';

    switch (node.type) {
      case 'doc':
        html = node.content?.map(renderContent).join('') || '';
        break;
      
      case 'paragraph':
        const pContent = node.content?.map(renderContent).join('') || '';
        html = pContent ? `<p class="mb-4">${pContent}</p>` : '<p class="mb-4"></p>';
        break;
      
      case 'heading':
        const level = node.attrs?.level || 1;
        const hContent = node.content?.map(renderContent).join('') || '';
        const headingClasses = {
          1: 'text-3xl font-bold mb-6 text-[#2C3E50]',
          2: 'text-2xl font-semibold mb-4 text-[#2C3E50]',
          3: 'text-xl font-semibold mb-3 text-[#2C3E50]',
        };
        html = `<h${level} class="${headingClasses[level as keyof typeof headingClasses] || headingClasses[1]}">${hContent}</h${level}>`;
        break;
      
      case 'bulletList':
        const ulContent = node.content?.map(renderContent).join('') || '';
        html = `<ul class="list-disc list-inside mb-4 space-y-2">${ulContent}</ul>`;
        break;
      
      case 'orderedList':
        const olContent = node.content?.map(renderContent).join('') || '';
        html = `<ol class="list-decimal list-inside mb-4 space-y-2">${olContent}</ol>`;
        break;
      
      case 'listItem':
        const liContent = node.content?.map(renderContent).join('') || '';
        html = `<li class="text-[#2C3E50]">${liContent}</li>`;
        break;
      
      case 'blockquote':
        const bqContent = node.content?.map(renderContent).join('') || '';
        html = `<blockquote class="border-l-4 border-[#4ECDC4] pl-4 italic mb-4 text-[#2C3E50]/80">${bqContent}</blockquote>`;
        break;
      
      case 'codeBlock':
        const codeContent = node.content?.map(renderContent).join('') || '';
        html = `<pre class="bg-[#F7F9F9] rounded-lg p-4 mb-4 overflow-x-auto"><code class="text-sm text-[#2C3E50]">${codeContent}</code></pre>`;
        break;
      
      case 'horizontalRule':
        html = '<hr class="border-[#E5E8E8] my-6" />';
        break;
      
      case 'image':
        const src = node.attrs?.src || '';
        const alt = node.attrs?.alt || '';
        html = `<img src="${src}" alt="${alt}" class="rounded-lg max-w-full h-auto mb-4" />`;
        break;
      
      case 'text':
        let textContent = node.text || '';
        
        // Apply marks (formatting)
        if (node.marks) {
          node.marks.forEach((mark: any) => {
            switch (mark.type) {
              case 'bold':
                textContent = `<strong class="font-semibold">${textContent}</strong>`;
                break;
              case 'italic':
                textContent = `<em class="italic">${textContent}</em>`;
                break;
              case 'code':
                textContent = `<code class="bg-[#F7F9F9] px-2 py-1 rounded text-sm text-[#2C3E50]">${textContent}</code>`;
                break;
              case 'link':
                const href = mark.attrs?.href || '#';
                textContent = `<a href="${href}" class="text-[#4ECDC4] hover:text-[#4ECDC4]/80 underline" target="_blank" rel="noopener noreferrer">${textContent}</a>`;
                break;
            }
          });
        }
        
        html = textContent;
        break;
      
      case 'hardBreak':
        html = '<br />';
        break;
      
      default:
        // For unknown node types, try to render content if it exists
        html = node.content?.map(renderContent).join('') || '';
        break;
    }

    return html;
  };

  const htmlContent = renderContent(content);

  return (
    <div 
      className="prose prose-lg max-w-none text-[#2C3E50]"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

// Component to render video content
const VideoContentRenderer: FC<{ content: any }> = ({ content }) => {
  if (!content?.src) {
    return (
      <div className="text-center py-8 text-[#2C3E50]/60">
        <p>No video available for this lesson.</p>
      </div>
    );
  }

  return (
    <div className="aspect-video rounded-lg overflow-hidden bg-black">
      <video
        src={content.src}
        controls
        className="w-full h-full"
        poster={content.poster}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

// Component to render quiz content
const QuizContentRenderer: FC<{ content: any }> = ({ content }) => {
  if (!content?.questions?.length) {
    return (
      <div className="text-center py-8 text-[#2C3E50]/60">
        <p>No quiz questions available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#F7F9F9] rounded-lg p-6">
        <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">
          {content.title || 'Quiz'}
        </h3>
        {content.description && (
          <p className="text-[#2C3E50]/80 mb-4">{content.description}</p>
        )}
        <div className="flex items-center gap-4 text-sm text-[#2C3E50]/60">
          <span>{content.questions.length} questions</span>
          {content.timeLimit && <span>{content.timeLimit} minutes</span>}
          <span>Passing score: {content.passingScore}%</span>
        </div>
      </div>
      
      <div className="text-center">
        <button className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default LessonContentDisplay;