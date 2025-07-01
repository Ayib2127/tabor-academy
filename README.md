# Tabor Digital Academy

A modern, interactive e-learning platform designed to rapidly equip individuals from Ethiopia's emerging markets with entrepreneurial, digital, and freelancing skills.

## Features

- Comprehensive learning management system
- Personalized learning paths
- Community features (forums, challenges, study groups)
- Mentorship system
- Mobile-first design with offline capabilities
- Multi-language support
- Secure authentication and authorization
- Payment processing integration

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **State Management**: React Hooks
- **Form Handling**: React Hook Form, Zod
- **Authentication**: JWT
- **Testing**: Jest, React Testing Library, Playwright
- **Performance Monitoring**: Lighthouse, Sentry
- **Analytics**: Google Analytics

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 8.x or later

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/tabor-digital-academy.git
cd tabor-digital-academy
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add the required environment variables.

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

### Unit Tests

```bash
npm run test
```

### End-to-End Tests

```bash
npm run test:e2e
```

### Performance Tests

```bash
npm run test:perf
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

Quick deployment commands:

```bash
# Interactive deployment script
npm run deploy

# Deploy to Vercel
npm run deploy:vercel

# Deploy to Netlify
npm run deploy:netlify
```

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   ├── (routes)/         # Page routes
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── ui/               # UI components
│   └── ...               # Other components
├── lib/                  # Utility functions
│   ├── utils/            # Helper utilities
│   └── ...               # Other libraries
├── public/               # Static assets
├── tests/                # Test files
│   ├── __tests__/        # Jest tests
│   └── e2e/              # Playwright tests
├── scripts/              # Utility scripts
├── middleware.ts         # Next.js middleware
├── next.config.js        # Next.js configuration
└── ...                   # Other configuration files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)