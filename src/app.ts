import express from "express";
import patientsRouter from "./routes/patients.router";
import doctorsRouter from "./routes/doctors.router";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 *
 */
app.get("/api", (req, res) => {
  // output APIdoc page
  res.end("Hello");
});

// GET - info päring (kõik artiklid)
app.use("/api/patients", patientsRouter);
app.use("/api/doctors", doctorsRouter);

export default app;