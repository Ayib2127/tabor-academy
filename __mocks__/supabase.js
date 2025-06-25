// Simple stub for Supabase client used in tests
module.exports = {
  createClient: () => ({
    auth: {
      user: () => null,
      getSession: () => ({ data: { session: null } }),
    },
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
    }),
    storage: {
      from: () => ({ upload: () => ({ data: null, error: null }) }),
    },
  }),
};
