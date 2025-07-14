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
  console.log("TiptapContentRenderer content:", content);
  // Helper: Check if heading should be orange-highlighted
  const isOrangeHeading = (text: string) => {
    const keywords = ["Key", "Guidelines", "Submission", "Grading", "Criteria"];
    return keywords.some((kw) => text.toLowerCase().includes(kw.toLowerCase()));
  };

  // Track if last node was an orange heading (for section highlight)
  let lastWasOrangeHeading = false;

  // Convert Tiptap JSON to HTML
  const renderContent = (node: any): string => {
    if (!node) return "";

    let html = "";

    switch (node.type) {
      case "doc":
        html = node.content?.map(renderContent).join("") || "";
        break;

      case "paragraph": {
        const pContent = node.content?.map(renderContent).join("") || "";
        html = pContent ? `<p class="mb-4 leading-relaxed text-[#2C3E50]">${pContent}</p>` : '<p class="mb-4"></p>';
        break;
      }

      case "heading": {
        const level = node.attrs?.level || 1;
        const hContent = node.content?.map(renderContent).join("") || "";
        const headingStyles: Record<number, string> = {
          1: "text-3xl font-bold mb-6 mt-8 text-[#FF6B35]",
          2: "text-2xl font-bold mb-4 mt-6 text-[#4ECDC4]",
          3: "text-xl font-semibold mb-3 mt-4 text-[#2C3E50]",
        };
        html = `<h${level} class="${headingStyles[level] || "text-lg font-semibold mb-2 mt-3 text-[#2C3E50]"}">${hContent}</h${level}>`;
        break;
      }

      case "bulletList": {
        const ulContent = node.content?.map(renderContent).join("") || "";
        // Change 'list-inside' to 'list-outside'
        html = `<ul class="list-disc list-outside mb-4">${ulContent}</ul>`;
        break;
      }

      case "orderedList": {
        const olContent = node.content?.map(renderContent).join("") || "";
        // Change 'list-inside' to 'list-outside'
        html = `<ol class="list-decimal list-outside mb-4">${olContent}</ol>`;
        break;
      }

      case "listItem": {
        const liContent = node.content?.map(renderContent).join("") || "";
        html = `<li class="text-[#2C3E50]">${liContent}</li>`;
        break;
      }

      case "blockquote": {
        const bqContent = node.content?.map(renderContent).join("") || "";
        html = `<blockquote class="border-l-4 border-[#4ECDC4] pl-4 italic mb-4 bg-[#F7F9F9] text-[#2C3E50]/80 rounded">${bqContent}</blockquote>`;
        break;
      }

      case "codeBlock": {
        const codeContent = node.content?.map(renderContent).join("") || "";
        html = `<pre class="bg-[#F7F9F9] rounded-lg p-4 mb-4 overflow-x-auto"><code class="text-sm font-mono text-[#2C3E50]">${codeContent}</code></pre>`;
        break;
      }

      case "horizontalRule":
        html = '<hr class="border-[#E5E8E8] my-6" />';
        break;

      case "image": {
        const src = node.attrs?.src || "";
        const alt = node.attrs?.alt || "";
        html = `<img src="${src}" alt="${alt}" class="rounded-lg max-w-full h-auto mb-4 shadow" />`;
        break;
      }

      case "text": {
        let textContent = node.text || "";
        if (node.marks) {
          node.marks.forEach((mark: any) => {
            switch (mark.type) {
              case "bold":
                textContent = `<strong class="font-semibold">${textContent}</strong>`;
                break;
              case "italic":
                textContent = `<em class="italic">${textContent}</em>`;
                break;
              case "code":
                textContent = `<code class="bg-[#F7F9F9] px-2 py-1 rounded text-sm font-mono text-[#2C3E50]">${textContent}</code>`;
                break;
              case "link":
                const href = mark.attrs?.href || "#";
                textContent = `<a href="${href}" class="text-[#4ECDC4] hover:underline" target="_blank" rel="noopener noreferrer">${textContent}</a>`;
                break;
            }
          });
        }
        html = textContent;
        break;
      }

      case "hardBreak":
        html = "<br />";
        break;

      case "callout": {
        const calloutType = node.attrs?.type || "info"; // info, tip, warning, success
        const iconMap = {
          info: "ℹ️",
          tip: "💡",
          warning: "⚠️",
          success: "✅",
        };
        const colorMap = {
          info: "bg-[#E5E8E8] text-[#2C3E50]",
          tip: "bg-[#4ECDC4]/10 text-[#2C3E50]",
          warning: "bg-[#FF6B35]/10 text-[#FF6B35]",
          success: "bg-[#4ECDC4]/20 text-[#2C3E50]",
        };
        const content = node.content?.map(renderContent).join("") || "";
        html = `<div class="flex items-start gap-2 p-4 rounded-lg mb-4 ${colorMap[calloutType]}">
          <span class="text-2xl">${iconMap[calloutType]}</span>
          <div>${content}</div>
        </div>`;
        break;
      }

      case "table": {
        const tableContent = node.content?.map(renderContent).join("") || "";
        html = `<table class="my-6 w-full border-collapse rounded-lg overflow-hidden shadow">${tableContent}</table>`;
        break;
      }
      case "tableRow": {
        const rowContent = node.content?.map(renderContent).join("") || "";
        html = `<tr>${rowContent}</tr>`;
        break;
      }
      case "tableCell": {
        const cellContent = node.content?.map(renderContent).join("") || "";
        html = `<td class="border border-[#E5E8E8] px-4 py-2 align-top">${cellContent}</td>`;
        break;
      }
      case "tableHeader": {
        const headerContent = node.content?.map(renderContent).join("") || "";
        html = `<th class="border border-[#E5E8E8] px-4 py-2 bg-[#F7F9F9] text-[#2C3E50] font-bold">${headerContent}</th>`;
        break;
      }
      case "taskList": {
        const listContent = node.content?.map(renderContent).join("") || "";
        // Modern background, padding, and rounded corners for the checklist group
        html = `<ul data-type="taskList" class="mb-4 bg-[#F7F9F9] rounded-lg p-6">${listContent}</ul>`;
        break;
      }
      case "taskItem": {
        // Interactive checkboxes (UI only, not persisted)
        const checked = node.attrs?.checked ? "checked" : "";
        const itemContent = node.content?.map(renderContent).join("") || "";
        html = `
          <li class="flex items-center mb-3 group">
            <label class="flex items-center cursor-pointer w-full">
              <input
                type="checkbox"
                class="accent-[#4ECDC4] mr-3 w-5 h-5 rounded border border-[#E5E8E8] transition-all duration-150 group-hover:ring-2 group-hover:ring-[#4ECDC4]"
                ${checked}
                onclick="this.checked = !this.checked"
              />
              <span class="text-[#2C3E50] text-base">${itemContent}</span>
            </label>
          </li>
        `;
        break;
      }

      default:
        html = node.content?.map(renderContent).join("") || "";
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