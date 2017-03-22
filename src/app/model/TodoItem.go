package model

import "gopkg.in/mgo.v2/bson"

type TodoItem struct {
	Id          bson.ObjectId `bson:"_id" json:"id,omitempty"`
	WorkspaceId bson.ObjectId `bson:"workspaceId" json:"workspaceId,omitempty"`
	Text        string        `bson:"text" json:"text"`
}
