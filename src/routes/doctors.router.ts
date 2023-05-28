import express from 'express';
import defaultDataSource from '../datasource';
import { Doctor } from '../entities/Doctor';

const router = express.Router();

interface CreateDoctorParams {
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    specialization: string;
    hospitalId: number;
    hospitalAffilitation: string;
    dateOfAffilitation: Date;
}

interface UpdateDoctorParams {
    firstName?: string;
    lastName?: string;
    address?: string;
    phone?: string;
    specialization?: string;
    hospitalId?: number;
    hospitalAffilitation?: string;
    dateOfAffilitation?: Date;
}
  
// GET - getting info (all doctors)
router.get("/", async (req, res) => {
    try {
      // ask database for all doctors
      const doctors = await defaultDataSource.getRepository(Doctor).find();
  
      // respond with list of doctors in JSON format
      return res.status(200).json({ data: doctors });
    } catch (error) {
      console.log("ERROR", { message: error });
  
      // respond with system error if unexpected error occurs during database query
      return res.status(500).json({ message: "Could not fetch doctors" });
    }
});
  
  
// POST - getting info
router.post("/", async (req, res) => {
try {
    const { firstName, lastName, address, phone, specialization, hospitalId, hospitalAffilitation, dateOfAffilitation } = req.body as CreateDoctorParams;

    // TODO: validate & santize
    if (!firstName || !lastName || !address || !phone || !specialization || !hospitalId || !hospitalAffilitation || !dateOfAffilitation) {
    return res
        .status(400)
        .json({ error: "Complete doctor`s data", req: {
        firstName: firstName,
        lastName: lastName,
        address: address,
        phone: phone,
        specialization: specialization,
        hospitalId: hospitalId,
        hospitalAffilitation: hospitalAffilitation,
        dateOfAffilitation: dateOfAffilitation,
        }});
    }


    // create new doctor with given parameters
    const doctor = Doctor.create({
    firstName: firstName.trim() ?? "",
    lastName: lastName.trim() ?? "",
    address: address.trim() ?? "",
    phone: phone.trim() ?? "",
    specialization: specialization.trim() ?? "",
    hospitalId: hospitalId ?? "",
    hospitalAffilitation: hospitalAffilitation.trim() ?? "",
    dateOfAffilitation: dateOfAffilitation ?? "",
    });


    //save doctor to database
    const result = await doctor.save();

    return res.status(200).json({ data: result });
} catch (error) {
    console.log("ERROR", { message: error });

    // respond with system error if unexpected error occurs during database query
    return res.status(500).json({ message: "Could not fetch doctors" });
}
});

// GET - getting info (one doctor)
router.get("/:id", async (req, res) => {
try {
    const { id } = req.params;

    //a standard ORM query with "relation" entity content (tavaline ORM päring koos "relation" entity sisuga)
    const doctor = await defaultDataSource
    .getRepository(Doctor)
    .findOne({ where:{id: parseInt(id)}, relations: ['patients'] });


    return res.status(200).json({ data: doctor });
} catch (error) {
    console.log("ERROR", { message: error });

    // respond with system error if unexpected error occurs during database query
    return res.status(500).json({ message: "Could not fetch Doctors" });
}
});

// PUT - update
router.put("/:id", async (req, res) => {
try {
    const { id } = req.params;
    const { firstName, lastName, address, phone, specialization, hospitalId, hospitalAffilitation, dateOfAffilitation } = req.body as UpdateDoctorParams;

    const doctor = await defaultDataSource
    .getRepository(Doctor)
    .findOneBy({ id: parseInt(id) });

    if (!doctor) {
    return res.status(404).json({ error: "Doctor not found" });
    }

    // update the data in the object (local change) (uuendame andmed objektis (lokaalne muudatus))
    doctor.firstName = firstName ? firstName : doctor.firstName;
    doctor.lastName = lastName ? lastName : doctor.lastName;
    doctor.address = address ? address : doctor.address;
    doctor.phone = phone ? phone : doctor.phone;
    doctor.specialization = specialization ? specialization : doctor.specialization;
    doctor.hospitalId = hospitalId ? hospitalId : doctor.hospitalId;
    doctor.hospitalAffilitation = hospitalAffilitation ? hospitalAffilitation : doctor.hospitalAffilitation;
    doctor.dateOfAffilitation = dateOfAffilitation ? dateOfAffilitation : doctor.dateOfAffilitation

    // save the changes to the database (salvestame muudatused andmebaasi) 
    const result = await doctor.save();

    // respond with updated data (vastame uuendatud andmetega)
    return res.status(200).json({ data: result });
}    catch (error) {
    console.log("ERROR", { message: error });

    // respond with system error if unexpected error occurs during database query
    return res.status(500).json({ message: "Could not update Doctors " });
}
});

// DELETE - kustutamine
router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;
    
        const doctor = await defaultDataSource
        .getRepository(Doctor)
        .findOneBy({ id: parseInt(id) });
    
        if (!doctor) {
        return res.status(404).json({ error: "Doctor not found" });
        }

        const result = await doctor.remove();
        
        // return deleted data just in case 8tagastame igaks juhuks kustutatud andmed)
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log("ERROR", { message: error });
    
        // respond with system error if unexpected error occurs during database query
        return res.status(500).json({ message: "Could not update Doctors" });
    }
});

export default router;