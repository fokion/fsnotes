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
    };
    document.getElementById("workspaces-add-button").addEventListener("click", addWorkspaceHandler, true);

    function switchWorkspace(workspaceId) {
        storage.fetchWorkspaceNotes(workspaceId,renderer.displayNotes);
        var workspace = storage.getWorkspaceByID(workspaceId);
        renderer.displayWorkspaceName(workspace.label);
        //storage.fetchWorkspaceChat(workspaceId,renderer.displayWorkspaceChat);
    }

    function updateWorkspaceNameHandler(newWorkspaceName){
         storage.updateCurrentWorkspaceInfo({"label":newWorkspaceName});
         broker.publish("workspace-updated",[storage.getCurrentWorkspace()]);
    }

    function addWorkspaceHandler(e) {
        var workspace = new Workspace();
        workspace.id = getItemID();
        workspace.owner = storage.getCurrentUser().id;
        workspace.users = [storage.getCurrentUser()];
        storage.addWorkspace(workspace);
        renderer.renderWorkspaceItem(workspace);
        var currentWorkspace = storage.getCurrentWorkspace();
        if (currentWorkspace !== null) {
            renderer.clearWorkspaceSelected(currentWorkspace);
        }
        storage.setCurrentWorkspace(workspace);
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