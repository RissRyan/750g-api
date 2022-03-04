import { searchRecipies, SevenFiftyQuerryBuilder, DIFFICULTY, Recipe }
from './750g-api'

const qb = new SevenFiftyQuerryBuilder();
// A query builder is provided to make complex queries
const query = qb
  .withTitleContaining('soja')
  .withPreparationTime(45)
  .withDifficulty(DIFFICULTY.EASY)
  .build()
// Fetch the recipes
const recipes: Recipe[] = await searchRecipies(query)
