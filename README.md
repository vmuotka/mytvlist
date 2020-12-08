# MyTvList
[Live version](https://vmuotka-mytvlist.herokuapp.com)

## Technologies
Front-end
- React (react-router)
- axios
- [Chart.js](https://www.chartjs.org/)
- [TailwindCSS](https://tailwindcss.com/)

Back-end
- [TheMovieDB](https://developers.themoviedb.org/3/getting-started/introduction)
- Node (Express)
- axios
- bcrypt
- jsonwebtoken
- MongoDB (mongoose)

## Developing
To start developing the frontend, navigate to the client folder and run
``npm start``

To start developing the backend, navigate to the server folder. Create an .env file containing the following:
```
MONGODB_URI=<<connection uri to mongodb>>
SECRET=<<secret string used by jsonwebtoken>>
MOVIEDB_API=<<api key provided by TheMovieDB>>
```

After that, run ``npm run dev``