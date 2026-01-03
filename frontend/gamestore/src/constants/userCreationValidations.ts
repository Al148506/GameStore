 export const PASSWORD_RULES = {
  minLength: 8,
  hasUppercase: /[A-Z]/,
  hasDigit: /\d/,
  hasNonAlphanumeric: /[^a-zA-Z0-9]/,
};

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;