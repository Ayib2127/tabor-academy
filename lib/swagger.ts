export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Tabor Digital Academy API',
    version: '1.0.0',
    description: 'API documentation for Tabor Digital Academy',
  },
  paths: {
    '/api/auth/login': {
      post: {
        summary: 'Authenticate a user',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', format: 'password' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login successful' },
          401: { description: 'Invalid credentials' },
          500: { description: 'Server error' },
        },
      },
    },
    // Add more endpoints here as needed
  },
};
