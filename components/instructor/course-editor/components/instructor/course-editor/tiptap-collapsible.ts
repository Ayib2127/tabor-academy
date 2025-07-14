import { Node, mergeAttributes } from '@tiptap/core';

export const Collapsible = Node.create({
  name: 'collapsible',
  group: 'block',
  content: 'block+',
  defining: true,
  addAttributes() {
    return {
      summary: {
        default: 'Details',
        parseHTML: element => element.getAttribute('data-summary') || 'Details',
        renderHTML: attributes => ({ 'data-summary': attributes.summary }),
      },
      open: {
        default: false,
        parseHTML: element => element.hasAttribute('open'),
        renderHTML: attributes => (attributes.open ? { open: '' } : {}),
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'details',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'details',
      mergeAttributes(HTMLAttributes),
      ['summary', {}, HTMLAttributes['data-summary'] || 'Details'],
      0,
    ];
  },
  addCommands() {
    return {
      setCollapsible:
        (summary = 'Details') =>
        ({ commands }) => {
          return commands.wrapIn(this.name, { summary });
        },
      unsetCollapsible:
        () =>
        ({ commands }) => {
          return commands.lift(this.name);
        },
    };
  },
});