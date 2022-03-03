import { Recipe} from './@types/recipe';

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
}
