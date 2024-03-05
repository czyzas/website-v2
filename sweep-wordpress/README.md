## Overview

WP theme based on Bootstrap and jQuery with gulp integration.

## Bedrock

You need to add this to the "repositories" key at the very bottom

```json
{
    "repositories": {
        "3": {
            "type": "package",
            "package": {
                "name": "wpml/wpml-multilingual-cms",
                "version": "4.6.9",
                "type": "wordpress-plugin",
                "dist": {
                    "type": "zip",
                    "url": "https://wpml.org/?download=6088&user_id={%WPML_USER_ID}&subscription_key={%WPML_KEY}&t=1708350777&version={%VERSION}"
                },
                "require": {
                    "ffraenz/private-composer-installer": "^5.0"
                }
            }
        }
    }
}
```

## Installation

* Install Node.js
* Install Yarn (optionally)
* Install gulp
    * ```npm install -g gulp```
* Clone repository, put in wp-content/themes and navigate to it
* Install requirements
    * `npm install` or `yarn`
* Run app (This will build dist folder and start watch task)
    * `gulp`
* Run cleaning script
    * `npx wp-theme-cli@latest`
      Read more about it [here](https://github.com/tysian/wp-theme-cli).

Full tutorial (Lang:
polish) [here](https://docs.google.com/document/d/1m5nhCZirwmuwy4pt44wVxR2xEA0A7uifbrlaQJduvks/edit?usp=sharing).
