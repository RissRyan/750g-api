import { DIFFICULTY } from '../@types/recipe'

export class SevenFiftyQuerryBuilder {
	private queryString = new URLSearchParams()

	withTitle(t:string):this{
		this.queryString.append('q', t);
		return this;
	}

	withPreparationTime(d:number):this{
		this.queryString.append('time[]', d.toString());
		return this;
	}

	withTitleContaining(q:string):this{
		this.queryString.append('q',q);
		return this
	}

	withDifficulty(q:DIFFICULTY):this{
		this.queryString.append('difficulty%5B%5D', q);
		return this
	}


	/*withOccasion(p:):this{
		this.queryString.append()
	}*/ //too hard

 build():string{
	 return this.queryString.toString();
 }

}
