//src/utils/storage.ts
export const saveToken = (token: string): void => {
    localStorage.setItem('access_token', token);
  };
  
  export const getToken = (): string | null => {
    return localStorage.getItem('access_token');
  };
  
  export const removeToken = (): void => {
    localStorage.removeItem('access_token');
  };
  