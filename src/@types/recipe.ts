type ingredients = {
	ingredients: string[],
	units: string,
	number:number
}

export enum DIFFICULTY {
	VERY_EASY,
	EASY,
	MEDIUM,
	HARD
}

export enum PRICE {
	CHEAP,
	MEDIUM,
	EXPENSIVE
}

export interface Recipe {
	name:string;
	
	url:string;

	ingredients:ingredients[];

  difficulty:DIFFICULTY;

  budget:PRICE;

  steps:string[];

	commentsNumber:number;

	prepTime:number;

	cookTime:number;
}
