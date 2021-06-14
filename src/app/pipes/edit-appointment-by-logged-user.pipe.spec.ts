import { EditAppointmentByLoggedUserPipe } from './edit-appointment-by-logged-user.pipe';

describe('EditAppointmentByLoggedUserPipe', () => {
  it('create an instance', () => {
    const pipe = new EditAppointmentByLoggedUserPipe();
    expect(pipe).toBeTruthy();
  });
});
