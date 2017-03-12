package model

type Workspace struct {
	Label   string `json:"label"`
	Id      string `json:"id"`
	Owner   string `json:"owner"`
	Created int64  `json:created`
}
