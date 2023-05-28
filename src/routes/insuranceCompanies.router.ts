import express from 'express';
import defaultDataSource from '../datasource';
import { InsuranceCompany } from '../entities/InsuranceCompany';
import { Patient } from '../entities/Patient';

const router = express.Router();

interface CreateInsuranceCompanyParams {
    insuranceCompanyName: string;
    insuranceCompanyPhone: string;
    patientId: number;
}

interface UpdateInsuranceCompanyParams {
    insuranceCompanyName?: string;
    insuranceCompanyPhone?: string;
    patientId?: number;
}

// GET - getting info (all insurance companies)
router.get("/", async (req, res) => {
    try {
      // getting insurance companies from database
      const insuranceCompanies = await defaultDataSource.getRepository(InsuranceCompany).find();
  
      // respond with list of insurance companies in JSON format
      return res.status(200).json({ data: insuranceCompanies });
    } catch (error) {
      console.log("ERROR", { message: error });
  
      // respond with system error if unexpected error occurs during database query
      return res.status(500).json({ message: "Could not fetch insurance companies" });
    }
});
  
  
// POST - sending info
router.post("/", async (req, res) => {
try {
    const { insuranceCompanyName, insuranceCompanyPhone, patientId} = req.body as CreateInsuranceCompanyParams;

    // TODO: validate & santize
    if (!insuranceCompanyName || !insuranceCompanyPhone || !patientId) {
    return res
        .status(400)
        .json({ error: "Insurance company`s data is not complete" });
    }

    // create new insurance company with given parameters
    const insuranceCompany = InsuranceCompany.create({
        insuranceCompanyName: insuranceCompanyName.trim() ?? "",
        insuranceCompanyPhone: insuranceCompanyPhone.trim() ?? "",
        patientId: patientId ?? "",
    });

    //save insurance company to database
    const result = await insuranceCompany.save();

    return res.status(200).json({ data: result });
} catch (error) {
    console.log("ERROR", { message: error });

    // respond with system error if unexpected error occurs during database query
    return res.status(500).json({ message: "Could not fetch insurance companies" });
}
});

// GET - getting info (one insurance company)
router.get("/:id", async (req, res) => {
try {
    const { id } = req.params;

    const insuranceCompany = await defaultDataSource
    .getRepository(InsuranceCompany)
    .findOneBy({ id: parseInt(id) });

    return res.status(200).json({ data: insuranceCompany });
} catch (error) {
    console.log("ERROR", { message: error });

    // respond with system error if unexpected error occurs during database query
    return res.status(500).json({ message: "Could not fetch insurance companies" });
}
});

// PUT - update
router.put("/:id", async (req, res) => {
try {
    const { id } = req.params;
    const { insuranceCompanyName, insuranceCompanyPhone, patientId } = req.body as UpdateInsuranceCompanyParams;

    const insuranceCompany = await defaultDataSource
    .getRepository(InsuranceCompany)
    .findOneBy({ id: parseInt(id) });

    if (!insuranceCompany) {
    return res.status(404).json({ error: "InsuranceCompany not found" });
    }


    // update the data in the object (local change) (uuendame andmed objektis (lokaalne muudatus))
    insuranceCompany.insuranceCompanyName = insuranceCompanyName ?? insuranceCompany.insuranceCompanyName;
    insuranceCompany.insuranceCompanyPhone = insuranceCompanyPhone ?? insuranceCompany.insuranceCompanyPhone;
    insuranceCompany.patientId = patientId ?? insuranceCompany.patientId;
    
    // find which patient the insurance company is associated with
    if(patientId){
    const patient = await Patient.findOneBy({id: patientId});
    if(!patient){
        return res.status(400).json({ message: "Patient with given ID not found" });
    }
    insuranceCompany.patientId = patient.id;
    }
    
    // save the changes to the database (salvestame muudatused andmebaasi)
    const result = await insuranceCompany.save();

    // send back the updated data (saadame vastu uuendatud andmed (kui midagi töödeldakse serveris on seda vaja kuvada))
    return res.status(200).json({ data: result });
}       catch (error) {
        console.log("ERROR", { message: error });

    // respond with system error if unexpected error occurs during database query
    return res.status(500).json({ message: "Could not update insurance companies" });
}
});

// DELETE - kustutamine
router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;
    
        const insuranceCompany = await defaultDataSource
        .getRepository(InsuranceCompany)
        .findOneBy({ id: parseInt(id) });
    
        if (!insuranceCompany) {
        return res.status(404).json({ error: "Insurance company could not found" });
        }

        const result = await insuranceCompany.remove();
        
        // return deleted data just in case (tagastame igaks juhuks kustutatud andmed)
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log("ERROR", { message: error });
    
        // respond with system error if unexpected error occurs during database query
        return res.status(500).json({ message: "Could not update insurance company" });
    }
});

export default router;