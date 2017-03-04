/**
 * Created by fokion on 01/03/2017.
 */
function Renderer(eventBroker){
    var me = this;
    var broker = eventBroker;
    broker.subscribe("workspace-updated",updateWorkspaceItem);
    var DomHandler = new DomImpl();
    var workspaceNameContainer = document.getElementById("chat-workspace-name");
    workspaceNameContainer.addEventListener("click",workspaceNameChangeHandler);
    function workspaceNameChangeHandler(){
        workspaceNameContainer.removeEventListener("click",workspaceNameChangeHandler);
        var prevText = workspaceNameContainer.textContent;
        var inputElement = DomHandler.createElement("input");
        inputElement.addEventListener("keydown",keyDownEventHandler);
        inputElement.value = prevText;
        fastdom.mutate(function() {
            DomHandler.clearElement(workspaceNameContainer);
            workspaceNameContainer.appendChild(inputElement);
        });

    }
    function keyDownEventHandler(e){
        if(e.keyCode === 13) {
            workspaceNameContainer.addEventListener("click",workspaceNameChangeHandler);
            var value = e.target.value;
            fastdom.mutate(function() {
                DomHandler.clearElement(workspaceNameContainer);
                workspaceNameContainer.textContent = value;
            });
            broker.publish("current-workspace-updated-name", [value]);
        }
    }
    me.displayNotes = function(notes){
        console.log("display notes...");
    };
    me.setWorkspaceSelected = function(workspace){
        var container = document.getElementById(["workspace","item",workspace.id].join("-"));
        if(container) {
            var classes = container.className.split(" ");
            classes.push("selected");
            container.className = classes.join(" ");
        }
    };
    me.clearWorkspaceSelected = function(workspace){
        var container = document.getElementById(["workspace","item",workspace.id].join("-"));
        if(container){
            var classes = container.className.split(" ");
            var pos = classes.indexOf("selected");
            if(pos !== -1) {
                classes = classes.splice(pos, 1);
            }
            container.className = classes.join(" ");
        }
    };
    me.displayWorkspaceName = function(workspaceName){
      document.getElementById("chat-workspace-name").textContent = workspaceName;
    };
    function renderWorkspaceItem(workspace){
     var workspaceContainer = DomHandler.createElement("div",{"classes":["workspace"]});
     workspaceContainer.id = ["workspace","item",workspace.id].join("-");
     var label = DomHandler.createElement("div",{"classes":["name"]});
     label.textContent = workspace.label;
     label.id = ["workspace","label",workspace.id].join("-");
     workspaceContainer.addEventListener("click",function(e){
         broker.publish("switch-workspace",[workspace.id]);
     });
     workspaceContainer.appendChild(label);
     document.getElementById("workspaces-list-container").appendChild(workspaceContainer);
     return workspaceContainer;
    }
    me.renderWorkspaceItem = renderWorkspaceItem;
    function updateWorkspaceItem(workspace){
        var label = document.getElementById(["workspace","label",workspace.id].join("-"));
        label.textContent = workspace.label;
    }
    me.renderUserInChat = function(user){
        var personContainer = DomHandler.createElement("div",{"classes":["person"]});
        var anchor = DomHandler.createElement("a");
        anchor.onclick = function () {
                broker.publish("remove-user-from-chat",[personContainer,user]);
        };
        anchor.textContent = user.getFullName();
        var closeBtn = DomHandlercreateElement("div",{"classes":["delete-button"]});
        closeBtn.textContent = "X";
        closeBtn.onclick = function(){
            broker.publish("remove-user-from-chat",[personContainer,user]);
        };
        personContainer.appendChild(anchor);
        personContainer.appendChild(closeBtn);
        return personContainer;
    };

}
