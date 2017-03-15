/**
 * Created by fokion on 04/03/2017.
 */
function Fetcher() {
    var me = this;
    function get(url , args , onLoadHandler , onProgressHandler , onErrorHandler , onAbortHandler){
        var xhr = new XMLHttpRequest();
        var elems = [];
        args.map(function(arg){
            elems.push(arg.key+"="+arg.val);
        });
        url+="?"+elems.join("&");
        xhr.open('GET', url, true);
        xhr.addEventListener("load", function(event){
            if(this.readyState === 4) { // done
                if (this.status == 200) {
                    if(onLoadHandler) {
                        onLoadHandler(this.response);
                    }
                }
            }
        });
        xhr.addEventListener("progress",function(event){
            if (onProgressHandler && event.lengthComputable) {
                onProgressHandler(event.loaded / oEvent.total);
            }
        });
        xhr.addEventListener("error", function(event){if(onErrorHandler) {
            onErrorHandler(event);
        }else{
            console.error(event)
        }});
        xhr.addEventListener("abort", function (event) {
            if(onAbortHandler){
                onAbortHandler(event);
            }
        });
        xhr.send();
        return xhr;
    }
    function postForm(url , data , onLoadHandler){
        var formData = new FormData();
        for(var key in data) {
            formData.append(key,data[key]);
        }
        var xhr = new XMLHttpRequest();
        //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.open('POST', url, true);
        xhr.addEventListener("load", function(event){
            if(this.readyState === 4) { // done
                if (this.status == 200) {
                    onLoadHandler(this.response);
                }
            }
        });
        xhr.send(formData);
        return xhr;
    }
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
      get("/chat",[{"key":"workspaceID","val":workspaceID}],function(resp){
          if(resp){
              var elems = JSON.parse(resp);
              if(elems) {
                  var messages = [];
                  elems.map(function (elem) {
                      messages.push(window.Notes.Utils.castObject(elem, Message));
                  });
                  callback(messages);
                  return;
              }
          }
          return([]);
      });

    }
    me.getChatForWorkspace = getChatForWorkspace;

    me.saveChatForWorkspace = function(workspaceID, message){
        postForm("/create/chat",{"author":message.author,"workspaceID":workspaceID,"text":message.text},function(resp){
            console.log(resp);
        });
    };

    function getWorkspaces (callback) {
        get("/workspaces",[],function(resp) {
            var workspaces = JSON.parse(resp);
            if (workspaces) {

                var ws = {};
                workspaces.map(function(elem){
                    ws[elem.id] = window.Notes.Utils.castObject(elem, Workspace);
                });
                callback(ws);
                return;
            }
            callback({});
        });
    }
    me.getWorkspaces  = getWorkspaces;

    me.updateWorkspace = function(workspace,callback){
        postForm("/update/workspace",
            {
                "label":workspace.label,
                "workspaceID":workspace.id,
            },callback);
    }
    me.saveWorkspace = function(workspace,callback){
        postForm("/create/workspace",{
                "owner":workspace.owner
            },callback);
    };
}
