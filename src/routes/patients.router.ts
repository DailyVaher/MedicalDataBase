import express from 'express';
import defaultDataSource from '../datasource';
import { Patient } from '../entities/Patient';
import { Doctor } from '../entities/Doctor';

const router = express.Router();

interface CreatePatientParams {
    doctorId: number;
    patientId: number;
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    email: string;
    insuranceId: string;
    insuranceOwnerFirstName: string;
    insuranceOwnerLastName: string;
    insuranceOwnerCompanyName: string;
}

interface UpdatePatientParams {
    doctorId?: number;
    patientId?: number;
    firstName?: string;
    lastName?: string;
    address?: string;
    phone?: string;
    email?: string;
    insuranceId?: string;
    insuranceOwnerFirstName?: string;
    insuranceOwnerLastName?: string;
    insuranceOwnerCompanyName?: string;
}
// GET - getting info (all patients)
router.get("/", async (req, res) => {
    try {
      // getting patients from database
      const patients = await defaultDataSource.getRepository(Patient).find();
  
      // respond with list of patients in JSON format
      return res.status(200).json({ data: patients });
    } catch (error) {
      console.log("ERROR", { message: error });
  
      // respond with system error if unexpected error occurs during database query
      return res.status(500).json({ message: "Could not fetch patients" });
    }
});
  
  
// POST - sending info
router.post("/", async (req, res) => {
try {
    const { firstName, lastName, address, phone, email, insuranceId, insuranceOwnerFirstName, insuranceOwnerLastName, insuranceOwnerCompanyName, doctorId} = req.body as CreatePatientParams;

    // TODO: validate & santize
    if (!firstName || !lastName || !address || !phone || !email || !insuranceId || !insuranceOwnerFirstName || !insuranceOwnerLastName || !insuranceOwnerCompanyName || !doctorId) {
    return res
        .status(400)
        .json({ error: "Patient data is not complete" });
    }

    // NOTE: a problem may arise if the ID field is provided with an undefined value (võib tekkida probleeme kui ID väljale kaasa anda "undefined" väärtus)
    // look for a doctor related to the patient (otsime üles patsiendiga seotud arsti)
    const doctor = await Doctor.findOneBy({id: doctorId});

    if(!doctor) {
    return res.status(400).json({ message: "Doctor with given ID not found" });
    }

    // create new patient with given parameters
    const patient = Patient.create({
    firstName: firstName.trim() ?? "",
    lastName: lastName.trim() ?? "",    
    address: address.trim() ?? "",
    phone: phone.trim() ?? "",
    email: email.trim() ?? "",
    insuranceId: insuranceId ?? "",
    insuranceOwnerFirstName: insuranceOwnerFirstName.trim() ?? "",
    insuranceOwnerLastName: insuranceOwnerLastName.trim() ?? "",
    insuranceOwnerCompanyName: insuranceOwnerCompanyName.trim() ?? "",
    });

    //save patient to database
    const result = await patient.save();

    return res.status(200).json({ data: result });
} catch (error) {
    console.log("ERROR", { message: error });

    // respond with system error if unexpected error occurs during database query
    return res.status(500).json({ message: "Could not fetch patients" });
}
});

// GET - getting info (one patient)
router.get("/:id", async (req, res) => {
try {
    const { id } = req.params;

    const patient = await defaultDataSource
    .getRepository(Patient)
    .findOneBy({ id: parseInt(id) });

    return res.status(200).json({ data: patient });
} catch (error) {
    console.log("ERROR", { message: error });

    // respond with system error if unexpected error occurs during database query
    return res.status(500).json({ message: "Could not fetch patients" });
}
});

// PUT - update
router.put("/:id", async (req, res) => {
try {
    const { id } = req.params;
    const { firstName, lastName, address, phone, email, insuranceId, insuranceOwnerFirstName, insuranceOwnerLastName,insuranceOwnerCompanyName, doctorId } = req.body as UpdatePatientParams;

    const patient = await defaultDataSource
    .getRepository(Patient)
    .findOneBy({ id: parseInt(id) });

    if (!patient) {
    return res.status(404).json({ error: "Patient not found" });
    }


    // update the data in the object (local change) (uuendame andmed objektis (lokaalne muudatus))
    patient.firstName = firstName ? firstName : patient.firstName;
    patient.lastName = lastName ? lastName : patient.lastName;
    patient.address = address ? address : patient.address;
    patient.phone = phone ? phone : patient.phone;
    patient.email = email ? email : patient.email;
    patient.insuranceId = insuranceId ? insuranceId : patient.insuranceId;
    patient.insuranceOwnerFirstName = insuranceOwnerFirstName ? insuranceOwnerFirstName : patient.insuranceOwnerFirstName;
    patient.insuranceOwnerLastName = insuranceOwnerLastName ? insuranceOwnerLastName : patient.insuranceOwnerLastName;
    patient.insuranceOwnerCompanyName = insuranceOwnerCompanyName ? insuranceOwnerCompanyName : patient.insuranceOwnerCompanyName;

  
    // find which doctor the patient is associated with (otsime üles millise arstiga on patsient seotud)
    if(doctorId){
    const doctor = await Doctor.findOneBy({id: doctorId});
    if(!doctor){
        return res.status(400).json({ message: "Doctor with given ID not found" });
    }
    patient.doctorId = doctor.id;
    }
    
    // save the changes to the database (salvestame muudatused andmebaasi)
    const result = await patient.save();

    // send back the updated data (saadame vastu uuendatud andmed (kui midagi töödeldakse serveris on seda vaja kuvada))
    return res.status(200).json({ data: result });
}       catch (error) {
        console.log("ERROR", { message: error });

    // respond with system error if unexpected error occurs during database query
    return res.status(500).json({ message: "Could not update patient" });
}
});

// DELETE - kustutamine
router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;
    
        const patient = await defaultDataSource
        .getRepository(Patient)
        .findOneBy({ id: parseInt(id) });
    
        if (!patient) {
        return res.status(404).json({ error: "Patient could not found" });
        }

        const result = await patient.remove();
        
        // return deleted data just in case (tagastame igaks juhuks kustutatud andmed)
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log("ERROR", { message: error });
    
        // respond with system error if unexpected error occurs during database query
        return res.status(500).json({ message: "Could not update patient" });
    }
});

export default router;