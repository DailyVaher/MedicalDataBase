import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany} from "typeorm"
import { Patient } from "./Patient";
import { Prescription } from "./Prescription";
import { Visit } from "./Visit";
import { DoctorHistory } from "./DoctorHistory";


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
  
    @OneToMany(() => DoctorHistory, DoctorHistory => DoctorHistory.doctor)
    doctorHistory!: DoctorHistory[]

    @OneToMany(() => Visit, Visit => Visit.doctor)
    visits!: Visit[]

}
