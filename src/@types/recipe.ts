type Ingredients = { // to export ?
	ingredients: string[],
	units: string,
	number:number
}

export enum DIFFICULTY {
	VERY_EASY = "Très facile",
	EASY = "Facile",
	MEDIUM = "Moyer",
	HARD = "Difficile"
}

/*export enum PRICE { //too hard to do, we have to look inside the recipe
	CHEAP,
	MEDIUM,
	EXPENSIVE
}*/

export interface Recipe {
	name:string;
	
	url:string;

	ingredients:Ingredients[];

  difficulty:DIFFICULTY;

  //budget:PRICE; 
	//
	//rating:number;

  steps:string[];

	commentsNumber:number;

	prepTime:number;

	cookTime:number;

	totalTime:number;

	numberServig:number;

	author:string;

	description:string;
}
