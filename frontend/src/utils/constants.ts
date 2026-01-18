console.log('ALL ENV:', import.meta.env);
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('VITE_CDN_URL:', import.meta.env.VITE_CDN_URL);

export const API_URL = import.meta.env.VITE_API_URL ?? '/api/afisha';
export const CDN_URL = import.meta.env.VITE_CDN_URL ?? '/content/afisha';

console.log('Final API_URL:', API_URL);
console.log('Final CDN_URL:', CDN_URL);