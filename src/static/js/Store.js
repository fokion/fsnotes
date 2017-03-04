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
    me.addWorkspace = function (workspace) {
        workspacesMap[workspace.id] = workspace;
        workspaces = null;
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
            workspaces = getItemsFromMap(workspaces);
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

    me.setCurrentWorkspace = function(workspace){
        currentWorkspaceID = workspace.id;
    };

    me.fetchWorkspaceNotes = function(workspaceID , callback){
        var workspace = workspacesMap[workspaceID];
        fetcher.getNotesForWorkspace(workspaceID,function(notes){
            workspace.notes = notes;
            callback(workspace.notes);
        });

    };

    me.updateCurrentWorkspaceInfo = function(updatesObj){
        var workspace = workspacesMap[currentWorkspaceID];
        if(workspace && updatesObj && typeof updatesObj === "object") {
            for (var propertyName in updatesObj) {
                if(workspace.hasOwnProperty(propertyName)){
                    workspace[propertyName] = updatesObj[propertyName];
                }
            }
        }
    };

    me.getWorkspaceByID = function(workspaceID){
        return workspacesMap[workspaceID];
    };



    function getItemsFromMap(map) {
        var ret = [];
        for (var index in map) {
            ret.push(map[index]);
        }
        return ret;
    }
}