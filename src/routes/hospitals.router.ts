import express from 'express';
import defaultDataSource from '../datasource';
import { Hospital } from '../entities/Hospital';




const router = express.Router();

interface CreateHospitalParams {
    hospitalName: string;
    address: string;
    phone: string;
    doctorHistoryId: number;
}

interface UpdateHospitalParams {
    hospitalName?: string;
    address?: string;
    phone?: string;
}
  
// GET - info päring (kõik arstid)
router.get("/", async (req, res) => {
    try {
      // get hospitals from database
      const hospitals = await defaultDataSource.getRepository(Hospital).find();
  
      // respond with list of hospitals in JSON format
      return res.status(200).json({ data: hospitals });
    } catch (error) {
      console.log("ERROR", { message: error });
  
      // respond with system error if unexpected error occurs during database query
      return res.status(500).json({ message: "Could not fetch hospitals"});
    }
});
  
  
// POST - get info
router.post("/", async (req, res) => {
try {
    const { hospitalName, address, phone } = req.body as CreateHospitalParams;

    // TODO: validate & santize
    if (!hospitalName || !address || !phone) {
    return res
        .status(400)
        .json({ error: "Complete doctors data", req: {
        hospitalName: hospitalName,
        address: address,
        phone: phone,
        }});
    }


    // create new hospital with given parameters
    const hospital = Hospital.create({
    hospitalName: hospitalName.trim() ??"",
    address: address.trim() ??"",
    phone: phone.trim() ??"",
    });


    //save hospital to database
    const result = await hospital.save();

    return res.status(200).json({ data: result });
} catch (error) {
    console.log("ERROR", { message: error });

    // respond with system error if unexpected error occurs during database query
    return res.status(500).json({ message: "Could not fetch hospitals" });
}
});

// GET - getting info (one hospital)
router.get("/:id", async (req, res) => {
try {
    const { id } = req.params;

    // a standard ORM query with "relation" entity content (tavaline ORM päring koos "relation" entity sisuga)
    const hospital = await defaultDataSource
    .getRepository(Hospital)
    .findOne({ where:{id: parseInt(id)}, relations: ['hospitals'] });


    return res.status(200).json({ data: hospital });
} catch (error) {
    console.log("ERROR", { message: error });

    // respond with system error if unexpected error occurs during database query
    return res.status(500).json({ message: "Could not fetch hospitals" });
}
});

// PUT - update
router.put("/:id", async (req, res) => {
try {
    const { id } = req.params;
    const { hospitalName, address, phone} = req.body as UpdateHospitalParams;

    const hospital = await defaultDataSource
    .getRepository(Hospital)
    .findOneBy({ id: parseInt(id) });

    if (!hospital) {
    return res.status(404).json({ error: "Hospital not found" });
    }

    // update the data in the object (local change) (uuendame andmed objektis (lokaalne muudatus))
    hospital.hospitalName = hospitalName ? hospitalName : hospital.hospitalName;
    hospital.address = address ? address : hospital.address;
    hospital.phone = phone ? phone : hospital.phone;

    // save the changes to the database (salvestame muudatused andmebaasi) 
    const result = await hospital.save();

    // respond with updated data (vastame uuendatud andmetega)
    return res.status(200).json({ data: result });
}    catch (error) {
    console.log("ERROR", { message: error });

    // respond with system error if unexpected error occurs during database query
    return res.status(500).json({ message: "Could not update hospitals " });
}
});

// DELETE - kustutamine
router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;
    
        const hospital = await defaultDataSource
        .getRepository(Hospital)
        .findOneBy({ id: parseInt(id) });
    
        if (!hospital) {
        return res.status(404).json({ error: "Hospital not found" });
        }

        const result = await hospital.remove();
        
        // return deleted data just in case 8tagastame igaks juhuks kustutatud andmed)
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log("ERROR", { message: error });
    
        // res
        return res.status(500).json({ message: "Could not update hospitals" });
    }
});

export default router;