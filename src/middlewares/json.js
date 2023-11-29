export async function json(req, res) {
  const buffers = [];

  // We are going through all the stream here
  for await (const chunk of req) {
    buffers.push(chunk);
  }

  // Tenta dar um parse no body caso exista
  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString());
  } catch {
    req.body = null;
  }

  res.setHeader('Content-Type', 'application/json');
}
