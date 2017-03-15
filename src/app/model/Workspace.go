package model

import "gopkg.in/mgo.v2/bson"

type Workspace struct {
	Label   string        `bson:"label" json:"label"`
	Id      bson.ObjectId `bson:"_id" json:"id,omitempty"`
	Owner   string        `bson:"owner" json:"owner,omitempty"`
	Created int64         `bson:"created" json:created`
}
