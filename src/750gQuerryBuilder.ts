export class SevenFiftyQuerryBuilder {
	private queryString = new URLSearchParams()

	withTitle(t:string):this{
		this.queryString.append('q', t);
		return this;
	}

	withDifficulty(d:string):this{
		this.queryString.append('difficulty[]', String(d));
		return this;
	}


}
