---
title: Vichama API
description: API REST realizada para mi proyecto personal. Busca ser un mock de las APIs de música que ya no brindan archivos mp3.
---

Información de los Endpoints disponibles:

- [GET] /: muestra una página HTML que tiene como contenido las playlists y canciones que tiene la API.
- [GET] /api: devuelve un mensaje de descripción de las APIs disponibles en el proyecto.
- [GET] /health: devuelve un mensaje de éxito indicando que el servidor está funcionando correctamente.

## Songs

- [GET] /api/songs: devuelve una lista de las canciones.
- [GET] /api/songs/:id: devuelve los detalles de una canción en específico identificado por su ID.
- [POST] /api/songs: crea una nueva canción con los datos proporcionados en el cuerpo de la solicitud.
- [PATCH] /api/songs/:id: actualiza los datos de una canción en específico identificado por su ID.
- [DELETE] /api/songs/:id: elimina una canción en específico identificado por su ID.

## Playlists

- [GET] /api/playlists: devuelve una lista de las playlists.
- [GET] /api/playlists/:id: devuelve los detalles de una playlist en específico identificado por su ID.
- [POST] /api/playlists: crea una nueva playlist con los datos proporcionados en el cuerpo de la solicitud.
- [PATCH] /api/playlists/:id: actualiza los datos de una playlist en específico identificado por su ID.
- [DELETE] /api/playlists/:id: elimina una playlist en específico identificado por su ID.

## Playlists and Songs

- [POST] /api/playlists/:id/songs/:songId: Agrega una canción a la playlist
- [DELETE] /api/playlists/:id/songs/:songId: Remueve una canción de la playlist
