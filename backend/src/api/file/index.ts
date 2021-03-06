export default (app) => {
  app.post(
    `/file/upload`,
    require('./localhost/upload').default,
  );
  app.get(
    `/file/download`,
    require('./localhost/download').default,
  );
  app.get(
    `/file/credentials`,
    require('./credentials').default,
  );
};
