/**
 * Created by fokion on 01/03/2017.
 */
function Renderer(eventBroker) {
    var me = this;
    var broker = eventBroker;
    broker.subscribe("workspace-updated", updateWorkspaceItem);
    var DomHandler = new DomImpl();
    var workspaceNameContainer = document.getElementById("chat-workspace-name");
    workspaceNameContainer.addEventListener("click", workspaceNameChangeHandler);
    function workspaceNameChangeHandler() {
        workspaceNameContainer.removeEventListener("click", workspaceNameChangeHandler);
        var prevText = workspaceNameContainer.textContent;
        var inputElement = DomHandler.createElement("input");
        inputElement.addEventListener("keydown", keyDownEventHandler);
        inputElement.value = prevText;
        fastdom.mutate(function () {
            DomHandler.clearElement(workspaceNameContainer);
            workspaceNameContainer.appendChild(inputElement);
        });

    }

    function keyDownEventHandler(e) {
        if (e.keyCode === 13) {
            workspaceNameContainer.addEventListener("click", workspaceNameChangeHandler);
            var value = e.target.value;
            fastdom.mutate(function () {
                DomHandler.clearElement(workspaceNameContainer);
                workspaceNameContainer.textContent = value;
            });
            broker.publish("current-workspace-updated-name", [value]);
        }
    }

    me.displayNotes = function (notes) {
        console.log("display notes...");
    };
    me.setWorkspaceSelected = function (workspace) {
        var container = document.getElementById(["workspace", "item", workspace.id].join("-"));
        if (container) {
            var classes = container.className.split(" ");
            classes.push("selected");
            container.className = classes.join(" ");
        }
    };
    me.clearWorkspaceSelected = function (workspace) {
        var container = document.getElementById(["workspace", "item", workspace.id].join("-"));
        if (container) {
            var classes = container.className.split(" ");
            var pos = classes.indexOf("selected");
            if (pos !== -1) {
                classes.splice(pos, 1);
            }
            container.className = classes.join(" ");
        }
    };
    me.displayWorkspaceName = function (workspaceName) {
        document.getElementById("chat-workspace-name").textContent = workspaceName;
    };
    function renderWorkspaceItem(workspace) {
        var workspaceContainer = DomHandler.createElement("div", {"classes": ["workspace"]});
        workspaceContainer.id = ["workspace", "item", workspace.id].join("-");
        var labelContainer =  DomHandler.createElement("div", {"classes": ["name"]});

        labelContainer.textContent = workspace.label;
        labelContainer.id = ["workspace", "label", workspace.id].join("-");
        workspaceContainer.addEventListener("click", function (e) {
            broker.publish("switch-workspace", [workspace.id]);
        });
        workspaceContainer.appendChild(labelContainer);
        workspaceContainer.appendChild(DomHandler.createMoreDropDown(["workspace", "options", "button", workspace.id].join("-")));
        document.getElementById("workspaces-list-container").appendChild(workspaceContainer);
    }

    me.renderWorkspaceItem = renderWorkspaceItem;
    me.renderWorkspaceOptions = function (options, optionsButtonID , workspaceID) {
        var listContainer = DomHandler.createElement("ul", {"classes": ["mdl-menu", "mdl-menu--bottom-right", "mdl-js-menu", "mdl-js-ripple-effect"]});
        listContainer.setAttribute("for", optionsButtonID);
        for (var i = 0; i < options.length; i++) {
            var option = options[i];
            var optionContainer = DomHandler.createElement("li", {"classes": ["mdl-menu__item"]});
            optionContainer.textContent = option.label;
            optionContainer.addEventListener("click", option.handler);
            if (option.isDisabled) {
                optionContainer.setAttribute("disabled", true);
            }
            option.workspaceID = workspaceID;
            listContainer.appendChild(optionContainer);
        }
        return listContainer;
    };
    function updateWorkspaceItem(workspace) {
        var label = document.getElementById(["workspace", "label", workspace.id].join("-"));
        label.textContent = workspace.label;
    }

    me.renderUserInChat = function (user) {
        var personContainer = DomHandler.createElement("span", {"classes": ["mdl-chip", "mdl-chip--contact", "mdl-chip--deletable"]});
        var startingLetterContainer = DomHandler.createElement("span", {"classes": ["mdl-chip__contact", "mdl-color--teal", "mdl-color-text--white"]});
        startingLetterContainer.textContent = user.getFullName().substr(0, 1);
        personContainer.appendChild(startingLetterContainer);
        var anchor = DomHandler.createElement("a");
        anchor.onclick = function () {
            broker.publish("remove-user-from-chat", [personContainer, user]);
        };
        anchor.textContent = user.getFullName();

        var closeBtn = DomHandler.createElement("a", {"classes": ["mdl-chip__action"]});
        var icon = DomHandler.createElement("i", {"classes": ["material-icons"]});
        icon.textContent = "cancel";
        closeBtn.appendChild(icon);
        closeBtn.onclick = function () {
            broker.publish("remove-user-from-chat", [personContainer, user]);
        };
        personContainer.appendChild(anchor);
        personContainer.appendChild(closeBtn);
        return personContainer;
    };

    me.displayWorkspaceChat = function(messages){
        var container = document.getElementById("messages");
        DomHandler.clearElement(container);
        var ulContainer = DomHandler.createElement("ul",{"classes":["messages"]});
        ulContainer.id = "messages-container";
        container.appendChild(ulContainer);
        messages.map(function(message) {
            me.displayMessage(ulContainer, message);
        });
    };
    me.getMessageContainer = function(){
        var elm = document.getElementById("messages-container");
        if(!elm){
            var container = document.getElementById("messages");
            elm = DomHandler.createElement("ul",{"classes":["messages"]});
            elm.id = "messages-container";
            container.appendChild(elm);
        }
        return elm;
    };
    me.clearMessageInput = function(){
      document.getElementById("message").value = "";
    };

    me.displayMessage = function(container , message){
        var liContainer = DomHandler.createElement("li",{"classes":["message","item","mdl-list__item","mdl-list__item--two-line"]});
        var messageContainer = DomHandler.createElement("span",{"classes":["mdl-list__item-primary-content"]});
        messageContainer.textContent = message.text;
        liContainer.appendChild(messageContainer);
        container.appendChild(liContainer);
    };

}
