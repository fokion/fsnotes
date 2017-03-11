/**
 * Created by fokion on 28/02/2017.
 */
function NotesAppImpl() {
    var me = this;
    var storage;
    var renderer;
    var broker;
    me.init = function () {

        broker = new EventBroker();
        storage = new Store(broker);
        renderer = new Renderer(broker);
        broker.subscribe("switch-workspace", switchWorkspace);
        broker.subscribe("current-workspace-updated-name",updateWorkspaceNameHandler);
        storage.fetchWorkspaces(displayWorkspaces);

    };
    document.getElementById("workspaces-add-button").addEventListener("click", addWorkspaceHandler, true);
    document.getElementById("messages-submit-button").addEventListener("click",addMessageHandler,true);
    document.getElementById("message").addEventListener("keydown",updateCurrentTextHandler,true);
    function displayWorkspaces(workspaces){
        workspaces.map(renderer.renderWorkspaceItem);
        switchWorkspace(workspaces[0].id);
    }
    function updateCurrentTextHandler(){
        var txt = document.getElementById("message").value;
        storage.setCurrentText(txt);
    }
    function addMessageHandler(){
        var msg = new Message(getItemID(),
            storage.getCurrentUser().id,
            storage.getCurrentText(),
            storage.getCurrentWorkspaceID()
        );
        storage.addMessage(msg);
        renderer.displayMessage(renderer.getMessageContainer(),msg);
        renderer.clearMessageInput();
    }
    function switchWorkspace(workspaceId) {
        storage.fetchWorkspaceNotes(workspaceId,renderer.displayNotes);
        var prevWorkspace = storage.getCurrentWorkspace();
        if(prevWorkspace) {
            renderer.clearWorkspaceSelected(prevWorkspace);
        }
        storage.setCurrentWorkspaceID(workspaceId);
        var workspace = storage.getWorkspaceByID(workspaceId);
        renderer.setWorkspaceSelected(workspace);
        renderer.displayWorkspaceName(workspace.label);
        storage.fetchWorkspaceChat(workspaceId,renderer.displayWorkspaceChat);
    }

    function updateWorkspaceNameHandler(newWorkspaceName){
         storage.updateCurrentWorkspaceInfo({"label":newWorkspaceName});
         broker.publish("workspace-updated",[storage.getCurrentWorkspace()]);
    }

    function addWorkspaceHandler(event) {
        var workspace = new Workspace();
        workspace.id = getItemID();
        workspace.owner = storage.getCurrentUser().id;
        workspace.users = [storage.getCurrentUser()];
        storage.addWorkspace(workspace);
        renderer.renderWorkspaceItem(workspace);
        var currentWorkspace = storage.getCurrentWorkspace();
        if (currentWorkspace) {
            renderer.clearWorkspaceSelected(currentWorkspace);
        }
        storage.setCurrentWorkspaceID(workspace.id);
        renderer.setWorkspaceSelected(workspace);
    }

    function getItemID() {
        return new Hashes.SHA512().hex((Date.now() * Math.random() * Math.random()).toString());
    }

}
function ConfigurationImpl() {

    var conf = {
        "Utils": new UtilsImpl(),
        "App": new NotesAppImpl()
    };


    return Object.freeze(conf);
}

window.onload = function () {
    window.Notes = new ConfigurationImpl();
    window.Notes.App.init();
};