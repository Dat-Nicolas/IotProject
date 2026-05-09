const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ErrorPayload = {
  message?: string | string[];
};

type ApiErrorLike = {
  message?: string | string[];
  error?: string;
  data?: ErrorPayload | string;
};

const normalizeMessage = (message: unknown): string | null => {
  if (Array.isArray(message)) {
    const joined = message.filter((item): item is string => typeof item === 'string').join('\n');
    return joined.length > 0 ? joined : null;
  }

  if (typeof message === 'string' && message.trim().length > 0) {
    return message;
  }

  return null;
};

export const normalizeEmail = (email: string): string => email.trim().toLowerCase();

export const isValidEmail = (email: string): boolean => EMAIL_REGEX.test(normalizeEmail(email));

export const validateLoginForm = (payload: {
  email: string;
  password: string;
}): string | null => {
  if (!payload.email.trim()) {
    return 'Email là bắt buộc';
  }

  if (!isValidEmail(payload.email)) {
    return 'Email không hợp lệ';
  }

  if (!payload.password) {
    return 'Mật khẩu là bắt buộc';
  }

  return null;
};

export const validateRegisterForm = (payload: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): string | null => {
  if (!payload.fullName.trim()) {
    return 'Tên đầy đủ là bắt buộc';
  }

  if (payload.fullName.trim().length < 2) {
    return 'Tên phải có ít nhất 2 ký tự';
  }

  const loginValidation = validateLoginForm({
    email: payload.email,
    password: payload.password,
  });

  if (loginValidation) {
    return loginValidation;
  }

  if (payload.password.length < 6) {
    return 'Mật khẩu phải có ít nhất 6 ký tự';
  }

  if (payload.password !== payload.confirmPassword) {
    return 'Xác nhận mật khẩu không khớp';
  }

  return null;
};

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (typeof error === 'object' && error !== null) {
    const value = error as ApiErrorLike;
    const messageFromData =
      typeof value.data === 'string'
        ? normalizeMessage(value.data)
        : normalizeMessage(value.data?.message);

    if (messageFromData) {
      return messageFromData;
    }

    const message = normalizeMessage(value.message);
    if (message) {
      return message;
    }

    const rawError = normalizeMessage(value.error);
    if (rawError) {
      return rawError;
    }
  }

  return fallback;
};
