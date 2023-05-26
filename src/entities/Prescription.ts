import { PrimaryGeneratedColumn, Column, Entity, BaseEntity, ManyToOne} from "typeorm";
import { Drug } from "./Drug";
import { Patient } from "./Patient";
import { Doctor } from "./Doctor";

@Entity()
export class Prescription extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number
    
    @Column("int", {unique: true })
    drugId!: number

    @Column("varchar", { length: 200 })
    doctorId!: number

    @Column("varchar", { length: 200 })
    patientId!: string

    @Column("date")
    datePrescribed!: Date
   
    @Column("varchar", { length: 200 })
    dosage!: string

    @Column("varchar", { length: 200 })
    duration!: string

    @Column()
    refillable!: boolean

    @Column("int", {nullable:true}) 
    numOfRefills!: number  

    @Column("varchar", { length: 200, nullable: true }) 
    comments!: string

    @ManyToOne(() => Drug, drug => drug.prescription, { eager: true })
    drug!: Drug

    @ManyToOne(() => Patient, patient => patient.prescription, { eager: true })
    patient!: Patient

    @ManyToOne(() => Doctor, doctor => doctor.prescription, { eager: true })
    doctor!: Doctor
    
}