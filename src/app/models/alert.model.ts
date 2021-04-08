export class AlertModel {
  constructor(
    public id: number,
    public type: string,
    public message: string,
    public closeMessage: string
  ) {}
}
