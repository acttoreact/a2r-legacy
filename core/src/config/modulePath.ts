import path from 'path';

const parts = __dirname.split(path.sep);
let res = '';
for (let i = parts.length - 1; i >= 0 && !res; i -= 1) {
  if (parts[i] === 'a2r') {
    res = parts.slice(0, i + 1).join(path.sep);
  }
}

const modulePath = res;

export default modulePath;
