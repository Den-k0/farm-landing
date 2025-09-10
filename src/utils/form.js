/** Encode object to x-www-form-urlencoded string */
export function encode(data) {
  return Object.keys(data)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
    .join('&')
}

/** Validate contact form fields. Returns error message or null */
export function validateContact({ firstName, email, message }) {
  if (!firstName.trim() || !email.trim() || !message.trim()) {
    return 'Заповніть обовʼязкові поля.'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Некоректний email.'
  }
  return null
}
