export const generatePassword = (
  length: number,
  options: { uppercase: boolean; lowercase: boolean; numbers: boolean; symbols: boolean }
): string => {
  const charsets = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-="
  };

  let allowedChars = "";
  if (options.uppercase) allowedChars += charsets.uppercase;
  if (options.lowercase) allowedChars += charsets.lowercase;
  if (options.numbers) allowedChars += charsets.numbers;
  if (options.symbols) allowedChars += charsets.symbols;

  if (!allowedChars) return "";

  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  
  let password = "";
  for (let i = 0; i < length; i++) {
    password += allowedChars[array[i] % allowedChars.length];
  }
  return password;
};

export const calculateEntropy = (
  length: number,
  options: { uppercase: boolean; lowercase: boolean; numbers: boolean; symbols: boolean }
): number => {
  let poolSize = 0;
  if (options.uppercase) poolSize += 26;
  if (options.lowercase) poolSize += 26;
  if (options.numbers) poolSize += 10;
  if (options.symbols) poolSize += 32; // Approx

  if (poolSize === 0) return 0;
  return length * Math.log2(poolSize);
};

export const getEntropyLabel = (entropy: number): string => {
  if (entropy < 40) return "Weak";
  if (entropy < 60) return "Fair";
  if (entropy < 80) return "Strong";
  if (entropy < 100) return "Very Strong";
  return "Exceptional";
};
