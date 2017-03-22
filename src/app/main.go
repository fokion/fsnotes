package main

import (
	"app/model"
	"encoding/json"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"log"
	"net/http"
	"os"
	"strings"
	"time"
)

var session *mgo.Session

func main() {
	var err error
	var databaseURL = os.Getenv("DATABASE_URL")
	if len(databaseURL) == 0 {
		databaseURL = os.Args[1]
	}
	var databasePORT = os.Getenv("DATABASE_PORT")
	if len(databasePORT) == 0 {
		databasePORT = os.Args[2]
	}
	log.Println(databaseURL)
	log.Println(databasePORT)
	log.Println("--------------")
	if len(databasePORT) == 0 && len(databaseURL) == 0 {
		log.Panic("NO DATABASE URL AND PORT")
	}
	session, err = mgo.Dial(strings.Join([]string{databaseURL, databasePORT}, ":"))
	if err != nil {
		panic(err)
	}
	defer session.Close()
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/", fs)
	http.HandleFunc("/login", loginUserHandler)
	http.HandleFunc("/register", registerUserHandler)
	http.HandleFunc("/overview", displayOverviewHandler)
	http.HandleFunc("/create/workspace", createWorkspaceHandler)
	http.HandleFunc("/update/workspace", updateWorkspaceHandler)
	http.HandleFunc("/search/workspace", searchWorkspaceHandler)
	http.HandleFunc("/chat", getWorkspaceChatHandler)
	http.HandleFunc("/create/chat", createChatMessageHandler)
	http.HandleFunc("/workspaces", getWorkspacesHandler)
	log.Println("Listening...")
	http.ListenAndServe(":3000", nil)

}
func userHandler(w http.ResponseWriter, r *http.Request) (email, pass string) {
	var username string
	var password string
	if r.Method == "POST" {
		err := r.ParseMultipartForm(1024)
		if err != nil {
			panic(err)
		}
		username = r.FormValue("username")
		password = r.FormValue("password")
	}
	return username, password
}
func registerUserHandler(w http.ResponseWriter, r *http.Request) {
	c := session.DB("app").C("users")
	username, password := userHandler(w, r)
	var user model.UserSecurityInfo
	err := c.Find(bson.M{"email": username}).One(&user)
	var registerResponse model.RegisterResponse
	if err == nil {
		registerResponse.Status = "EXISTS"
		js, jsErr := json.Marshal(registerResponse)
		if jsErr != nil {
			http.Error(w, jsErr.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(js)
		return
	}
	var hash, _ = bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	id := bson.NewObjectId()
	created := time.Now().Unix()

	user = model.UserSecurityInfo{Id: id, Email: username, Password: hash, Created: created}
	c.Insert(&user)
	registerResponse.Status = "DONE"
	js, jsErr := json.Marshal(registerResponse)
	if jsErr != nil {
		http.Error(w, jsErr.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
	return
}
func loginUserHandler(w http.ResponseWriter, r *http.Request) {
	c := session.DB("app").C("users")
	username, password := userHandler(w, r)

	var user model.UserSecurityInfo
	err := c.Find(bson.M{"email": username}).One(&user)
	var loginResponse model.LoginResponse
	loginResponse.Status = "ERROR"
	if err == nil {
		var hash, _ = bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		log.Println(bcrypt.CompareHashAndPassword(user.Password, hash))
		if nil == bcrypt.CompareHashAndPassword(user.Password, hash) {
			loginResponse.Status = "OK"
			loginResponse.Url = "/overview"
		}

	}
	js, jsErr := json.Marshal(loginResponse)
	if jsErr != nil {
		http.Error(w, jsErr.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(js)

}
func displayOverviewHandler(w http.ResponseWriter, r *http.Request) {

}
func updateWorkspaceHandler(w http.ResponseWriter, r *http.Request) {
	c := session.DB("app").C("workspaces")
	if r.Method == "POST" {
		err := r.ParseMultipartForm(1024)
		if err != nil {
			panic(err)
		}
		label := r.FormValue("label")
		workspaceId := r.FormValue("workspaceID")
		log.Println(label)
		log.Println(workspaceId)
		log.Println("--------------")
		workspaceObj := bson.M{"_id": bson.ObjectIdHex(workspaceId)}

		var r []model.Workspace
		c.Find(bson.M{"_id": bson.ObjectIdHex(workspaceId)}).All(&r)
		log.Print(r)
		log.Println("--------------")
		change := bson.M{"$set": bson.M{"label": label}}
		err = c.Update(workspaceObj, change)
		if err != nil {
			log.Println("Fail update")
			log.Print(err)
		}
		var workspace []model.Workspace
		findErr := c.Find(bson.M{"_id": bson.ObjectIdHex(workspaceId)}).All(&workspace)
		if findErr != nil {
			log.Fatal(findErr)
		}
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
func createChatMessageHandler(w http.ResponseWriter, r *http.Request) {
	c := session.DB("app").C("chat")
	if r.Method == "POST" {
		err := r.ParseMultipartForm(1024)
		if err != nil {
			panic(err)
		}
		author := r.FormValue("author")
		text := r.FormValue("text")
		workspaceId := r.FormValue("workspaceID")
		id := bson.NewObjectId()
		created := time.Now().Unix()

		var message = model.Message{Workspace: workspaceId, Text: text, Owner: author, Id: id, Timestamp: created}
		c.Insert(&message)
		var messages []model.Message
		c.Find(nil).All(&messages)

		js, jsErr := json.Marshal(message)
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
func getWorkspaceChatHandler(w http.ResponseWriter, r *http.Request) {
	c := session.DB("app").C("chat")
	if r.Method == "GET" {
		var messages []model.Message

		key := r.URL.Query().Get("workspaceID")

		findErr := c.Find(bson.M{"workspace": key}).Sort("timestamp").All(&messages)
		if findErr != nil {
			log.Fatal(findErr)
		}

		js, jsErr := json.Marshal(messages)
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
		err := r.ParseMultipartForm(1024)
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
		err := r.ParseMultipartForm(1024)
		if err != nil {
			panic(err)
		}

		label := r.PostFormValue("label")
		owner := r.PostFormValue("owner")
		id := bson.NewObjectId()
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
