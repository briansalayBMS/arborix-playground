# Arborix — Implementation Notes

## Dev Server

Always restart fresh after component changes:

```
npm run dev:fresh
```

Never trust a 500 error without first running dev:fresh.
If the error persists after a fresh restart, then it is a real error.
