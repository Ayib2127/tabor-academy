const createClient = jest.fn().mockImplementation(() => ({
    auth: {
      signIn: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
      getSession: jest.fn(),
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      then: jest.fn().mockResolvedValue({ data: null, error: null }),
    }),
    channel: jest.fn().mockReturnValue({
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
    }),
  }));
  
  module.exports = { createClient };