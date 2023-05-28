import express from 'express';
import defaultDataSource from '../datasource';
import { Doctor } from '../entities/Doctor';
import { Patient } from '../entities/Patient';
import { DoctorHistory } from '../entities/DoctorHistory';


const router = express.Router();

interface CreateDoctorHistoryParams {
    startDate: number;
    doctorId: number;
    hospitalId: number;
    patientId: number;
    endDate: number;
    reasonForLeaving: string;
}

interface UpdateDoctorHistoryParams {
    startDate: number;
    doctorId: number;
    hospitalId: number;
    patientId: number;
    endDate: number;
    reasonForLeaving: string;
}
  
// GET - all doctorHistories
router.get("/", async (req, res) => {
    try {
      // get doctorhistories from database
      const doctorHistories = await defaultDataSource.getRepository(DoctorHistory).find({ relations: ['doctor', 'hospital']});

      if (!doctorHistories) {
        return res.status(404).json({ error: "Doctor histories not found" });
        }   
  
      // respond with list of doctorhistories in JSON format
      return res.status(200).json({ data: doctorHistories });
    } catch (error) {
        console.log("ERROR", { message: error });
  
      // respond with system error if unexpected error occurs during database query
      return res.status(500).json({ message: "Could not fetch doctor histories" });
    }
});
  
  
// POST - get info
router.post("/", async (req, res) => {
try {
    const { startDate, doctorId, hospitalId, patientId, endDate, reasonForLeaving } = req.body as CreateDoctorHistoryParams;

    // TODO: validate & santize
    if (!startDate || !doctorId || !hospitalId || !patientId || !endDate || !reasonForLeaving) {
    return res
        .status(400)
        .json({ error: "Complete doctor history`s data", req: {
        
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
    
    // create new doctor history  with given parameters

    const doctorHistory = DoctorHistory.create({
        startDate: startDate ?? "",
        doctorId: doctorId ?? "",
        patientId: patientId ?? "",
        hospitalId: hospitalId ?? "",
        endDate: endDate ?? "",
        reasonForLeaving: reasonForLeaving.trim () ?? "",
    });

    //save doctor history to database
    const result = await doctorHistory.save();

    return res.status(200).json({ data: result });
}   catch (error) {
    console.log("ERROR", { message: error });

    // respond with system error if unexpected error occurs during database query
    return res.status(500).json({ message: "Could not fetch doctor history" });
}
});

// GET - getting info (one doctor history))
router.get("/:id", async (req, res) => {
try {
    const { id } = req.params;

    // a standard ORM query with "relation" entity content (tavaline ORM päring koos "relation" entity sisuga)
    const doctorHistory = await defaultDataSource
    .getRepository(DoctorHistory)
    .findOne({ where:{startDate: parseInt(id)}, relations: ['patient', 'doctor'] });

    if (!doctorHistory) {
    return res.status(404).json({ error: "Doctor history not found" });
    }

    // respond with hospital data in JSON format (vastame haigla andmetega JSON formaadis)
    return res.status(200).json({ data: doctorHistory });
    
}    catch (error) {
        console.log("ERROR", { message: error });

    // respond with system error if unexpected error occurs during database query
    return res.status(500).json({ message: "Could not fetch doctor history" });
}
});

// PUT - update
router.put("/:id", async (req, res) => {
try {
    const { id } = req.params;
    const { startDate, doctorId, hospitalId, patientId, endDate, reasonForLeaving } = req.body as UpdateDoctorHistoryParams;

    const doctorHistory = await defaultDataSource
    .getRepository(DoctorHistory)
    .findOneBy({ startDate: parseInt(id) });

    if (!doctorHistory) {
    return res.status(404).json({ error: "Doctor history not found" });
    }

    // update the data in the object (local change) (uuendame andmed objektis (lokaalne muudatus))
    doctorHistory.startDate = startDate ? startDate : doctorHistory.startDate;
    doctorHistory.doctorId = doctorId ? doctorId : doctorHistory.doctorId;
    doctorHistory.patientId = patientId ? patientId : doctorHistory.patientId;
    doctorHistory.hospitalId = hospitalId ? hospitalId : doctorHistory.hospitalId;
    doctorHistory.endDate = endDate ? endDate : doctorHistory.endDate;
    doctorHistory.reasonForLeaving = reasonForLeaving ? reasonForLeaving : doctorHistory.reasonForLeaving;

    // save the changes to the database (salvestame muudatused andmebaasi) 
    const result = await doctorHistory.save();

    // respond with updated data (vastame uuendatud andmetega)
    return res.status(200).json({ data: result });
}    catch (error) {
    console.log("ERROR", { message: error });

    // respond with system error if unexpected error occurs during database query
    return res.status(500).json({ message: "Could not update doctor history " });
}
});

// DELETE - kustutamine
router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;
    
        const doctorHistory = await defaultDataSource
        .getRepository(DoctorHistory)
        .findOneBy({ startDate: parseInt(id) });
    
        if (!doctorHistory) {
        return res.status(404).json({ error: "Hospital not found" });
        }

        const result = await doctorHistory.remove();
        
        // return deleted data just in case 8tagastame igaks juhuks kustutatud andmed)
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log("ERROR", { message: error });
    
        // res
        return res.status(500).json({ message: "Could not update doctor history" });
    }
});

export default router;