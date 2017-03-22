package model

import "gopkg.in/mgo.v2/bson"

type UserSecurityInfo struct {
	Id       bson.ObjectId `json:"id,omitempty" bson:"_id"`
	Email    string        `json:"email,omitempty" bson:"email"`
	Password []byte        `json:"password,omitempty" bson:"password"`
	Created  int64         `json:"created" bson:"created"`
}

type User struct {
	Id           bson.ObjectId   `json:"id,omitempty" bson:"_id"`
	WorkspaceIds []bson.ObjectId `json:"workspaceIds,omitempty" bson:"workspaceIds"`
}

type LoginResponse struct {
	Status     string `json:"status" bson:"status"`
	Url        string `json:"url" bson:"url"`
	ErrorState string `json:"errorState" bson:"errorState"`
}
type RegisterResponse struct {
	Status string `json:"status" bson:"status"`
}
