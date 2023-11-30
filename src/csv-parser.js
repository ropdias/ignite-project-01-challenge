import fs from 'fs';
import { parse } from 'csv-parse';

const csvPath = new URL('tasks.csv', import.meta.url);

const processFile = async () => {
  const records = [];
  const parser = fs.createReadStream(csvPath).pipe(
    parse({
      // CSV options if any
    })
  );
  for await (const record of parser) {
    // Work with each record
    records.push(record);
  }
  return records;
};

(async () => {
  const records = await processFile();
  records.forEach((record) => {
    const task = {
      title: record[0],
      description: record[1],
    };
    fetch('http://localhost:3333/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
      duplex: 'half',
    })
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        return;
      });
    // console.log(JSON.stringify(newTask));
  });
})();
