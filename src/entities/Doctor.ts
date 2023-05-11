import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, OneToOne, ManyToOne } from "typeorm"
import { Patient } from "./Patient";
import { Prescription } from "./Prescription";
import { Hospital } from "./Hospital";
import { DoctorHistory } from "./DoctorHistory";
import { Visit } from "./Visit";

@Entity()
export class Doctor extends BaseEntity{
 
    @PrimaryGeneratedColumn()
    id!: number

    @Column("varchar", { length: 100 })
    firstName!: string

    @Column("varchar", { length: 100 })
    lastName!: string

    @Column("varchar", { length: 200 })
    address!: string

    @Column("varchar", { length: 100 })
    phone!: string

    @Column("varchar", { length: 200 })
    specialization!: string

    @Column("int", { unique: true })
    hospitalId!: number

    @Column("int", { unique: true })
    doctorHistoryId!: number

    @Column("varchar", { length: 100 })
    hospitalAffilitation!: string

    @Column("date")
    dateOfAffilitation!: Date

    @Column("varchar", { length: 100 })
    prescription!: string

    @OneToMany(() => Patient, patient => patient.doctor)
    patients!: Patient[]

    @OneToMany(() => Prescription, prescription => prescription.doctor)
    prescriptions!: Prescription[]

    @OneToMany(() => Hospital, hospital => hospital.doctors)
    hospitals!: Hospital[]
  
    @OneToOne(() => DoctorHistory, doctorHistory => doctorHistory.doctors)
    doctorHistory!: DoctorHistory

    @OneToMany(() => Visit, Visit => Visit.doctor)
    visits!: Visit[]

}
