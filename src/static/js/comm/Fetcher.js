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
     function getChatForWorkspace (workspaceID , callback){
        var map = localStorage.getItem("chat-"+workspaceID);
        if(map){
            var elems = JSON.parse(map);
            var messages = [];
            elems.map(function(elem){
               messages.push(window.Notes.Utils.castObject(elem,Message));
            });
            callback(messages);
            return;
        }
        return([]);
    }
    me.getChatForWorkspace = getChatForWorkspace;

    me.saveChatForWorkspace = function(workspaceID, messages){
        localStorage.setItem("chat-"+workspaceID, JSON.stringify(messages));
    };

    function getWorkspaces (callback) {
        var map = localStorage.getItem("workspaces");
        if(map){
            var elems = JSON.parse(map);
            var ws = {};
            for(var id in elems){
                ws[id] = window.Notes.Utils.castObject(elems[id],Workspace);
            }
            callback(ws);
            return;
        }
        callback({});
    }
    me.getWorkspaces  = getWorkspaces;

    me.saveWorkspace = function(workspace){
        getWorkspaces(function(workspaces) {
            workspaces[workspace.id] = workspace;
            localStorage.setItem("workspaces", JSON.stringify(workspaces));
        });
    };
}
