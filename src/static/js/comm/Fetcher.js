/**
 * Created by fokion on 04/03/2017.
 */
function Fetcher() {
    var me = this;
    me.getNotesForWorkspace = function (workspaceID, callback) {
        var note1 = new Note();
        note1.id = "1234";
        note1.timestamp = Date.now();
        note1.workspaceID = workspaceID;
        note1.owner = "fokion.s@gmail.com";
        note1.label = "Hello world";
        var note2 = new Note();
        note2.id = "12345";
        note2.timestamp = Date.now();
        note2.workspaceID = workspaceID;
        note2.owner = "fokion.s@gmail.com";
        note2.label = "Hello world 2";
        callback([note1, note2]);
    };
}
