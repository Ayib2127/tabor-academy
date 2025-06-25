import React from 'react';

export const Google = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...props}>
    <g>
      <path d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.79h5.48a4.68 4.68 0 01-2.03 3.07v2.55h3.28c1.92-1.77 3.03-4.38 3.03-7.41z" fill="#4285F4"/>
      <path d="M10 20c2.7 0 4.97-.9 6.63-2.44l-3.28-2.55c-.91.61-2.07.97-3.35.97-2.57 0-4.75-1.74-5.53-4.07H1.09v2.6A10 10 0 0010 20z" fill="#34A853"/>
      <path d="M4.47 11.91A5.99 5.99 0 014.09 10c0-.66.11-1.31.3-1.91V5.49H1.09A10 10 0 000 10c0 1.64.39 3.19 1.09 4.51l3.38-2.6z" fill="#FBBC05"/>
      <path d="M10 4.01c1.47 0 2.78.51 3.81 1.51l2.85-2.85C14.97 1.09 12.7 0 10 0A10 10 0 001.09 5.49l3.38 2.6C5.25 5.75 7.43 4.01 10 4.01z" fill="#EA4335"/>
    </g>
  </svg>
);

export const Facebook = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...props}>
    <rect width="20" height="20" rx="4" fill="#1877F3"/>
    <path d="M13.5 10.5h-2v6h-2v-6H7V9h2V7.75C9 6.51 9.67 6 10.75 6H13v1.5h-1.25c-.41 0-.75.34-.75.75V9h2l-.25 1.5z" fill="#fff"/>
  </svg>
);

export const LinkedIn = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...props}>
    <rect width="20" height="20" rx="4" fill="#0077B5"/>
    <path d="M6.94 8.5H4.75v6h2.19v-6zM5.84 7.5a1.13 1.13 0 110-2.25 1.13 1.13 0 010 2.25zM15.25 14.5h-2.19v-2.81c0-.67-.01-1.53-.93-1.53-.93 0-1.07.73-1.07 1.48v2.86h-2.19v-6h2.1v.82h.03c.29-.55 1-1.13 2.06-1.13 2.2 0 2.6 1.45 2.6 3.33v2.98z" fill="#fff"/>
  </svg>
);

export const SocialIcons = { Google, Facebook, LinkedIn }; 