/**
 * Created by fokion on 06/03/2017.
 */
function Message( author , txt , workspaceID){
    this.id = "";
    this.author = author;
    this.timestamp = Date.now();
    this.text = txt;
    this.workspaceID = workspaceID;
}