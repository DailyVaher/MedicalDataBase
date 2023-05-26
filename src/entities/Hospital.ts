import { PrimaryGeneratedColumn, Column, Entity, BaseEntity, OneToMany} from "typeorm";
import { DoctorHistory } from "./DoctorHistory";

@Entity()
export class Hospital extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number
    
    @Column("varchar", { length: 50 })
    hospitalName!: string
   
    @Column("varchar", { length: 200 })
    address!: string
    
    @Column("varchar", { length: 50 })
    phone!: string

    @Column("int", { unique: true })
    doctorHistoryId!: number

    @OneToMany(() => DoctorHistory, doctorHistory => doctorHistory.hospitalId)
    doctorHistory!: DoctorHistory[]
    
}
