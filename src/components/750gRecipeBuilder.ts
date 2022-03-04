import { Recipe, DIFFICULTY } from '../@types/recipe';

export class RecipeBuilder{

	private infos: Partial<Recipe> = {};

	withName(name:string):this{
		this.infos['name'] = name;
		return this
	}

  withUrl(url: string): this {
    this.infos['url'] = url
    return this
  }

	withAuthor(aut:string):this{
		this.infos['author'] = aut;
		return this;
	}

	withDescription(des:string):this{
		this.infos["description"] = des;
		return this;
	}

	withDifficulty(dif:DIFFICULTY):this{
		this.infos["difficulty"] = dif;
		return this;
	}
	
	//withBudget(bud:number):this{
	//	this.infos["budget"] = bud;
	//	return this;
	//}

	withPreparationTime(time:number):this{
		this.infos["prepTime"] = time;
		return this;
	}

	withCookTime(time:number):this{
		this.infos["cookTime"] = time;
		return this;
	}

	withTotalTime(time:number):this{
		this.infos["totalTime"] = time;
		return this;
	}

	withNumberServing(num:number):this{
		this.infos["numberServig"] = num;
		return this;
	}

	build(){
		return this.infos;
	}

}
