// i have no idea how to do this, i yoinked it from the marmitton api 
// Do i have to change my license to MIT now ? or GPL is still ok ? im confused now
import { HTMLElement, parse } from 'node-html-parser'
import { RecipeBuilder } from './750gRecipeBuilder'
import fetch from 'node-fetch'
import { Recipe } from '../@types/recipe'
import { DIFFICULTY } from '../@types/recipe'

export class RecipiesParser {
  /** ISO 8601 Regex. The only capture groups used for a recipe should be H and M */
  private static readonly ISO_8601_REGEX =
    /^P(?!$)(\d+(?:\.\d+)?Y)?(\d+(?:\.\d+)?M)?(\d+(?:\.\d+)?W)?(\d+(?:\.\d+)?D)?(T(?=\d)(\d+(?:\.\d+)?H)?(\d+(?:\.\d+)?M)?(\d+(?:\.\d+)?S)?)?$/

  static async parseSearchResults(dom: string, baseUrl: string): Promise<Partial<Recipe>[]> {
    const recipes = await Promise.all(
      parse(dom)
        .querySelectorAll('main div > a')
        .filter((e: HTMLElement) => e.getAttribute('class')?.includes('MRTN'))
        .map(async (e) => {
          const url = new URL(e.getAttribute('href')!.trim(), baseUrl)
          // Get as many info as we can from the recipe search result
          // These cannot be undefined.
          const rb = new RecipeBuilder()
            .withName(this.selectText(e, 'h4'))
            // .withDescription(this.selectText(e, '.recipe-card__description'))
            .withUrl(url.toString())
          // Load the recipe page
          const dom = await (await fetch(url.toString())).text()
          try {
            return await this.parseRecipe(dom, rb)
          } catch {
            // Some recipe are ads ?
            return undefined
          }
        })
    )

    return recipes.filter((r) => r !== undefined) as Partial<Recipe>[]
  }

  static async parseRecipe(
    dom: string,
    rb: RecipeBuilder = new RecipeBuilder()
  ): Promise<Partial<Recipe> | undefined> {
    // Set "raw" attributes. These doesn't need any processing steps
    const recipeRoot = parse(dom)

    let recipe: any = recipeRoot
      .querySelectorAll('script[type="application/ld+json"]')
      .map((el) => JSON.parse(this.getCleanText(el.childNodes[0] as HTMLElement)))
      // Not really needed but just to be sure
      .find((r) => r['@type'] === 'Recipe')

    if (recipe === undefined) return

    // Gather every raw attributes we can
    rb.withAuthor(recipe?.author)
      .withDescription(recipe?.description)

    // French attributes.
    const keywordsArray = recipe?.keywords.split(/,\s*/)
    // This is a very shady way to retrieve these two data.
    // However this is the only related data in the object ?
    const rawBudget = keywordsArray[keywordsArray.length - 1]
    const rawDifficulty = keywordsArray[keywordsArray.length - 2]
    rb.withDifficulty(this.parseDifficulty(rawDifficulty));

    // Time related attributes TODO
    rb.withPreparationTime(this.parseISO8601(recipe?.prepTime)).withTotalTime(
      this.parseISO8601(recipe?.totalTime)
    )

    // "Optional" attributes
    // Pure regex parsing isn't that consistent, better prepare for the worst
    const people = Number(recipe.recipeYield.match(/\d+/)[0])
    rb.withNumberServing(people)

    return rb.build()
  }

  /**
   * Parse an ISO 8601 string and return a duration in minutes.
   * @param duration
   * @private
   */
  private static parseISO8601(duration: string): number {
    // I really don't want to include moment just for this
    const matches = duration.match(this.ISO_8601_REGEX)
    // We're going to assume that the granularity is in minutes
    // And that a recipe don't take more than a few hours ?
    const minutes = matches?.[matches!.length - 2]?.match(/\d+/)?.[0] ?? 0
    const hours = matches?.[matches.length - 3]?.match(/\d+/)?.[0] ?? 0
    return Number(hours) * 60 + Number(minutes)
  }

  /**
   * Converts french textual representation of a recipe budget to an enum
   * @param budget
   */
  //static parseBudget(budget: string): PRICE {
  //  switch (budget.toLowerCase()) {
  //    case 'Bon marché':
  //      return PRICE.CHEAP
  //    case 'Moyen': //idk havent found one yet
  //      return PRICE.MEDIUM
  //    case 'Plat de fête':
  //      return PRICE.EXPENSIVE
  //    default:
  //      return PRICE.CHEAP
  //  }
  //}
  /**
   * Converts french textual representation of a recipe difficulty to an enum
   * @param budget
   */
  static parseDifficulty(difficulty: string): DIFFICULTY {
    switch (difficulty.toLowerCase()) {
      case 'Très facile':
        return DIFFICULTY.VERY_EASY
      case 'Facile':
        return DIFFICULTY.EASY
      case 'Moyenne':
        return DIFFICULTY.MEDIUM
      case 'Difficile':
        return DIFFICULTY.HARD
      default:
        return DIFFICULTY.MEDIUM
    }
  }

  private static selectText(root: HTMLElement|null, selector: string):string{

		if(!root) return "";
		let tmp:HTMLElement|null = root.querySelector(selector);
		if(!tmp) return "";

    return this.getCleanText(tmp);
  }

  private static getCleanText(e: HTMLElement) {
    return (
      e?.text
        ?.trim()

        // Replace unicode codes with characters
        .replace(/\\u([\d\w]{4})/gi, (match, grp) => String.fromCharCode(parseInt(grp, 16)))
        // Remove all tabs, and linebreaks
        .replace(/[\n\r\t]/g, '')
        // Allow only a single space between words
        .replace(/\s+/, ' ')
        // If there is no space between the first digit and a word (ingredients)
        // add it
        .replace(/(\d)([A-Za-z]{2,})/, '$1 $2')
    )
  }
}
