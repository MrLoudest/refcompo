import app from './server';

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend dev server listening on http://localhost:${port}`);
});


