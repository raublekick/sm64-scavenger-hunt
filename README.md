# sm64-scavenger-hunt

## Super Mario 64 Scavenger Hunt Randomizer
          
Welcome to the Super Mario 64 Scavenger Hunt.

This tool can be used to create semi-randomized routes for running Super Mario 64. I created this with two uses in mind:
1. To randomize stars "required" before beating a ~70 star run.
2. To make "scavenger hunts" where completion is completing all of the stars defined by the generated rule set.
          
Some notes:
* Currently the randomizer does not check for any collisions in rules. For example, it could have conflicting rules like "No coin stars" and "All coin stars".
* Any pre-requisite stars are assumed to be known to the player.
* You can optionally add individual rules and stars to your liking.
            
Star list and notes taken without permission from [Mario Mayhem](https://www.mariomayhem.com/consoles/walkthroughs/mario_64_120_stars_guide.php)            
          
Future possible improvements:
* Reduce the size of the encoded object code by only including a rule/star identifier in the JSON object instead of encoding the entire object. The decoder will have to reconstruct the object based on the identifiers.
* Add pre-requisite information to the stars.
* Indicate whether stars are optional, potential, or required.

The rule engine is simple. Rules have associated tags, and stars have associated tags. The rule engine will find any star with the associated tag. The rule type determines if a rule needs one, all, or none of the stars matching the tag. If new rules follow this standard there is no need to add code for new rules. The only current exception to this is rules using the "all" tag meaning any course could fit the criteria.

If you have an idea for more tags or rules please feel free to submit an issue or just fork and submit a PR.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
