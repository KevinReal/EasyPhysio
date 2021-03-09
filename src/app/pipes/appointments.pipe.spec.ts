import { AppointmentsPipe } from './appointments.pipe';

describe('AppointmentsPipe', () => {
  it('create an instance', () => {
    const pipe = new AppointmentsPipe();
    expect(pipe).toBeTruthy();
  });
});
