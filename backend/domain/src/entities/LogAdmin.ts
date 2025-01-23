export class LogAdmin {
    id!: number;
    adminId!: number;
    action?: string;
    dateAction!: Date;
  
    constructor(data: Partial<LogAdmin>) {
      Object.assign(this, data);
    }
  }
  