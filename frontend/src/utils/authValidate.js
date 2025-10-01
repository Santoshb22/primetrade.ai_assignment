export const validateLogin = (formData) => {
  const errors = {};

  if (!formData.username.trim()) {
    errors.username = "Username or Email is required";
  }

  if (!formData.password.trim()) {
    errors.password = "Password is required";
  } else if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};

export const validateRegister = (formData) => {
  const errors = {};

  if (!formData.name.trim()) {
    errors.name = "Full name is required";
  }

  if (!formData.username.trim()) {
    errors.username = "Username is required";
  } else if (formData.username.length < 4) {
    errors.username = "Username must be at least 4 characters";
  }

  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!formData.password.trim()) {
    errors.password = "Password is required";
  } else if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!formData.avatar) {
    errors.avatar = "Avatar image is required";
  }

  return errors;
};
