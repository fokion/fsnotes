package model

import "gopkg.in/mgo.v2/bson"

type Message struct {
	Id        bson.ObjectId `json:"id,omitempty" bson:"_id"`
	Text      string        `json:"text,omitempty" bson:"text"`
	Owner     string        `json:"author,omitempty" bson:"owner"`
	Timestamp int64         `json:"timestamp,omitempty" bson:"timestamp"`
	Workspace string        `json:"workspaceID,omitempty" bson:"workspace"`
}
