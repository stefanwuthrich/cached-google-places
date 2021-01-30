package handler

import (
	"encoding/json"
	"net/http"
)

type ErrorMessage struct {
	Message   string `json:"message"`
	Reason    string `json:"reason"`
	Error     string `json:"error"`
	UiMessage string `json:"uiMessage"`
}

// respondwithJSON write json response format
func RespondwithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, _ := json.Marshal(payload)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}

// respondwithError return error message
func RespondWithError(w http.ResponseWriter, code int, msg ErrorMessage) {
	RespondwithJSON(w, code, msg)
}
