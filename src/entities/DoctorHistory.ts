import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, OneToOne, ManyToOne } from "typeorm"
import { Doctor } from "./Doctor"
import { Hospital } from "./Hospital"

@Entity()
export class DoctorHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column("int", { unique: true })
  doctorId!: number

  @Column("int", { unique: true })
  hospitalId!: number

  @Column("date")
  startDate!: Date

  @Column("date")
  endDate!: Date

  @Column("varchar", { length: 200, nullable: true })
  reasonForLeaving!: string 
   
  @OneToOne(() => Doctor, doctor => doctor.doctorHistory)
  doctors!: Doctor

  @OneToMany(() => Hospital, hospital => hospital.doctorHistory)
  hospitals!: Hospital[]
    
}
