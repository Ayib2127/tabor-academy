import { Node, mergeAttributes } from '@tiptap/core';

export interface CalloutOptions {
  types: string[];
  defaultType: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    callout: {
      setCallout: (type?: string) => ReturnType;
      toggleCallout: (type?: string) => ReturnType;
      unsetCallout: () => ReturnType;
    };
  }
}

export const Callout = Node.create<CalloutOptions>({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,
  addOptions() {
    return {
      types: ['info', 'tip', 'warning', 'success'],
      defaultType: 'info',
    };
  },
  addAttributes() {
    return {
      type: {
        default: this.options.defaultType,
        parseHTML: element => element.getAttribute('data-type') || this.options.defaultType,
        renderHTML: attributes => ({ 'data-type': attributes.type }),
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'div[data-type]',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'tiptap-callout', 'data-type': HTMLAttributes.type }), 0];
  },
  addCommands() {
    return {
      setCallout:
        (type = this.options.defaultType) =>
        ({ commands }) => {
          return commands.wrapIn(this.name, { type });
        },
      toggleCallout:
        (type = this.options.defaultType) =>
        ({ commands }) => {
          return commands.toggleWrap(this.name, { type });
        },
      unsetCallout:
        () =>
        ({ commands }) => {
          return commands.lift(this.name);
        },
    };
  },
}); 