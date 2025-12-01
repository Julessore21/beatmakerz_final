import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/context/AuthContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('gère un parcours complet inscription puis connexion', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let signupResult = false;
    await act(async () => {
      signupResult = await result.current.signup('beatfan', 'secure');
    });

    expect(signupResult).toBe(true);
    await waitFor(() => expect(result.current.user).toBe('beatfan'));
    expect(window.localStorage.getItem('currentUser')).toBe('beatfan');

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(window.localStorage.getItem('currentUser')).toBeNull();

    let loginResult = false;
    await act(async () => {
      loginResult = await result.current.login('beatfan', 'secure');
    });

    expect(loginResult).toBe(true);
    await waitFor(() => expect(result.current.user).toBe('beatfan'));
  });

  it('refuse une connexion avec un mauvais mot de passe', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signup('wrongpass', 'good');
    });

    let loginOk = true;
    await act(async () => {
      loginOk = await result.current.login('wrongpass', 'bad');
    });

    expect(loginOk).toBe(false);
    expect(result.current.user).toBe('wrongpass');
  });
});
