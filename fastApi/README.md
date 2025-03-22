# Backend for Dekucards

## Description / Design info

As of 8/3/2025 this API is very overkill, a solution more appropriate to this project and scope
is to just use server functions, or just directly fetch from SUPABASE(DB) from the fronted. There is no need 
for a dedicated api, the buisness logic isn't complex enough and all the backend services that would typically managed by an API
are automated by services such as cloudfare or supabase.

I may however in the future implement my own caching, DB syncing, load balancing, reverse proxy etc. Which would
validate this API's existance.

The reason I did this was just to gain experience in developing an api from start to finish and get experience
in python backends. Probably not a bad thing to seperate some of the buisness logic from the frontend anyway.

## Starting locally

For port 8000
```python main ```

else 
```uvicorn main:app --host 0.0.0.0 --port 8000```

## Deploying

Make sure to set ENVIRONMENT=production

## Gen local certs for local dev

Install certs for localhost using mkcert.

## Future me

Migrate to async FastAPI incase of performance issues