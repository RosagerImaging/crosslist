# Prompt:

Please help me come up with the ideal, super detailed prompt that i can give to Googles Gemini Pro 2.5 model to have it build me an app based on the description in the following markdown file. I would like to use Next.js for the main web app which would include the central hub that houses the user's inventory and business/tax analytics, the marketplace integration (unless determined that needs to be handled by a chrome browser extension), as well as the various configurations and settings for the different agentic systems. For building each specific autonomous agent and each agentic system, i'm not sure which coding language or framework would best facilitate that - whether it be Pydantic AI and some possible section of Python code, n8n, openAI's agent builder system, or some other means that I am unaware of to create these hyper-specific AI agents and have them work synergistically (and in parallel when possible) - in this regard i need suggestions. If you have any other clarifying questions before generating the prompt please go ahead and ask me so we are on the same page before you begin your task.

**IMPORTANT** remember you are only generating the initial prompt i can then give to an AI agent. DO NOT begin working on this project in any fashion other than generating the best, most detailed initial prompt that you can possibly imagine.

# Project: "Crosslist"

## Description:

An AI Native e-commerce reseller's inventory management system in the form of a web app using autonomous AI agents for each aspect of the process. There will be "systems" dedicated to each major step in a reseller's process and each system will be comprised of either a single AI agent or multiple AI agents which will automate the work after the user provides the necessary context/information. All of these systems of agents will be centrally organized and managed in one system hub or control center that will also include an organized accounting of the users entire inventory across all marketplaces. This inventory management hub will act as the central nervous system or the brain of the entire reseller's operation and as such will be where a user can also manage which marketplaces are registered and connected (with login credentials) as well as view detailed business analytics and retrieve/store tax related data and documentation, serving as a truly all encompassing central hub for someone trying to grow an e-commerce reseller business.

### AI Agent Systems:

#### "Crosslisting":

Made up of one AI agent that will be responsible for taking the user's listing from one marketplace (ie. eBay) and recreating it in all other marketplaces that the user has integrated with the central hub (ie. Poshmark, Etsy, etc).

#### "Listing Optimizer":

Made up of multiple AI agents:

- The first of which will be responsible for optimizing the listing's photos (removing the background, ensuring contrast is sufficient and the item is clearly visible)
- Another agent will be responsible for auto generating the item's description based on either the SKU from the item's tag or else a picture of the item submitted by the user (or both)
- Another agent will be responsible for pricing the item based on the current market value and the condition of the item (new with tags, like new, used, etc).

**Optional** This listing optimization system will include an optional integration with "Size.ly" - an online system for integrating measurements for clothing and other items commonly sold on used marketplaces such as furniture and many other items. For an additional fee the user would have access to hundreds of templates depending on the type of item being listed which could be automatically included in the listing photos based on the size indicated by the SKU, greatly reducing the rate of returns and increasing buyer confidence leading to more sales and more profits.

#### "Sourcing"

Agent(s) responsible for searching and finding high-demand, profitable products within the user's given niche by analyzing live marketplace data, trends, and competition

#### "Promotion"

Agent(s) responsible for sharing listings at peak activity times, sending targeted offers to potential buyers (for example users who "liked" an item), and reciprocating actions from other users such as "following", "liking", and "sharing" or "re-posting"

**IMPORTANT** This system will apply primarily to the marketplace Poshmark as taking actions such as liking and following other user's accounts is the primary means of promoting one's self and is an integral part of the platform which other existing subscription crosslisting apps have already created ways to automate - commonly referred to as a "Poshmark Bot". One important aspect of the way this system should function - and how our competition's solutions function - is to replicate human behavior in regards to the amount of times and frequency that these actions are taken, as Poshmark will temporarily restrict accounts that they suspect are using automation software for these tasks. However, unlike other apps which just restrict the frequency to below the threshold for restriction, our system (being AI driven) can actually replicate human behavior and have behavioral differences based on the age and size of the account, making it much more undetectable

#### "Trends"

Agent(s) responsible for identifying products starting to trend by tracking real-time market data allowing the user to be ahead of the curve regarding peak demand

#### "Liquidation"

Agent(s) responsible for discounting stale inventory based on user settings including a heavily discounted option which also sends automated targeted offers to competing resellers per marketplace in the attempt to still gain small marginal profits on the item, or breaking even at a minimum, while passing off the inventory to another account at a price that allows them to profit as well - in effect clearing out old, slow or non-moving inventory that otherwise may turn into costly liabilities for the user

#### "Customer Service"

Agent responsible for replying to initial messages from buyers or potential buyers based on user settings (ie. this chatbot system would be highly tune-able with settings that allow the user to input specific commonly received questions or messages that they would like the chatbot to reply to and with specific answers to each question if so desired, or else the chatbot would default to a helpful and patient tone and if unsure of the answer would inform the customer that their query would be forwarded to the user who would reply shortly).

### Chrome Extension:

In order to facilitate the connection to a user's chosen marketplaces, the use of a chrome browser extension may be necessary to be installed on a user's computer and if determined that our overall system/central hub requires this in order for each agenting system to be functional, the onboarding process once a user creates an account in the web app will include a process that walks the user through downloading and installing the chrome extension followed by connecting each desired marketplace and providing the authentication credentials.

**IMPORTANT** see Vendoo.com, Listperfectly.com, joinflyp.com, and Crosslist.com for examples of the use of a chrome extension for this same function.
