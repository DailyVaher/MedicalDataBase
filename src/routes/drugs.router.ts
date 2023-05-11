import express from 'express';
import defaultDataSource from '../datasource';
import { Drug } from '../entities/Drug';
import { Prescription } from '../entities/Prescription';

const router = express.Router();

interface CreateDrugParams {
    drugName: string;
    sideEffects: string;
    benefits: string;
    prescriptionId: number;
}

interface UpdateDrugParams {
    drugName: string;
    sideEffects: string;
    benefits: string;  
    prescriptionId: number;
}

// GET - getting info (all drugs)
router.get("/", async (req, res) => {
    try {
      // getting drugs from database
      const drugs = await defaultDataSource.getRepository(Drug).find();
  
      // answer with drugs list in JSON format
      return res.status(200).json({ data: drugs });
    } catch (error) {
      console.log("ERROR", { message: error });
  
      // respond with system error if unexpected error occurs during database query
      return res.status(500).json({ message: "Could not fetch drugs" });
    }
});

// POST - sending info
router.post("/", async (req, res) => {
  try {
      const { drugName, sideEffects, benefits, prescriptionId } = req.body as CreateDrugParams;
  
      // TODO: validate & santize
      if (!drugName || !sideEffects || !benefits || !prescriptionId) {
      return res
          .status(400)
          .json({ error: "Complete drug data", req: {
          drugName: drugName,
          sideEffects: sideEffects,
          benefits: benefits,
          prescripitionId: prescriptionId,
          }});
      }
  
// NOTE: a problem may arise if the ID field is provided with an undefined value (võib tekkida probleeme kui ID väljale kaasa anda "undefined" väärtus)
    // look for the prescription associated with the medicine (otsime üles ravimiga seotud retsepti)
    const prescription = await Prescription.findOneBy({id: prescriptionId});

    if(!prescription) {
    return res.status(400).json({ message: "Prescription with given ID not found" });
    }

// create new Drug with given parameters
    const drug = Drug.create({
      drugName: drugName.trim() ?? "",
      sideEffects: sideEffects.trim() ?? "",
      benefits: benefits.trim() ?? "",
      prescriptionId: prescriptionId ?? "",

      });

      //save Drug to database
      const result = await drug.save();
  
      return res.status(200).json({ data: result });
  } catch (error) {
      console.log("ERROR", { message: error });
  
      // respond with system error if unexpected error occurs during database query
      return res.status(500).json({ message: "Could not fetch drugs" });
  }
  });
  
  // GET - getting info (one drug)
router.get("/:id", async (req, res) => {
  try {
      const { id } = req.params;
  
      // a standard ORM query with "relation" entity content (tavaline ORM päring koos "relation" entity sisuga)
      const drug = await defaultDataSource
      .getRepository(Drug)
      .findOne({ where:{id: parseInt(id)}, relations: ['drugs'] });
  
  
      return res.status(200).json({ data: drug });
  } catch (error) {
      console.log("ERROR", { message: error });
  
      // respond with system error if unexpected error occurs during database query
      return res.status(500).json({ message: "Could not fetch drugs" });
  }
  });// PUT - update
  router.put("/:id", async (req, res) => {
  try {
      const { id } = req.params;
      const { drugName, sideEffects, benefits, prescriptionId} = req.body as UpdateDrugParams;
  
      const drug = await defaultDataSource
      .getRepository(Drug)
      .findOneBy({ id: parseInt(id) });
  
      if (!drug) {
      return res.status(404).json({ error: "Drug not found" });
      }
  
      // update the data in the object (local change) (uuendame andmed objektis (lokaalne muudatus))
      drug.drugName = drugName ? drugName : drug.drugName;
      drug.sideEffects = sideEffects ? sideEffects : drug.sideEffects;
      drug.benefits = benefits ? benefits : drug.benefits;
      drug.prescriptionId = prescriptionId ? prescriptionId : drug.prescriptionId;


     //  look up which drug the prescription is related to (otsime üles, millise ravimiga retsept seotud on)
     if(prescriptionId){
      const prescription = await Prescription.findOneBy({id: prescriptionId});
      if(!prescription){
          return res.status(400).json({ message: "Prescription with given ID not found" });
      }
      drug.prescriptionId = prescription.id;
      }
  
      // save the changes to the database (salvestame muudatused andmebaasi) 
      const result = await drug.save();
  
      // send back the updated data (saadame vastu uuendatud andmed (kui midagi töödeldakse serveris on seda vaja kuvada))
      return res.status(200).json({ data: result });
  }   catch (error) {
      console.log("ERROR", { message: error });
  
      // respond with system error if unexpected error occurs during database query
      return res.status(500).json({ message: "Could not update drugs" });
  }
  });
  
  // DELETE - kustutamine
  router.delete("/:id", async(req, res) => {
      try {
          const { id } = req.params;
      
          const drug = await defaultDataSource
          .getRepository(Drug)
          .findOneBy({ id: parseInt(id) });
      
          if (!drug) {
          return res.status(404).json({ error: "Drug not found" });
          }
  
          const result = await drug.remove();
          
          // return deleted data just in case 8tagastame igaks juhuks kustutatud andmed)
          return res.status(200).json({ data: result });
      } catch (error) {
          console.log("ERROR", { message: error });
      
          // respond with system error if unexpected error occurs during database query
          return res.status(500).json({ message: "Could not update drugs" });
      }
  });
  
  export default router;