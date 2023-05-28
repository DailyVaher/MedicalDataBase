import express from 'express';
import defaultDataSource from '../datasource';
import { Patient } from '../entities/Patient';
import { Doctor } from '../entities/Doctor';
import { Drug } from '../entities/Drug';
import { Prescription } from '../entities/Prescription';

const router = express.Router();

interface CreatePrescriptionParams {
    drugId: number;
    doctorId: number;
    patientId: number;
    datePrescribed: Date;
    dosage: string;
    duration: string;
    refillable: boolean;
    numOfRefills: number; 
    comments: string;  
}

interface UpdatePrescriptionParams {
    drugId: number;
    doctorId: number;
    patientId: number;
    datePrescribed: Date;
    dosage: string;
    duration: string;
    refillable: boolean;
    numOfRefills: number; 
    comments: string;  
    
}
// GET - all recipes
router.get("/", async (req, res) => {
    try {
      // ask database for all recipes
      const prescriptions = await defaultDataSource.getRepository(Prescription).find();
  
      // respond with list of recipes in JSON format
      return res.status(200).json({ data: prescriptions });
    } catch (error) {
      console.log("ERROR", { message: error });
  
      // respond with system error if unexpected error occurs during database query
      return res.status(500).json({ message: "There are currently no recipes" });
    }
});
  
  
// POST - sending info
router.post("/", async (req, res) => {
try {
    const { drugId, doctorId, patientId, datePrescribed, dosage, duration, refillable, numOfRefills, comments} = req.body as CreatePrescriptionParams;

    // TODO: validate & santize
    if (!drugId || !doctorId || !patientId || !datePrescribed || !dosage || !duration || !refillable || !numOfRefills ||!comments) {
    return res
        .status(400)
        .json({ error: "Prescription data is not complete" });
    }

     // NOTE: a problem may arise if the ID field is provided with an undefined value (võib tekkida probleeme kui ID väljale kaasa anda "undefined" väärtus)
    // look for patient related to prescription 
    const patient = await Patient.findOneBy({id: patientId});    

    if(!patient) {
    return res.status(400).json({ message: "Patient with given ID not found" });
    }

    // look for a doctor related to the prescription
    const doctor = await Doctor.findOneBy({id: doctorId});    

    if(!doctor) {
    return res.status(400).json({ message: "Doctor with given ID not found" });
    }

    // look for a drug related to the prescription
    const drug = await Drug.findOneBy({id: drugId});    

    if(!drug) {
    return res.status(400).json({ message: "Drug with given ID not found" });
    }


    // create new prescription with given parameters
    const prescription = new Prescription();
    prescription.drugId = drugId;
    prescription.doctorId = doctorId;
    prescription.patientId = String(patientId);
    prescription.datePrescribed = datePrescribed;
    prescription.dosage = dosage;
    prescription.duration = duration;
    prescription.refillable = refillable;
    prescription.numOfRefills = numOfRefills;
    prescription.comments = comments;

    //save prescription to database
    const result = await prescription.save();

    return res.status(200).json({ data: result });
} catch (error) {
    console.log("ERROR", { message: error });

    // respond with system error if unexpected error occurs during database query
    return res.status(500).json({ message: "Could not fetch prescriptions" });
}
});

// GET - get one recipe
router.get("/:id", async (req, res) => {
try {
    const { id } = req.params;

    const prescription = await defaultDataSource
    .getRepository(Prescription)
    .findOneBy({ id: parseInt(id) });

    return res.status(200).json({ data: prescription });
} catch (error) {
    console.log("ERROR", { message: error });

    // respond with system error if unexpected error occurs during database query
    return res.status(500).json({ message: "Could not fetch prescription" });
}
});

// PUT - update
router.put("/:id", async (req, res) => {
try {
    const { id } = req.params;
    const { drugId, doctorId, patientId, datePrescribed, dosage, duration, refillable, numOfRefills, comments} = req.body as UpdatePrescriptionParams;

    const prescription = await defaultDataSource
    .getRepository(Prescription)
    .findOneBy({ id: parseInt(id) });

    if (!prescription) {
    return res.status(404).json({ error: "Prescription not found" });
    }


    // update prescription with given parameters
    prescription.drugId = drugId ?? prescription.drugId;
    prescription.doctorId = doctorId ?? prescription.doctorId;
    prescription.patientId = patientId ? String(patientId) : prescription.patientId;
    prescription.datePrescribed = datePrescribed ? datePrescribed : prescription.datePrescribed;
    prescription.dosage = dosage ? dosage : prescription.dosage;
    prescription.duration = duration ? duration : prescription.duration;
    prescription.refillable = refillable ? refillable : prescription.refillable;
    prescription.numOfRefills = numOfRefills ? numOfRefills : prescription.numOfRefills;
    prescription.comments = comments ? comments : prescription.comments;

    
    //save the changes to database
    const result = await prescription.save();

  // send back the updated data (saadame vastu uuendatud andmed (kui midagi töödeldakse serveris on seda vaja kuvada))
    return res.status(200).json({ data: result });
} catch (error) {
    console.log("ERROR", { message: error });

    //respond with system error if unexpected error occurs during database query
    return res.status(500).json({ message: "Could not update prescription" });
}
});

// DELETE - kustutamine
router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;
    
        const prescription = await defaultDataSource
        .getRepository(Prescription)
        .findOneBy({ id: parseInt(id) });
    
        if (!prescription) {
        return res.status(404).json({ error: "Prescription could not found" });
        }

        const result = await prescription.remove();
        
         // return deleted data just in case (tagastame igaks juhuks kustutatud andmed)
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log("ERROR", { message: error });
    
        // respond with system error if unexpected error occurs during database query
        return res.status(500).json({ message: "Could not update prescription" });
    }
});

export default router;