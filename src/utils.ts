import {exec, spawn}  from 'child_process';

export const runCmd = async (cmd: string, options?: any) => {
  return new Promise((resolve, reject) => {
    exec(cmd, options, (err, stdout) => {
      if (err) {
        reject({ err, stdout });
      } else {
        resolve(stdout);
      }
    });
  });
};

// TODO: close this, make the abillity it will stop the stream
export const runCmdSpawn = (cmd: string, args: string[], onData: (data: string) => void) => {
  const process = spawn(cmd, args);

  process.stdout.on('data', (data) => {
    onData(data.toString());
  });

  process.stderr.on('data', (data) => {
    onData(data.toString());
  });

  return process;
};
