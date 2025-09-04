const { exec } = require("node:child_process");

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout, _stderr) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgres();
      return;
    }

    // eslint-disable-next-line no-console
    console.log("\n\n\n✅ PostgreSQL is ready!\n");
  }
}

process.stdout.write("\n\n⏳⏳⏳ Waiting for PostgreSQL to be ready...");

checkPostgres();
