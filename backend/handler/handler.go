package handler

import (
	"context"
	"fmt"
	"net/http"

	"github.com/go-chi/chi"
	"googlemaps.github.io/maps"
)

// Location Autocomplete
func GetLocations(w http.ResponseWriter, r *http.Request) {

	term := chi.URLParam(r, "term")

	resp := GetLocationForTerm(term)

	RespondwithJSON(w, http.StatusOK, resp)
}


// maps.AutocompletePrediction is probably much more then you need on client side, but for demo ok
func GetLocationForTerm(term string) (predictions []maps.AutocompletePrediction) {


	c, err := maps.NewClient(maps.WithAPIKey("YOUR_GOOGLE_API_KEY"))
	if err != nil {
		fmt.Print(err.Error())
		return predictions
	}
	request:=maps.QueryAutocompleteRequest{
		Input:    term,
		Offset:   0,
		Location: nil,
		Radius:   0,
		Language: "en-US",
	}

	predictionResponse,err:=c.QueryAutocomplete(context.Background(),&request)
	if err != nil {
		fmt.Println(err.Error())
		return predictions
	}
	predictions= predictionResponse.Predictions


	return predictions
}
