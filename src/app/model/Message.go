package model

type Message struct {
	Id        string `json:"id" bson:"_id,omitempty"`
	Text      string `json:"text" bson:"text,omitempty"`
	Owner     string `json:"author" bson:"owner,omitempty"`
	Timestamp int64  `json:"timestamp" bson:"timestamp,omitempty"`
	Workspace string `json:"workspaceID" bson:"workspace,omitempty"`
}
