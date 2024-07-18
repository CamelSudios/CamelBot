import fs from 'fs';

fs.readFile('.env', 'utf8', (err, data) => {
  let res = [];
  data.split('\n').forEach((line) => {
    let [key, value] = line.split('=');
    if (key && value) {
      res.push(`${key}=${'X'.repeat(value.length)}`);
    } else {
      res.push(line);
    }
  });
  fs.writeFile('.env.example', res.join('\n'), (err) => {});
});
