package main

import (
	"log"
	"net/http"
)

func main() {
	//session, err := mgo.Dial("localhost")
	//if err != nil {
	//	panic(err)
	//}
	//defer session.Close()
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/", fs)

	log.Println("Listening...")
	http.ListenAndServe(":3000", nil)
}
