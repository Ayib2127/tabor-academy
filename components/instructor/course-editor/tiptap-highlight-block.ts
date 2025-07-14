import { Node, mergeAttributes } from '@tiptap/core';

export const HighlightBlock = Node.create({
  name: 'highlightBlock',
  group: 'block',
  content: 'inline*',
  defining: true,
  addAttributes() {
    return {
      label: {
        default: 'Key Point',
        parseHTML: element => element.getAttribute('data-label') || 'Key Point',
        renderHTML: attributes => ({ 'data-label': attributes.label }),
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'div[data-highlight-block]',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-highlight-block': '', class: 'tiptap-highlight-block' }),
      ['span', { class: 'tiptap-highlight-label' }, HTMLAttributes['data-label'] || 'Key Point'],
      0,
    ];
  },
  addCommands() {
    return {
      setHighlightBlock:
        (label = 'Key Point') =>
        ({ commands }) => {
          return commands.wrapIn(this.name, { label });
        },
      unsetHighlightBlock:
        () =>
        ({ commands }) => {
          return commands.lift(this.name);
        },
    };
  },
}); 