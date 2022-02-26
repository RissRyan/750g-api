type ingredients = {
	ingredients: string[],
	units: string,
	number:number
}

enum difficulty {
	VERY_EASY,
	EASY,
	MEDIUM,
	HARD
}

enum price {
	CHEAP,
	MEDIUM,
	EXPENSIVE
}

export interface Recipe {
	name:string;
	
	url:string;

	ingredients:ingredients[];

  difficulty:difficulty;

  budget:price;

  steps:string[];

	commentsNumber:number;

	prepTime:number;

	cookTime:number;
}
