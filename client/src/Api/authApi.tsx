import http from './http';

export const loginOrSignUp = async (data: { uId: string; email?: string | null; displayName?: string | null, photoURL?: string | null}) =>
  await http.post('/auth/loginOrSignUp', data);