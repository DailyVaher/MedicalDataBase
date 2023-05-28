import express from 'express';
import defaultDataSource from '../datasource';
import { Doctor } from '../entities/Doctor';
import { Patient } from '../entities/Patient';
import { Visit } from '../entities/Visit';


const router = express.Router();

interface CreateVisitParams {
    patientId: number;
    doctorId: number;
    dateOfVisit: number;
    initialVisit: boolean;
    followUpVisit: boolean;
    routineVisit: boolean;
    homeVisit: boolean;
    symptoms: string;
    diagnosis: string;
    treatmentInstructions: string;
}

interface UpdateVisitParams {
    patientId: number;
    doctorId: number;
    dateOfVisit: number;
    initialVisit: boolean;
    followUpVisit: boolean;
    routineVisit: boolean;
    homeVisit: boolean;
    symptoms: string;
    diagnosis: string;
    treatmentInstructions: string;
}
  
// GET - all visits
router.get("/", async (req, res) => {
    try {
      // get visits from database
      const visits = await defaultDataSource.getRepository(Visit).find();

      if (!visits) {
        return res.status(404).json({ error: "No visits found" });
        }   
  
      // respond with list of doctorhistories in JSON format
      return res.status(200).json({ data: visits });
    } catch (error) {
        console.log("ERROR", { message: error });
  
      // respond with system error if unexpected error occurs during database query
      return res.status(500).json({ message: "Could not fetch doctor visits" });
    }
});
  
// get specific visit by patientId, doctorId and dateOfVisit
router.get("/:patientId/:doctorId/:dateOfVisit", async (req, res) => {
    try {
        // get parameters from request
        const {
            patientId,
            doctorId,
            dateOfVisit
        } = req.params;

        // find visit from database
        const visit = await defaultDataSource
            .getRepository(Visit)
            .findOne({
                where: {
                    patientId: parseInt(patientId),
                    doctorId: parseInt(doctorId),
                    dateOfVisit: parseInt(dateOfVisit)
                },
                relations: ['patient', 'doctor']
            });

        // validate if visit exists
        if (!visit) {
            return res.status(404).json({message: `VisitId: ${patientId + doctorId + dateOfVisit} does not exist!`});
        }

        // return visit in JSON format
        return res.status(200).json({data: visit});

    } catch (error) {
        console.log("ERROR", {message: error});

        // return system error if unexpected error occurs during database query
        return res.status(500).json({message: "Could not fetch visit!"});
    }
});

  
// POST - get info
router.post("/", async (req, res) => {
try {
    const { patientId, doctorId, dateOfVisit, initialVisit, followUpVisit, routineVisit, homeVisit, symptoms, diagnosis, treatmentInstructions  } = req.body as CreateVisitParams;

    // TODO: validate & santize
    if (!patientId || !doctorId || !dateOfVisit || !initialVisit || !followUpVisit || !routineVisit || !homeVisit || !symptoms || !diagnosis || !treatmentInstructions) {
    return res
        .status(400)
        .json({ error: "Complete the visit data", req: {
        
        }});
    }

    const patient = await defaultDataSource.getRepository(Patient).findOne({ where: { id: patientId } });

    if (!patient) {
    return res.status(404).json({ error: "Patient not found" });
    }

    const doctor = await defaultDataSource.getRepository(Doctor).findOne({ where: { id: doctorId } });

    if (!doctor) {
    return res.status(404).json({ error: "Doctor not found" });
    }

    const visitExists = await defaultDataSource.getRepository(Visit).findOne({ where: { dateOfVisit: dateOfVisit} });

    if (visitExists) {
    return res.status(409).json({ error: "Visit already exists" });
    }

    
    // create new doctor history  with given parameters

    const visit = Visit.create({
        patientId: patientId ?? "",
        doctorId: doctorId ?? "",
        dateOfVisit: dateOfVisit ?? "",
        initialVisit: initialVisit ?? "",
        followUpVisit: followUpVisit ?? "",
        routineVisit: routineVisit ?? "",
        homeVisit: homeVisit ?? "",
        symptoms: symptoms.trim () ?? "",
        diagnosis: diagnosis.trim () ?? "",
        treatmentInstructions: treatmentInstructions.trim () ?? "",
    });

    //save doctor history to database
    const result = await visit.save();

    return res.status(200).json({ data: result });
}   catch (error) {
    console.log("ERROR", { message: error });

    // respond with system error if unexpected error occurs during database query
    return res.status(500).json({ message: "Could not fetch visit" });
}
});

// GET - getting info (one doctor history))
router.get("/:id", async (req, res) => {
try {
    const { id } = req.params;

    // a standard ORM query with "relation" entity content (tavaline ORM päring koos "relation" entity sisuga)
    const visit = await defaultDataSource
    .getRepository(Visit)
    .findOne({ where:{id: parseInt(id)}, relations: ["patient", "doctor", "visit"] } );

    if (!visit) {
    return res.status(404).json({ error: "Visit not found" });
    }

    // respond with hospital data in JSON format (vastame haigla andmetega JSON formaadis)
    return res.status(200).json({ data: visit });
    
}    catch (error) {
        console.log("ERROR", { message: error });

    // respond with system error if unexpected error occurs during database query
    return res.status(500).json({ message: "Could not fetch visit" });
}
});

// PUT - update
router.put("/:id", async (req, res) => {
try {
    const { id } = req.params;
    const { patientId, doctorId, dateOfVisit, initialVisit, followUpVisit, routineVisit, homeVisit, symptoms, diagnosis, treatmentInstructions } = req.body as UpdateVisitParams;

    const visit = await defaultDataSource
    .getRepository(Visit)
    .findOneBy({ id: parseInt(id) });

    if (!visit) {
    return res.status(404).json({ error: "Visit not found" });
    }

    // update the data in the object (local change) (uuendame andmed objektis (lokaalne muudatus))
    visit.patientId = patientId ? patientId : visit.patientId;
    visit.doctorId = doctorId ? doctorId : visit.doctorId;
    visit.dateOfVisit = dateOfVisit ? dateOfVisit : visit.dateOfVisit;
    visit.initialVisit = initialVisit ? initialVisit : visit.initialVisit;
    visit.followUpVisit = followUpVisit ? followUpVisit : visit.followUpVisit;
    visit.routineVisit = routineVisit ? routineVisit : visit.routineVisit;
    visit.homeVisit = homeVisit ? homeVisit : visit.homeVisit;
    visit.symptoms = symptoms ? symptoms : visit.symptoms;
    visit.diagnosis = diagnosis ? diagnosis : visit.diagnosis;
    visit.treatmentInstructions = treatmentInstructions ? treatmentInstructions : visit.treatmentInstructions;

    // save the changes to the database (salvestame muudatused andmebaasi) 
    const result = await visit.save();

    // respond with updated data (vastame uuendatud andmetega)
    return res.status(200).json({ data: result });
}    catch (error) {
    console.log("ERROR", { message: error });

    // respond with system error if unexpected error occurs during database query
    return res.status(500).json({ message: "Could not update visit" });
}
});

// DELETE - kustutamine
router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;
    
        const visit = await defaultDataSource
        .getRepository(Visit)
        .findOneBy({ id: parseInt(id) });
    
        if (!visit) {
        return res.status(404).json({ error: "Visit not found" });
        }

        const result = await visit.remove();
        
        // return deleted data just in case 8tagastame igaks juhuks kustutatud andmed)
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log("ERROR", { message: error });
    
        // res
        return res.status(500).json({ message: "Could not update visit" });
    }
});

export default router;