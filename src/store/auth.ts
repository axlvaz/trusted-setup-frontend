import create from 'zustand'

export type OAuthProvider = 'github' | 'eth'

type Store = {
  provider: OAuthProvider | null
  oauthToken: string | null
  idToken: string | null
  sessionId: string | null
  identity: string | null,
  error: string | null
  signin: (
    oauthToken: string,
    provider: OAuthProvider,
    idToken: string,
    sessionId: string,
    identity: string
  ) => void
  signout: () => void
  setError: (msg: string) => void
}

export const useAuthStore = create<Store>((set) => ({
  oauthToken: null,
  provider: null,
  idToken: null,
  sessionId: null,
  identity: null,
  error: null,
  signin: (oauthToken, provider, idToken, sessionId, identity) => {
    set({
      oauthToken,
      provider,
      idToken,
      sessionId,
      identity,
      error: null
    });    
  },
  signout: () =>
    set({
      oauthToken: null,
      provider: null,
      idToken: null,
      sessionId: null,
      error: null
    }),
  setError: (msg: string) => set({ error: msg })
}))
