import { DataSource } from "typeorm";
import { config } from "./config";
import{Patient} from "./entities/Patient";
import{Doctor} from "./entities/Doctor";
import "reflect-metadata"
import { DoctorHistory } from "./entities/DoctorHistory";
import { Drug } from "./entities/Drug";
import { FollowUpVisit } from "./entities/FollowUpVisit";
import { Hospital } from "./entities/Hospital";
import { InitialVisit } from "./entities/InitialVisit";
import { InsuranceCompany } from "./entities/InsuranceCompany";
import { OfficeVisit } from "./entities/OfficeVisit";
import { Prescription } from "./entities/Prescription";
import { RoutineVisit } from "./entities/RoutineVisit";

// andmebaasiühenduse konfguratsioon
const defaultDataSource = new DataSource({
  type: "mysql",
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.db,
  entities: [Patient, Doctor, DoctorHistory, Drug, FollowUpVisit, Hospital, InitialVisit, InsuranceCompany, OfficeVisit, Patient, Prescription, RoutineVisit],
  synchronize: true,
  logging: false
});

// kontrollime üle kas andmebaasi ühendust on võimalik luua
defaultDataSource
  .initialize()
  .then(() => {
    console.log("Database initialized...");
  })
  .catch((err) => {
    console.log("Error initializing database", err);
  });

export default defaultDataSource;
