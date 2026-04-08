export const config = {
  baseURL: process.env.BASE_URL,
  login: process.env.LOGIN,
  password: process.env.PASSWORD,
  jwtToken: process.env.JWT_TOKEN,
};

export function getLoginUrl() {
  return `${process.env.BASE_URL}/#/login`;
}

export function getBaseUrl() {
  return `${process.env.BASE_URL}/#/`;
}