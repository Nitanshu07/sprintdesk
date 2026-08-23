# API reference

## Local mock data

`GET /mock-data.json`

Returns users, sprints, tasks, comments, and initial notifications. Access is centralized in `getMockData()`.

## DummyJSON authentication

`POST https://dummyjson.com/auth/login`

Request: `{ username, password, expiresInMins }`

Response fields used: `firstName`, `lastName`, `username`, `image`, `accessToken`, `refreshToken`.

`POST https://dummyjson.com/auth/refresh`

Request: `{ refreshToken, expiresInMins }`

Response fields used: `accessToken`, `refreshToken`.

`GET https://dummyjson.com/auth/me`

Header: `Authorization: Bearer <accessToken>`.

Used during initial session restoration after a successful refresh.

## Notification polling

`GET https://jsonplaceholder.typicode.com/posts?_limit=5`

New post IDs are mapped to unread workspace notifications. Polling runs every 30 seconds, pauses when the document is hidden, and resumes when visible.
