package main

import (
	"app/model"

	"encoding/json"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"log"
	"net/http"
	"time"
)

var session *mgo.Session

func main() {
	var err error
	session, err = mgo.Dial("localhost:32768")
	if err != nil {
		panic(err)
	}
	defer session.Close()
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/", fs)
	http.HandleFunc("/create/workspace", createWorkspaceHandler)
	http.HandleFunc("/search/workspace", searchWorkspaceHandler)
	http.HandleFunc("/workspaces", getWorkspacesHandler)
	log.Println("Listening...")
	http.ListenAndServe(":3000", nil)

}
func getWorkspacesHandler(w http.ResponseWriter, r *http.Request) {
	c := session.DB("app").C("workspaces")
	if r.Method == "GET" {
		var workspaces []model.Workspace
		findErr := c.Find(nil).All(&workspaces)
		if findErr != nil {
			log.Fatal(findErr)
		}
		js, jsErr := json.Marshal(workspaces)
		if jsErr != nil {
			http.Error(w, jsErr.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(js)
		return
	}
	w.WriteHeader(http.StatusBadRequest)
}
func searchWorkspaceHandler(w http.ResponseWriter, r *http.Request) {
	c := session.DB("app").C("workspaces")
	if r.Method == "POST" {
		err := r.ParseForm()
		if err != nil {
			panic(err)
		}
		key := r.PostFormValue("key")
		value := r.PostFormValue("value")
		var workspaces []model.Workspace
		findErr := c.Find(bson.M{key: value}).All(&workspaces)
		if findErr != nil {
			log.Fatal(findErr)
		}
		js, jsErr := json.Marshal(workspaces)
		if jsErr != nil {
			http.Error(w, jsErr.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(js)
		return
	}
	w.WriteHeader(http.StatusBadRequest)
}
func createWorkspaceHandler(w http.ResponseWriter, r *http.Request) {
	c := session.DB("app").C("workspaces")

	if r.Method == "POST" {
		err := r.ParseForm()
		if err != nil {
			panic(err)
		}

		label := r.PostFormValue("label")
		owner := r.PostFormValue("owner")
		id := bson.NewObjectId().Hex()
		created := time.Now().Unix()
		var workspace = model.Workspace{Label: label, Owner: owner, Id: id, Created: created}
		c.Insert(&workspace)
		js, jsErr := json.Marshal(workspace)
		if jsErr != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(js)
		return
	}
	w.WriteHeader(http.StatusBadRequest)
}
