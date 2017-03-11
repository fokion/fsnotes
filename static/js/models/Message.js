/**
 * Created by fokion on 06/03/2017.
 */
function Message(id , author , txt , workspaceID){
    this.id = id;
    this.author = author;
    this.timestamp = Date.now();
    this.text = txt;
    this.workspaceID = workspaceID;
}