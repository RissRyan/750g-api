import { Recipe, DIFFICULTY } from './@types/recipe';
import { SevenFiftyQuerryBuilder } from './components/750gQuerryBuilder';
import {RecipiesParser} from './components/recipes-parser';
import fetch from 'node-fetch'

export class SevenError extends Error{};//TODO

const baseUrl:string = "https://750g.com";
let endpoint:string = `${baseUrl}/recherche/`;

const recipePerPage = 10;

export async function searchRecipies(q:string, opt?:number)
:Promise<Recipe[]>{
	//const options = Object.assign(recipePerPage, opt);
  const recipes: Partial<Recipe>[] = [];
	

  for (let i = 1; recipes.length < recipePerPage ; i++) {
    let url = `${endpoint}?${q}`
    url += `&page=${i + 1}`
    const request = await fetch(url)
    if (request.status !== 200) {console.log("res != 200"); break}
    const htmlBody = await request.text()
    recipes.push(...(await RecipiesParser.parseSearchResults(htmlBody, baseUrl)))
  }
  return recipes.slice(0, recipePerPage) as Recipe[]
}

export {SevenFiftyQuerryBuilder, DIFFICULTY}

export type { Recipe }
