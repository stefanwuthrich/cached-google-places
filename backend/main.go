package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"./handler"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"

	"github.com/victorspringer/http-cache"
	"github.com/victorspringer/http-cache/adapter/memory"

	chiMiddleware "github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
)

func main() {



	router :=Routes()
	fmt.Print("Server starting: http://localhost:9090")
	fmt.Println(http.ListenAndServe(":9090", router))
	
}

//Routes
func Routes() *chi.Mux {
	router := chi.NewRouter()


	// Basic CORS
	// for more ideas, see: https://developer.github.com/v3/#cross-origin-resource-sharing
	routerCors := cors.New(cors.Options{
		// AllowedOrigins: []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"*"},
		AllowedMethods:   []string{"GET", "OPTIONS", "HEAD"},
		AllowedHeaders:   []string{"X-File-Name", "Cache-Control", "X-Requested-With", "Accept", "Accept-Encoding", "Accept-Language", "Accept-Control-Allow-Origin", "Authorization", "JWT-Authorization", "Content-Type", "X-CSRF-Token", "X-AppAccountId"},
		ExposedHeaders:   []string{"*", "Authorization", "JWT-Authorization", "Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	})

	router.Use(
		render.SetContentType(render.ContentTypeJSON), // Set content-Type headers as application/json
		chiMiddleware.DefaultCompress, // Compress results, mostly gzipping assets and json
		chiMiddleware.RedirectSlashes, // Redirect slashes to no slash URL versions
		chiMiddleware.Recoverer,       // Recover from panics without crashing server
		routerCors.Handler,
	)

	router.Route("/", func(r chi.Router) {
		// Cache Middleware Config
		memcached, err := memory.NewAdapter(
			memory.AdapterWithAlgorithm(memory.LRU),
			memory.AdapterWithCapacity(1000000),
		)
		if err != nil {
			fmt.Println(err.Error())
			os.Exit(1)
		}
		cacheClient, err := cache.NewClient(
			cache.ClientWithAdapter(memcached),
			cache.ClientWithTTL(24 * time.Hour),
			cache.ClientWithRefreshKey("opn"),
		)
		if err != nil {
			fmt.Println(err.Error())
			os.Exit(1)
		}
		// Cache Google Place API calls
		hLocation := http.HandlerFunc(handler.GetLocations)

		r.Route("/", func(r chi.Router) {

			// location autocomplete
			r.With().Get("/{term}", cacheClient.Middleware(hLocation).ServeHTTP)
		})
	})

	return router
}