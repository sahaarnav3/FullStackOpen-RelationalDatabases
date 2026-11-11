const Sequelize = require("sequelize");
const { DATABASE_URL, TEST_DATABASE_URL } = require("./config");
const { Umzug, SequelizeStorage } = require("umzug");

// console.log("configggg", process.env.TESTING, process.env.TESTING === "true" ? TEST_DATABASE_URL : DATABASE_URL);
const sequelize = new Sequelize(process.env.TESTING === "true" ? TEST_DATABASE_URL : DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    // ssl: {
    //     require: true,
    //     rejectUnauthorized: false
    // }
  },
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations(); //although they are supposed to be run manually in prod. The current method is only for dev.
    console.log("connected to the database");
  } catch (error) {
    console.log("failed to connect to the database", error);
    return process.exit(1);
  }
  return null;
};

const migrationConf = {
  migrations: {
    glob: 'migrations/*.js',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
}

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf)
  const migrations = await migrator.up()
  console.log("Migrations up to date", {
    files: migrations.map((mig) => mig.name),
  })
};

const rollbackMigration = async() => {
  await sequelize.authenticate();
  const migrator = new Umzug(migrationConf);
  await migrator.down();
}

module.exports = { connectToDatabase, sequelize, rollbackMigration };
