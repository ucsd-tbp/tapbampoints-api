// Root-level hook that runs before Mocha tests.
before(function() {
  console.log(`using endpoint: http://localhost:${process.env.PORT}`);
});
