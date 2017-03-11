/**
 * Created by fokion on 02/03/2017.
 */
function User(){
    this.id;
    this.firstName;
    this.lastName;
    this.getFullName = function(){return [this.firstName,this.lastName].join(" ")};
    this.email;
}