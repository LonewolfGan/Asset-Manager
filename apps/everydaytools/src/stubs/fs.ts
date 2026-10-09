const noop = () => {};
const noopStr = () => "";

export const readFileSync = noopStr;
export const writeFileSync = noop;
export const existsSync = () => false;
export const mkdirSync = noop;
export const readdirSync = () => [];
export const statSync = () => ({});
export const unlinkSync = noop;
export const createReadStream = noop;
export const createWriteStream = noop;
export default {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  unlinkSync,
  createReadStream,
  createWriteStream,
};
