import express from 'express';
import defaultDataSource from '../datasource';
import { Patient } from '../entities/Patient';
import { Doctor } from '../entities/Doctor';
import { Drug } from '../entities/Drug';
import { Prescription } from '../entities/Prescription';

const router = express.Router();

interface CreatePrescriptionParams {
    drugId: number;
    drugName: string;
    doctorId: number;
    doctorName: string;
    patientId: number;
    patientName: string;
    datePrescribed: Date;
    dosage: string;
    duration: string;
    refillable: boolean;
    numOfRefills: string;   
}

interface UpdatePrescriptionParams {
    drugId: number;
    drugName: string;
    doctorId: number;
    doctorName: string;
    patientId: number;
    patientName: string;
    datePrescribed: Date;
    dosage: string;
    duration: string;
    refillable: boolean;
    numOfRefills: string;   
    
}
// GET - info päring (kõik retseptid)
router.get("/", async (req, res) => {
    try {
      // küsi retseptid andmebaasist
      const prescriptions = await defaultDataSource.getRepository(Prescription).find();
  
      // vast JSON formaadis retseptide listiga
      return res.status(200).json({ data: prescriptions });
    } catch (error) {
      console.log("ERROR", { message: error });
  
      // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
      return res.status(500).json({ message: "Could not fetch prescriptions" });
    }
});
  
  
// POST - saadab infot
router.post("/", async (req, res) => {
try {
    const { drugId, drugName, doctorId, doctorName, patientId, patientName, datePrescribed, dosage, duration, refillable, numOfRefills} = req.body as CreatePrescriptionParams;

    // TODO: validate & santize
    if (!drugId || !drugName || !doctorId || !doctorName || !patientId || !patientName || !datePrescribed || !dosage || !duration || !refillable || !numOfRefills) {
    return res
        .status(400)
        .json({ error: "Prescription data is not complete" });
    }

    // NOTE: võib tekkida probleeme kui ID väljale kaasa anda "undefined" väärtus
    // otsime üles retseptiga seotud patsiendi
    const patient = await Patient.findOneBy({id: patientId});    

    if(!patient) {
    return res.status(400).json({ message: "Patient with given ID not found" });
    }

    // otsime üles retseptiga seotud arsti
    const doctor = await Doctor.findOneBy({id: doctorId});    

    if(!doctor) {
    return res.status(400).json({ message: "Doctor with given ID not found" });
    }

    // otsime üles retseptiga seotud ravimi
    const drug = await Drug.findOneBy({id: drugId});    

    if(!drug) {
    return res.status(400).json({ message: "Drug with given ID not found" });
    }


    // create new prescription with given parameters
    const prescription = Prescription.create({
        drugId: drugId ?? "",
        drugName: drugName.trim () ??"",
        doctorId: doctorId ?? "",
        doctorName: doctorName.trim () ??"",
        patientId: patientId ?? "",
        patientName: patientName.trim () ??"",
        datePrescribed: datePrescribed ?? "",
        dosage: dosage.trim () ??"",
        duration: duration.trim () ??"",
        refillable: refillable ?? "",
        numOfRefills: numOfRefills.trim () ??"",
    });


    //save prescription to database
    const result = await prescription.save();

    return res.status(200).json({ data: result });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not fetch prescriptions" });
}
});

// GET - info päring (üksik rets)
router.get("/:id", async (req, res) => {
try {
    const { id } = req.params;

    const prescription = await defaultDataSource
    .getRepository(Prescription)
    .findOneBy({ id: parseInt(id) });

    return res.status(200).json({ data: prescription });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not fetch prescription" });
}
});

// PUT - update
router.put("/:id", async (req, res) => {
try {
    const { id } = req.params;
    const { drugId, drugName, doctorId, doctorName, patientId, patientName, datePrescribed, dosage, duration, refillable, numOfRefills} = req.body as UpdatePrescriptionParams;

    const prescription = await defaultDataSource
    .getRepository(Prescription)
    .findOneBy({ id: parseInt(id) });

    if (!prescription) {
    return res.status(404).json({ error: "Prescription not found" });
    }


    // uuendame andmed objektis (lokaalne muudatus)
    prescription.drugId = drugId ? drugId : prescription.drugId;
    prescription.drugName = drugName ? drugName : prescription.drugName;
    prescription.doctorId = doctorId ? doctorId : prescription.doctorId;
    prescription.doctorName = doctorName ? doctorName : prescription.doctorName;
    prescription.patientId = patientId ? patientId : prescription.patientId;
    prescription.patientName = patientName ? patientName : prescription.patientName;
    prescription.datePrescribed = datePrescribed ? datePrescribed : prescription.datePrescribed;
    prescription.dosage = dosage ? dosage : prescription.dosage;
    prescription.duration = duration ? duration : prescription.duration;
    prescription.refillable = refillable ? refillable : prescription.refillable;
    prescription.numOfRefills = numOfRefills ? numOfRefills : prescription.numOfRefills;

    
    //salvestame muudatused andmebaasi 
    const result = await prescription.save();

    // saadame vastu uuendatud andmed (kui midagi töödeldakse serveris on seda vaja kuvada)
    return res.status(200).json({ data: result });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
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
        
        // tagastame igaks juhuks kustutatud andmed
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log("ERROR", { message: error });
    
        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not update prescription" });
    }
});

export default router;