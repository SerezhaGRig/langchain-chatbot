import * as readline from "node:readline";

const rl = readline.createInterface(process.stdin, process.stdout);
export const question = function (q: string): Promise<string> {
  return new Promise((res) => {
    rl.question(q, (answer) => {
      res(answer);
    });
  });
};
