// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/DBConnection";
import creditCardRouter from "./routes/cards.routes";
import businessRouter from "./routes/businesses.routes";
import benefitRouter from "./routes/benefits.routes";
import recommendationRouter from "./routes/recommendation.routes";

import {BLUE, RESET_COLOR} from './constants/index'
dotenv.config();


const port = process.env.PORT || 3000;
const app: Express = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());

app.use("/cards", creditCardRouter);
app.use("/businesses", businessRouter)
app.use("/benefits", benefitRouter);
app.use("/recommendation", recommendationRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});


app.listen(port, () => {
  try{
    connectDB();
  }
  catch (error){
    console.log("[server]: connection failed to MongoDB")
  }
  console.log(`${BLUE}[server]${RESET_COLOR} Server is running at http://localhost:${port}`);
});