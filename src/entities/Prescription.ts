import { PrimaryGeneratedColumn, Column, Entity, BaseEntity, ManyToOne, OneToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
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
    drugName!: string

    @Column("varchar", { length: 200 })
    doctorId!: number

    @Column("varchar", { length: 200 })
    doctorName!: string

    @Column("varchar", { length: 200 })
    patientId!: string

    @Column("varchar", { length: 200 })
    patientName!: string

    @Column("date")
    datePrescribed!: Date
   
    @Column("varchar", { length: 200 })
    dosage!: string

    @Column("varchar", { length: 200 })
    duration!: string

    @Column()
    refillable!: boolean

    @Column("varchar", { length: 200})
    numOfRefills!: string

    @Column("varchar", { length: 200 })
    comments!: string

    @ManyToOne(() => Drug, drug => drug.prescription)
    drug!: Drug

    @ManyToOne(() => Patient, patient => patient.prescription)
    patient!: Patient

    @ManyToOne(() => Doctor, doctor => doctor.prescription)
    doctor!: Doctor
    
}