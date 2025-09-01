import axios from 'axios';

export const API_URL = 'https://digital-talim-bot.onrender.com/admin/login';

interface LoginResponse {
  message: string;
  access_token: string;
}

export const loginAdmin = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(API_URL, { email, password });
  return response.data;
};
