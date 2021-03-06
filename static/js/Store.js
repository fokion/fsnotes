/**
 * Created by fokion on 01/03/2017.
 * Description : Storage layer for the app.
 */
function Store() {
    var me = this;
    var fetcher = new Fetcher();
    var notesMap = {};
    var notes = null;
    var usersMap = {};
    var users = null;
    var workspacesMap = {};
    var workspaces = null;

    var currentText = "";
    var currentWorkspaceID = null;

    var currentUser = new User();
    currentUser.id = "1234";
    currentUser.firstName = "Fokion";
    currentUser.lastName = "Sotiropoulos";
    currentUser.email = "fokion.s@gmail.com";

    me.addNote = function (note) {
        notesMap[note.id] = note;
        notes = null;
    };
    me.addWorkspace = function (workspace,callback) {
        fetcher.saveWorkspace(workspace,function(resp){
            var respObj = JSON.parse(resp);
            workspace.id = respObj.id;
            workspacesMap[workspace.id] = workspace;
            workspaces = null;
            callback(workspace);
        });
    };

    me.addUser = function (user) {
        usersMap[user.id] = user;
        users = null;
    };


    me.getUsers = function () {
        if (users === null) {
            users = getItemsFromMap(usersMap);
        }
        return users;
    };

    me.getNotes = function () {
        if (notes === null) {
            notes = getItemsFromMap(notesMap);
        }
        return notes;
    };

    me.getWorkspaces = function () {
        if (workspaces === null) {
            workspaces = getItemsFromMap(workspacesMap);
        }
        return workspaces;
    };

    me.getCurrentUser = function(){
        return currentUser;
    };

    me.getCurrentWorkspace = function(){
        if(currentWorkspaceID !== null) {
            return workspacesMap[currentWorkspaceID];
        }
        return null;
    };

    me.setCurrentWorkspaceID = function(workspaceId){
        currentWorkspaceID = workspaceId;
    };
    me.getCurrentWorkspaceID = function(){
        return currentWorkspaceID;
    };
    me.getCurrentText = function(){
        return currentText;
    };

    me.fetchWorkspaceNotes = function(workspaceID , callback){
        var workspace = workspacesMap[workspaceID];
        fetcher.getNotesForWorkspace(workspaceID,function(notes){
            workspace.notes = notes;
            callback(workspace.notes);
        });
    };

    me.setCurrentText = function(txt){
        currentText = txt;
    };

    me.addMessage = function(message, callback){
        fetcher.saveChatForWorkspace( message , function(msg){
            var workspace = workspacesMap[msg.workspaceID];
            workspace.messages.push(msg);
            callback(msg);
        });
    };
    me.fetchWorkspaceChat = function(workspaceID , callback){
        var workspace = workspacesMap[workspaceID];
        fetcher.getChatForWorkspace(workspaceID,function(messages){
            workspace.messages = messages;
            callback(workspace.messages);
        });
    };
    me.updateCurrentWorkspaceInfo = function(updatesObj,callback){
        var workspace = workspacesMap[currentWorkspaceID];
        if(workspace && updatesObj && typeof updatesObj === "object") {
            for (var propertyName in updatesObj) {
                if(workspace.hasOwnProperty(propertyName)){
                    workspace[propertyName] = updatesObj[propertyName];
                }
            }
        }
        fetcher.updateWorkspace(workspace,function(resp){
            var wsObjects = JSON.parse(resp);
            if(wsObjects){
                workspace.label = wsObjects[0].label;
                workspaces = null;
            }
            callback(workspace)
        });
    };

    me.getWorkspaceByID = function(workspaceID){
        return workspacesMap[workspaceID];
    };


    me.fetchWorkspaces = function(callback){
        fetcher.getWorkspaces(function(map){
            workspacesMap = map;
            workspaces = null;
            callback(me.getWorkspaces());
        });
    };



    function getItemsFromMap(map) {
        var ret = [];
        for (var index in map) {
            ret.push(map[index]);
        }
        return ret;
    }
}